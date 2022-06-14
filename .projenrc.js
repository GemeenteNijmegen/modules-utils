const { typescript } = require('projen');
const { NpmAccess } = require('projen/lib/javascript');

const projectName = '@gemeentenijmegen/utils';

const project = new typescript.TypeScriptProject({
  defaultReleaseBranch: 'main',
  name: projectName,
  defaultReleaseBranch: 'main',
  license: 'EUPL-1.2',
  release: true,
  releaseToNpm: true,
  npmAccess: NpmAccess.PUBLIC,
  deps: [
  ], /* Runtime dependencies of this module. */
  // description: undefined,  /* The description is just a string that helps people understand the purpose of the package. */
  devDeps: [
  ], /* Build dependencies for this module. */
  packageName: projectName, /* The "name" in package.json. */
});
project.synth();