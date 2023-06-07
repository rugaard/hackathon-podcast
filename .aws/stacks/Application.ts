import type { IConstruct } from 'constructs';
import { RemovalPolicy, Stack, type StackProps, Tags, Duration } from 'aws-cdk-lib';
import { StringParameter as SSMStringParameter } from 'aws-cdk-lib/aws-ssm';
import { CnameRecord, type IPublicHostedZone, PublicHostedZone, ARecord, RecordTarget } from 'aws-cdk-lib/aws-route53';
import { type ISecurityGroup, InterfaceVpcEndpointAwsService, IpAddresses, Peer, Port, SecurityGroup, SubnetType, Vpc } from 'aws-cdk-lib/aws-ec2';
import { Certificate, CertificateValidation, type ICertificate } from 'aws-cdk-lib/aws-certificatemanager';
import { Effect, type IRole, PolicyStatement, Role, ServicePrincipal } from 'aws-cdk-lib/aws-iam';
import { type IRepository, Repository } from 'aws-cdk-lib/aws-ecr';
import { AwsLogDriver, Cluster, ContainerDefinition, ContainerImage, FargatePlatformVersion, FargateService, FargateTaskDefinition, type ICluster, type IFargateService, Protocol, UlimitName } from 'aws-cdk-lib/aws-ecs';
import { LogGroup, RetentionDays } from 'aws-cdk-lib/aws-logs';
import { AwsCustomResource, AwsCustomResourcePolicy } from 'aws-cdk-lib/custom-resources';
import { ApplicationListener, ApplicationLoadBalancer, ApplicationProtocol, ApplicationTargetGroup, type IApplicationLoadBalancer, ListenerAction, TargetType, ApplicationListenerCertificate, ListenerCertificate } from 'aws-cdk-lib/aws-elasticloadbalancingv2';
import { LoadBalancerV2Origin } from 'aws-cdk-lib/aws-cloudfront-origins';
import { AllowedMethods, CachePolicy, Distribution, OriginProtocolPolicy, OriginRequestCookieBehavior, OriginRequestHeaderBehavior, OriginRequestPolicy, OriginRequestQueryStringBehavior, ResponseHeadersPolicy, ViewerProtocolPolicy } from 'aws-cdk-lib/aws-cloudfront';
import { AbstractStack } from './AbstractStack';
import type { EnvironmentConfig } from '..';
import { LoadBalancerTarget } from 'aws-cdk-lib/aws-route53-targets';

export class Application extends AbstractStack {
  /**
   * Project configuration.
   *
   * @protected
   * @readonly
   * @var { EnvironmentConfig }
   */
  declare protected readonly config: EnvironmentConfig;

  /**
   * Hosted zone instance.
   *
   * @protected
   * @var { IPublicHostedZone }
   */
  protected hostedZone: IPublicHostedZone;

  /**
   * Security groups.
   *
   * @protected
   * @var { [key: string]: ISecurityGroup }
   */
  protected securityGroups: { [key: string]: ISecurityGroup } = {}

  /**
   * VPC instance.
   *
   * @protected
   * @var { AllerVpcResource }
   */
  protected vpc: any;

  protected certificate: ICertificate;

  /**
   * ECR Repositories.
   *
   * @protected
   * @var { IRepository }
   */
  protected repository: IRepository;

  /**
   * ECS Fargate Cluster role.
   *
   * @var { AllerRoleResource }
   */
  protected ecsClusterRole: IRole;

  /**
   * ECS Fargate Cluster.
   *
   * @var { ICluster }
   */
  protected ecsCluster: ICluster;

  /**
   * ECS Fargate Service.
   *
   * @var { FargateService }
   */
  protected ecsService: FargateService;

  /**
   * Application Load Balancer.
   *
   * @var { AllerApplicationLoadBalancerResource }
   */
  protected applicationLoadBalancer: IApplicationLoadBalancer;

  /**
   * Application constructor.
   *
   * @param scope { IConstruct }
   * @param id { string }
   * @param config { NuxtConfig }
   * @param props { Partial<StackProps> }
   */
  constructor(scope: IConstruct, id: string, config: any, props?: Partial<StackProps>) {
    super(scope, id, config, props);

    this.loadDependencies();

    this.network().certificates().cluster().service().loadBalancer();
  }

  /**
   * Load dependencies.
   *
   * @returns { this }
   */
  protected loadDependencies = (): this => {
    // Load Hosted Zone.
    this.hostedZone = PublicHostedZone.fromPublicHostedZoneAttributes(this, `${this.config.name}-hosted-zone-public-hackathon-podcast-load`, {
      hostedZoneId: SSMStringParameter.valueFromLookup(this, `/${this.config.name}/hosted-zone/public/hackathon/podcast/id`),
      zoneName: SSMStringParameter.valueFromLookup(this, `/${this.config.name}/hosted-zone/public/hackathon/podcast/name`)
    }) as PublicHostedZone;

    // Load ECR repository.
    this.repository = Repository.fromRepositoryName(
      this,
      `${this.config.name}-ecr-${this.config.environment}-appliction-app-load`,
      SSMStringParameter.valueForStringParameter(this, `/${this.config.name}/ecr/app/name`)
    ) as Repository;

    return this;
  }

  /**
   * Create network resources.
   *
   * @returns { this }
   */
  protected network = (): this => {
    // Create VPC.
    const vpc = this.vpc =  new Vpc(this, `${this.config.name}-vpc-${this.config.environment}`, {
      vpcName: this.config.name,
      ipAddresses: IpAddresses.cidr('10.0.0.0/16'),
      natGateways: 2,
      maxAzs: 3,
      subnetConfiguration: [
        {
          name: 'public-subnet',
          subnetType: SubnetType.PUBLIC,
          cidrMask: 24,
        },
        {
          name: 'private-subnet',
          subnetType: SubnetType.PRIVATE_WITH_EGRESS,
          cidrMask: 24,
        },
        {
          name: 'isolated-subnet',
          subnetType: SubnetType.PRIVATE_ISOLATED,
          cidrMask: 24,
        },
      ],
    });

    // Create base security group
    const securityGroup = this.securityGroups['base'] = new SecurityGroup(this, `${this.config.name}-security-group-${this.config.environment}-base`, {
      vpc: vpc,
      securityGroupName: `${this.config.name}-${this.config.environment}-base`,
      allowAllOutbound: true,
    });

    // Allow self communication.
    securityGroup.addIngressRule(securityGroup, Port.allTraffic(), 'Allow security group to talk to itself');

    // Add tag to security group.
    Tags.of(securityGroup).add('Name', this.config.name);

    // Create SSM parameter with instance reference.
    this.createSSMParameter(`${this.config.name}-security-group-${this.config.environment}-base-id`, `${this.config.name}/security-groups/${this.config.environment}/base/id`, securityGroup.securityGroupId);

    // Add interfaces to VPC.
    vpc.addInterfaceEndpoint('cloudwatch', {
      securityGroups: [securityGroup],
      service: InterfaceVpcEndpointAwsService.CLOUDWATCH_LOGS
    });
    vpc.addInterfaceEndpoint('ecr', {
      securityGroups: [securityGroup],
      service: InterfaceVpcEndpointAwsService.ECR
    });
    vpc.addInterfaceEndpoint('ecr-docker', {
      securityGroups: [securityGroup],
      service: InterfaceVpcEndpointAwsService.ECR_DOCKER
    });
    vpc.addInterfaceEndpoint('ssm', {
      securityGroups: [securityGroup],
      service: InterfaceVpcEndpointAwsService.SSM
    });

    return this;
  }

  /**
   * Create certificate.
   *
   * @returns { this }
   */
  protected certificates = (): this => {
    const certificate = this.certificate = new Certificate(this, `${this.config.name}-certificate-${this.config.environment}`, {
      domainName: this.config.domain,
      validation: this.hostedZone ? CertificateValidation.fromDns(this.hostedZone) : CertificateValidation.fromDns()
    });

    Tags.of(certificate).add('Name', this.config.name);

    // Create SSM parameter with instance reference.
    this.createSSMParameter(`${this.config.name}-certificate-${this.config.environment}-arn`, `${this.config.name}/certificate/${this.config.environment}/arn`, certificate.certificateArn);

    return this;
  }

  /**
   * Create ECS Fargate cluster.
   *
   * @returns { this }
   */
  protected cluster = (): this => {
    // Create cluster.
    const ecsCluster = this.ecsCluster = new Cluster(this, `${this.config.name}-fargate-cluster-${this.config.environment}`, {
      clusterName: this.config.environment,
      containerInsights: true,
      enableFargateCapacityProviders: true,
      vpc: this.vpc,
    });

    // Add tags to resource.
    Tags.of(ecsCluster).add('Name', this.config.name);

    // Create SSM parameter with instance references.
    this.createSSMParameter(`${this.config.name}-ecs-fargate-cluster-${this.config.environment}-arn`, `${this.config.name}/ecs/fargate/cluster/${this.config.environment}/arn`, ecsCluster.clusterArn);
    this.createSSMParameter(`${this.config.name}-ecs-fargate-cluster-${this.config.environment}-name`, `${this.config.name}/ecs/fargate/cluster/${this.config.environment}/name`, ecsCluster.clusterName);

    // Create cluster role.
    const clusterRole = this.ecsClusterRole = new Role(this, `${this.config.name}-ecs-cluster`, {
      assumedBy: new ServicePrincipal('ecs-tasks.amazonaws.com')
    });
    clusterRole.addToPolicy(new PolicyStatement({
      effect: Effect.ALLOW,
      resources: ['*'],
      actions: [
        'ec2:DescribeAvailabilityZones',
        'ecs:ExecuteCommand',
        'logs:CreateLogStream',
        'logs:PutLogEvents',
      ]
    }));

    // Allow Cluster Role to pull images from ECR.
    this.repository.grantPull(clusterRole);

    return this;
  }

  /**
   * Create main ECS Service and Task Definition.
   *
   * @returns { this }
   */
  protected service = (): this => {
    // Create Fargate Task definition.
    const task = new FargateTaskDefinition(this, `${this.config.name}-ecs-task-definition-${this.config.environment}-app`, {
      cpu: this.config.container.cpu || 256,
      memoryLimitMiB: this.config.container.memory || 512,
      executionRole: this.ecsClusterRole,
      taskRole: this.ecsClusterRole
    });

    const logGroup = new LogGroup(this, `${this.config.name}-log-group-${this.config.environment}-ecs-cluster-app`, {
      logGroupName: `${this.config.name}/ecs/cluster/app`,
      retention: RetentionDays.THREE_DAYS,
      removalPolicy: RemovalPolicy.DESTROY,
    });

    // Add tags to resource.
    Tags.of(logGroup).add('Name', this.config.name);

    // Create SSM parameter with instance reference.
    this.createSSMParameter(`${this.config.name}-log-group-${this.config.environment}-ecs-cluster-app-arn`, `${this.config.name}/log-groups/${this.config.environment}/ecs/cluster/app/arn`, logGroup.logGroupArn);

    // Create "nginx" container.
    const app = new ContainerDefinition(this, `${this.config.name}-ecs-container-${this.config.environment}-app`, {
      taskDefinition: task,
      containerName: 'app',
      image: ContainerImage.fromEcrRepository(this.repository, 'latest'),
      essential: true,
      logging: new AwsLogDriver({
        streamPrefix: `${this.config.name}/${this.config.environment}/ecs/cluster/app`,
        logGroup
      })
    })
    app.addPortMappings({
      containerPort: 80,
      hostPort: 80,
      protocol: Protocol.TCP
    })
    app.addUlimits({
      name: UlimitName.NOFILE,
      softLimit: 32768,
      hardLimit: 32768
    })

    // Set default container of task.
    task.defaultContainer = app;

    // Create main ECS Fargate service.
    this.ecsService = new FargateService(this, `${this.config.name}-ecs-service-${this.config.environment}-app`, {
      cluster: this.ecsCluster,
      taskDefinition: task,
      securityGroups: [this.securityGroups['base']],
      platformVersion: FargatePlatformVersion.VERSION1_4,
      assignPublicIp: false,
      enableExecuteCommand: true,
      capacityProviderStrategies: [{
        capacityProvider: 'FARGATE_SPOT',
        weight: 1,
      }],
      vpcSubnets: {
        subnets: this.vpc.privateSubnets
      },
    });

    return this;
  }

  /**
   * Create Load Balancer.
   *
   * @returns { this }
   */
  protected loadBalancer = (): this => {
    // Create load balancer security group,
    // with Cloudfront IP list.
    const loadBalancerSecurityGroup = this.securityGroups['loadBalancer'] = new SecurityGroup(this, `${this.config.name}-security-group-${this.config.environment}-load-balancer`, {
      vpc: this.vpc,
      securityGroupName: `${this.config.name}-${this.config.environment}-load-balancer`,
      allowAllOutbound: true,
    });

    const cloudFrontIPList = new AwsCustomResource(this, `${this.config.name}-custom-resource-cloudfront-ips`, {
      resourceType: 'Custom::GetPrefixListIds',
      onUpdate: {
        service: 'EC2',
        action: 'describeManagedPrefixLists',
        region: Stack.of(this).region,
        parameters: {
          Filters: [{
            Name: 'prefix-list-name',
            Values: ['com.amazonaws.global.cloudfront.origin-facing'],
          }]
        },
        physicalResourceId: {}
      },
      policy: AwsCustomResourcePolicy.fromSdkCalls({
        resources: AwsCustomResourcePolicy.ANY_RESOURCE,
      }),
    });

    // Add tags to resource.
    Tags.of(cloudFrontIPList).add('Name', this.config.name);

    // Add ingress rules.
    loadBalancerSecurityGroup.addIngressRule(loadBalancerSecurityGroup, Port.allTraffic(), 'Allow security group to talk to itself');
    loadBalancerSecurityGroup.addIngressRule(Peer.prefixList(cloudFrontIPList.getResponseField('PrefixLists.0.PrefixListId')), Port.tcp(80), 'Allow connections from Cloudfront IP list.');

    // Add tag to security group.
    Tags.of(loadBalancerSecurityGroup).add('Name', this.config.name);

    // Create SSM parameter with instance reference.
    this.createSSMParameter(`${this.config.name}-security-group-${this.config.environment}-load-balancer-id`, `${this.config.name}/security-groups/${this.config.environment}/load-balancer/id`, loadBalancerSecurityGroup.securityGroupId);

    // Create load balancer.
    const loadBalancer = this.applicationLoadBalancer = new ApplicationLoadBalancer(this, `${this.config.name}-application-load-balancer-${this.config.environment}-app`, {
      loadBalancerName: `${this.config.name}-${this.config.environment}`,
      internetFacing: true,
      http2Enabled: true,
      securityGroup: loadBalancerSecurityGroup,
      vpc: this.vpc,
    });

    // Create target group.
    const applicationTargetGroup = new ApplicationTargetGroup(this, `${this.config.name}-target-group-${this.config.environment}-app`, {
      targetGroupName: `${this.config.name}-${this.config.environment}-app`,
      targetType: TargetType.IP,
      port: 443,
      protocol: ApplicationProtocol.HTTPS,
      targets: [this.ecsService],
      healthCheck: {
        path: '/',
        healthyHttpCodes: '200,204',
      },
      vpc: this.vpc,
    });

    loadBalancer.addListener(`${this.config.name}-application-listener-${this.config.environment}-app-redirect-to-https`, {
      protocol: ApplicationProtocol.HTTP,
      port: 80,
      open: true,
      defaultAction: ListenerAction.redirect({
        port: '443',
        protocol: ApplicationProtocol.HTTPS,
        permanent: true,
      }),
    });

    loadBalancer.addListener(`${this.config.name}-application-listener-${this.config.environment}-app-public`, {
      protocol: ApplicationProtocol.HTTPS,
      port: 443,
      open: true,
      defaultTargetGroups: [applicationTargetGroup],
      certificates: [ListenerCertificate.fromArn(this.certificate.certificateArn)],
    });

    // Output load balancer DNS.
    this.createOutputParameter('LoadBalancerURL', loadBalancer.loadBalancerDnsName);

    const ARecordDomain = new ARecord(this, `${this.config.name}-route53-arecord-${this.config.domain}`, {
      recordName: this.config.domain,
      target: RecordTarget.fromAlias(new LoadBalancerTarget(loadBalancer)),
      ttl: Duration.seconds(300),
      comment: `[${this.config.domain}] A record for load balancer [${loadBalancer.loadBalancerDnsName}] for project [${this.config.name}]`,
      zone: this.hostedZone
    });

    // Create CNAMEs foreach domain name
    // and point it to the Cloudfront distribution.
    /*
    const CnameDomainName = new ARecord(this, `${this.config.name}-route53-cname-${this.config.domain}`, {
      ttl: Duration.seconds(300),
      recordName: this.config.domain,
      domainName: loadBalancer.loadBalancerDnsName,
      comment: `${this.config.domain} CNAME record for domain [${loadBalancer.loadBalancerDnsName}] for project [${this.config.name}]`,
      zone: this.hostedZone
    });
    */
    // Add tag to CNAME
    Tags.of(ARecordDomain).add('Name', this.config.name);

    // Output CNAME domain.
    this.createOutputParameter('SiteURL', ARecordDomain.domainName);

    return this;
  }
}
