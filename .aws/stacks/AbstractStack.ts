import type { IConstruct } from 'constructs';
import {
  CfnOutput as OutputParameter,
  type CfnOutputProps as OutputParameterProps,
  Stack,
  type StackProps
} from 'aws-cdk-lib';
import {
  StringParameter as SSMStringParameter,
  StringListParameter as SSMStringListParameter,
  ParameterTier as SSMParameterTier,
  StringListParameterProps, StringParameterProps
} from 'aws-cdk-lib/aws-ssm';
import { Config } from '..';

export abstract class AbstractStack extends Stack {
  /**
   * Config.
   *
   * @protected
   * @readonly
   * @var { Config }
   */
  protected readonly config: Config;

  /**
   * Output parameters.
   *
   * @protected
   * @returns { [name: string]: OutputParameter }
   */
  protected outputParameters: { [name: string]: OutputParameter } = {};

  /**
   * SSM parameters.
   *
   * @protected
   * @returns { [name: string]: SSMStringParameter|SSMStringListParameter }
   */
  protected ssmParameters: { [name: string]: SSMStringParameter|SSMStringListParameter } = {};

  /**
   * Create Initialize class.
   *
   * @param scope { IConstruct }
   * @param id { string }
   * @param config { NuxtConfig }
   * @param props { Partial<StackProps> }
   */
  constructor(scope: IConstruct, id: string, config: Config, props?: Partial<StackProps>) {
    super(scope, `${id}`, Object.assign({
      stackName: `${id}`,
      description: `Stack [${id}] for project [${config.name}]`,
      tags: {
        Name: config.name
      }
    }, props || {}, {
      env: config.aws
    }));

    this.config = config;
  }

  /**
   * Create SSM parameter.
   *
   * @param id { string }
   * @param key { string }
   * @param value { strin|string[] }
   * @param options { Partial<StringParameterProps|StringListParameterProps> }
   * @returns { this }
   */
  protected createSSMParameter = (id: string, key: string, value: string|string[], options?: Partial<StringParameterProps|StringListParameterProps>): this => {
    // Create SSM parameter.
    this.ssmParameters[id] = Array.isArray(value) ? new SSMStringListParameter(this, id, Object.assign(options || {}, {
      allowedPattern: '.*',
      parameterName: `/${key}`,
      stringListValue: value,
      tier: SSMParameterTier.STANDARD,
    })) : new SSMStringParameter(this, id, Object.assign(options || {}, {
      allowedPattern: '.*',
      parameterName: `/${key}`,
      stringValue: value,
      tier: SSMParameterTier.STANDARD,
    }));

    return this;
  }

  /**
   * Create output parameter.
   *
   * @param id { string }
   * @param value { string }
   * @param options { Partial<OutputParameterProps> }
   */
  protected createOutputParameter = (id: string, value: string, options?: Partial<OutputParameterProps>): this => {
    // Create output parameter.
    this.outputParameters[id] = new OutputParameter(this, id, Object.assign(options || {}, {
      value: value
    }));
    return this;
  }

  /**
   * Get SSM parameters.
   *
   * @returns { [name: string]: SSMStringParameter|SSMStringListParameter }
   */
  get ssm(): { [name: string]: SSMStringParameter|SSMStringListParameter } {
    return this.ssmParameters;
  }

  /**
   * Get output parameters.
   *
   * @returns { [name: string]: OutputParameter }
   */
  get outputs(): { [name: string]: OutputParameter } {
    return this.outputParameters;
  }
}
