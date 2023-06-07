import type { Environment } from 'aws-cdk-lib';

export { Initialize as InitializeStack } from './stacks/Initialize';
export { Application as ApplicationStack } from './stacks/Application';

export type Config = {
  name: string,
  aws: Environment,
  domain: string,
}

export type EnvironmentConfig = Config & {
  environment: string,
  repository: {
    owner: string
    name: string
    branch: string
  },
  container: {
    cpu?: number
    memory?: number
  }
}
