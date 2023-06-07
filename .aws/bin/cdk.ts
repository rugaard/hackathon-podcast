#!/usr/bin/env node
import 'source-map-support/register';
import { join } from 'path';
import { readdirSync, readFileSync } from 'fs';
import { App as CDKApp, Environment } from 'aws-cdk-lib';
import { type EnvironmentConfig, InitializeStack, ApplicationStack } from '../';

// Project name.
const projectName = 'hackathon-podcast';

// Domain name.
const domain = "podcast.hackathon.allermedia.io"

// Environment configs.
const configDir = join(__dirname, '../config');

// Instantiate CDK app.
const app = new CDKApp;

// AWS Account and Region
const awsEnvironment: Environment = {
  account: '919232675069',
  region: 'eu-west-1'
};

/**
 * Collect project configurations.
 */
let environments: EnvironmentConfig[] = [];
readdirSync(configDir).forEach(filename => {
  // Parse config file.
  const config = Object.assign({ aws: awsEnvironment }, JSON.parse(readFileSync(join(configDir, filename), 'utf-8')) as EnvironmentConfig);
  environments.push(config);

  // Application for environment.
  new ApplicationStack(app, `${config.name}-${config.environment}-application`, config, {
    stackName: `${config.name}-${config.environment}-application`
  });
});

/**
 * Synth Initialize stack.
 */
new InitializeStack(app, `${projectName}-initialize`, {
  name: projectName,
  aws: awsEnvironment,
  domain,
}, environments, {
  stackName: `${projectName}-initialize`
});

app.synth();
