const { GemeenteNijmegenTsPackage } = require('@gemeentenijmegen/projen-project-type');

const projectName = '@gemeentenijmegen/utils';

const project = new GemeenteNijmegenTsPackage({
  defaultReleaseBranch: 'main',
  name: projectName,
  repository: 'https://github.com/GemeenteNijmegen/modules-utils.git',
  depsUpgradeOptions: {
    workflowOptions: {
      branches: ['main'], // No acceptance branch
    },
  },
  deps: [
    '@aws-sdk/client-secrets-manager',
    '@aws-sdk/client-ssm',
    '@aws-sdk/client-s3',
    '@aws-sdk/s3-request-presigner',
  ],
  devDeps: [
    '@gemeentenijmegen/projen-project-type',
    '@testcontainers/localstack',
    'aws-sdk-client-mock',
  ],
  packageName: projectName,
  enableAutoMergeDependencies: false, // No acceptance branch
});
project.synth();
