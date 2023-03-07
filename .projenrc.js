const { GemeenteNijmegenTsPackage } = require('@gemeentenijmegen/projen-project-type');

const projectName = '@gemeentenijmegen/utils';

const project = new GemeenteNijmegenTsPackage({
  defaultReleaseBranch: 'main',
  name: projectName,
  depsUpgradeOptions: {
    workflowOptions: {
      branches: ['main'], // No acceptance branch
    },
  },
  devDeps: [
    '@gemeentenijmegen/projen-project-type',
  ], 
  packageName: projectName,
  enableAutoMergeDependencies: false, // No acceptance branch
});
project.synth();