import type { IConstruct } from 'constructs';
import { StringParameter as SSMStringParameter } from 'aws-cdk-lib/aws-ssm';
import { RemovalPolicy, Stack, type StackProps, Tags } from 'aws-cdk-lib';
import { Effect, PolicyStatement, Role, type IRole, ServicePrincipal } from 'aws-cdk-lib/aws-iam';
import { type IRepository, Repository, RepositoryEncryption } from 'aws-cdk-lib/aws-ecr';
import { type IPublicHostedZone, PublicHostedZone } from 'aws-cdk-lib/aws-route53';
import { CrossRegionParameter } from '@alma-cdk/cross-region-parameter';
import { Artifact, Pipeline } from 'aws-cdk-lib/aws-codepipeline';
import { BuildSpec, BuildEnvironmentVariableType, ComputeType, LinuxBuildImage, PipelineProject } from 'aws-cdk-lib/aws-codebuild';
import { CloudFormationCreateReplaceChangeSetAction, CloudFormationExecuteChangeSetAction, CodeBuildAction, CodeStarConnectionsSourceAction } from 'aws-cdk-lib/aws-codepipeline-actions';
import type { Config, EnvironmentConfig } from '..';
import { AbstractStack } from './AbstractStack';

export class Initialize extends AbstractStack {
  /**
   * ECR Repositories.
   *
   * @protected
   * @var { [key: string]: IRepository }
   */
  protected repository: IRepository;

  /**
   * Hosted zone instance.
   *
   * @protected
   * @var { AllerHostedZoneResource }
   */
  protected hostedZone: IPublicHostedZone;

  /**
   * Pipeline role instance.
   *
   * @protected
   * @var { IRole }
   */
  protected pipelineRole: IRole;

  /**
   * CodeBuild role instance.
   *
   * @protected
   * @var { IRole }
   */
  protected codeBuildRole: IRole;

  /**
   * Create Initialize class.
   *
   * @param scope { IConstruct }
   * @param id { string }
   * @param config { any }
   * @param props { Partial<StackProps> }
   */
  constructor(scope: IConstruct, id: string, config: Config, environments: EnvironmentConfig[], props?: Partial<StackProps>) {
    super(scope, id, config, props);

    // Create role and required ECR repositories.
    this.createRoles().createECRRepositories().createHostedZone();

    // Create a deployment pipeline, for each provided environment.
    environments.forEach((config: EnvironmentConfig) => {
      this.createEnvironment(config);
    });
  }

  /**
   * Create IAM roles.
   *
   * @returns { this }
   */
  protected createRoles = (): this => {
    // Create Pipeline role.
    const pipelineRole = this.pipelineRole = new Role(this, `${this.config.name}-role-pipeline`, {
      assumedBy: new ServicePrincipal('codepipeline.amazonaws.com')
    });

    pipelineRole.addToPolicy(new PolicyStatement({
      effect: Effect.ALLOW,
      resources: ['*'],
      actions: [
        'cloudformation:CreateStack',
        'cloudformation:DescribeStacks',
        'cloudformation:DeleteStack',
        'cloudformation:UpdateStack',
        'cloudformation:CreateChangeSet',
        'cloudformation:ExecuteChangeSet',
        'cloudformation:DeleteChangeSet',
        'cloudformation:DescribeChangeSet',
        'cloudformation:SetStackPolicy',
        'ec2:*',
        'ecs:DescribeServices',
        'ecs:DescribeTaskDefinition',
        'ecs:DescribeTasks',
        'ecs:ListTasks',
        'ecs:RegisterTaskDefinition',
        'ecs:UpdateService',
        'logs:CreateLogGroup',
        'logs:CreateLogStream',
        'logs:PutLogEvents',
        'sns:Publish',
        's3:*',
        'ssm:GetParameter',
      ]
    }));

    // Create Codebuild role.
    const codeBuildRole = this.codeBuildRole = new Role(this, `${this.config.name}-role-codebuild`, {
      assumedBy: new ServicePrincipal('codebuild.amazonaws.com')
    });

    codeBuildRole.addToPolicy(new PolicyStatement({
      effect: Effect.ALLOW,
      resources: ['*'],
      actions: [
        'ec2:*',
        's3:*',
        'ssm:GetParameter',
      ]
    }));

    return this;
  }

  /**
   * Create ECR repositories.
   *
   * @returns { this }
   */
  protected createECRRepositories = (): this => {
    const repository = this.repository = new Repository(this, `${this.config.name}-ecr-app`, {
      repositoryName: `${this.config.name}-app`,
      encryption: RepositoryEncryption.AES_256,
      removalPolicy: RemovalPolicy.DESTROY,
      imageScanOnPush: true,
    });

    // Add lifecycle rule to repository.
    repository.addLifecycleRule({
      maxImageCount: 100
    });

    // Grant Codebuild role pull/push permissions.
    repository.grantPullPush(this.codeBuildRole);

    // Add tag to resource.
    Tags.of(repository).add('Name', this.config.name);

    // Create SSM parameter with instance references.
    this.createSSMParameter(`${this.config.name}-ecr-app-name`, `${this.config.name}/ecr/app/name`, repository.repositoryName);
    this.createSSMParameter(`${this.config.name}-ecr-app-uri`, `${this.config.name}/ecr/app/uri`, repository.repositoryUri);
    this.createSSMParameter(`${this.config.name}-ecr-app-arn`, `${this.config.name}/ecr/app/arn`, repository.repositoryArn);

    return this;
  }

  /**
   * Create hosted zone.
   *
   * @returns { this }
   */
  protected createHostedZone = (): this => {
    const hostedZone = this.hostedZone = new PublicHostedZone(this, `${this.config.name}-hosted-zone-public-hackathon-podcast`, {
      zoneName: this.config.domain
    });

    // Add tag to resource.
    Tags.of(hostedZone).add('Name', this.config.name);

    // Add cross-region SSM parameter with Hosted Zone ID.
    new CrossRegionParameter(this, `${this.config.name}-cross-region-hosted-zone-public-id`, {
      region: 'us-east-1',
      name: `/${this.config.name}/hosted-zone/public/hackathon-podcast/id`,
      description: 'Hosted Zone ID reference',
      value: hostedZone.hostedZoneId,
    });
    new CrossRegionParameter(this, `${this.config.name}-cross-region-hosted-zone-public-name`, {
      region: 'us-east-1',
      name: `/${this.config.name}/hosted-zone/public/hackathon-podcast/name`,
      description: 'Hosted Zone Name reference',
      value: hostedZone.zoneName,
    });

    // Create SSM parameter with instance reference.
    this.createSSMParameter(`${this.config.name}-hosted-zone-public-hackathon-podcast-id`, `${this.config.name}/hosted-zone/public/hackathon/podcast/id`, hostedZone.hostedZoneId);
    this.createSSMParameter(`${this.config.name}-hosted-zone-public-hackathon-podcast-name`, `${this.config.name}/hosted-zone/public/hackathon/podcast/name`, hostedZone.zoneName);

    return this;
  }

  /**
   * Create environment based on provided config.
   *
   * @param config { EnvironmentConfig }
   * @returns { this }
   */
  protected createEnvironment = (config: EnvironmentConfig): this => {
    // Create CodePipeline for environment.
    const pipeline = new Pipeline(this, `${config.name}-${config.environment}-pipeline`, {
      pipelineName: `${config.name}-${config.environment}`,
      role: this.pipelineRole,
      restartExecutionOnUpdate: true,
    });

    // Pipeline Artifacts.
    const sourceOutput = new Artifact(`${config.name}-${config.environment}-pipeline-artifact-source`);
    const applicationOutput = new Artifact(`${config.name}-${config.environment}-pipeline-artifact-application-synth`);

    // Get source from GitHub.
    const source = new CodeStarConnectionsSourceAction({
      actionName: 'GitHub',
      connectionArn: SSMStringParameter.valueFromLookup(this, `/${this.config.name}/codestar/connection/github`),
      owner: config.repository.owner,
      repo: config.repository.name,
      branch: config.repository.branch,
      output: sourceOutput
    });

    // Add "Source" stage to pipeline.
    const sourceStage = pipeline.addStage({ stageName: 'Source' });
    sourceStage.addAction(source);

    // Add "Application" stage to pipeline.
    const applicationStage = pipeline.addStage({ stageName: 'Application' });

    // Add Synth action to "Application" stage.
    applicationStage.addAction(new CodeBuildAction({
      actionName: 'Synth',
      input: sourceOutput,
      outputs: [applicationOutput],
      project: new PipelineProject(this, `${config.name}-${config.environment}-pipeline-codebuild-application-synth`, {
        projectName: `${config.name}-${config.environment}-application-synth`,
        role: this.codeBuildRole,
        buildSpec: BuildSpec.fromObject({
          version: 0.2,
          phases: {
            install: {
              'runtime-versions': {
                nodejs: '18'
              },
              commands: [
                'npm config set @aller:registry https://npm.pkg.github.com/aller',
                'npm config set //npm.pkg.github.com/:_authToken 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',
                'npm install'
              ]
            },
            build: {
              commands: [
                `CDK_DEBUG=true npx cdk synth --quiet --context CommitId=$TAG ${config.name}-${config.environment}-application`
              ]
            }
          },
          artifacts: {
            files: ['cdk.out/*.template.json'],
            'discard-paths': 'yes'
          }
        }),
        environment: {
          computeType: ComputeType.SMALL,
          buildImage: LinuxBuildImage.STANDARD_6_0,
          privileged: true
        }
      }),
      runOrder: 1,
    }));

    // Add Docker Build action to "Application" stage.
    applicationStage.addAction(new CodeBuildAction({
      actionName: 'Build',
      input: sourceOutput,
      project: new PipelineProject(this, `${config.name}-${config.environment}-pipeline-codebuild-application`, {
        projectName: `${config.name}-${config.environment}-application`,
        role: this.codeBuildRole,
        buildSpec: BuildSpec.fromObject({
          version: '0.2',
          phases: {
            install: {
              'runtime-versions': {
                nodejs: '18'
              },
              commands: [
                'npm config set @aller:registry https://npm.pkg.github.com/aller',
                'npm config set //npm.pkg.github.com/:_authToken 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',
                'npm install'
              ]
            },
            pre_build: {
              commands: [
                'TAG="$(echo ${CODEBUILD_RESOLVED_SOURCE_VERSION} | head -c 8)"',
                'aws ecr get-login-password | docker login --username AWS --password-stdin "${AWS_ECR}"',
              ]
            },
            build: {
              'runtime-versions': {
                nodejs: '18'
              },
              commands: [
                'npm run build'
              ]
            },
            post_build: {
              commands: [
                'docker build --compress --tag ${ECR_REPOSITORY_DOMAIN}:${TAG} --file .aws/docker/Dockerfile ./dist',
                'docker tag ${ECR_REPOSITORY_DOMAIN}:${TAG} ${ECR_REPOSITORY_DOMAIN}:latest',
                'docker push "${ECR_REPOSITORY_DOMAIN}:${TAG}"',
                'docker push "${ECR_REPOSITORY_DOMAIN}:latest"'
              ]
            }
          }
        }),
        environment: {
          computeType: ComputeType.SMALL,
          buildImage: LinuxBuildImage.STANDARD_6_0,
          privileged: true,
          environmentVariables: {
            AWS_ECR: { type: BuildEnvironmentVariableType.PLAINTEXT, value: `${Stack.of(this).account}.dkr.ecr.${Stack.of(this).region}.amazonaws.com` },
            COMMIT_ID: { type: BuildEnvironmentVariableType.PLAINTEXT, value: source.variables.commitId },
            ECR_REPOSITORY_DOMAIN: { type: BuildEnvironmentVariableType.PLAINTEXT, value: this.repository.repositoryUri },
          }
        },
      }),
      runOrder: 3
    }));

    // Add Prepare ChangeSet action to "Application" stage.
    applicationStage.addAction(new CloudFormationCreateReplaceChangeSetAction({
      actionName: 'Prepare',
      stackName: `${config.name}-${config.environment}-application`,
      adminPermissions: true,
      changeSetName: `${config.name}-${config.environment}-application-change-set`,
      templatePath: applicationOutput.atPath(`${config.name}-${config.environment}-application.template.json`),
      runOrder: 2,
    }));

    // Add Execute ChangeSet action to "Application" stage.
    applicationStage.addAction(new CloudFormationExecuteChangeSetAction({
      actionName: 'Deploy',
      stackName: `${config.name}-${config.environment}-application`,
      changeSetName: `${config.name}-${config.environment}-application-change-set`,
      runOrder: 4,
    }));

    return this;
  }
}
