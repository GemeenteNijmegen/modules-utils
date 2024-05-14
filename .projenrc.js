const { GemeenteNijmegenTsPackage } = require('@gemeentenijmegen/projen-project-type');

const projectName = '@gemeentenijmegen/utils';

const project = new GemeenteNijmegenTsPackage({
  defaultReleaseBranch: 'main',
  name: projectName,
  repository: 'https://github.com/gemeentenijmegen/modules-utils',
  depsUpgradeOptions: {
    workflowOptions: {
      branches: ['main'], // No acceptance branch
    },
  },
  deps: [
    '@aws-sdk/client-secrets-manager',
    '@aws-sdk/client-ssm',
  ],
  devDeps: [
    '@gemeentenijmegen/projen-project-type',
    'aws-sdk-client-mock',
  ],
  packageName: projectName,
  enableAutoMergeDependencies: false, // No acceptance branch
});
project.synth();
