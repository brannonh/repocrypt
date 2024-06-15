import { GluegunToolbox } from 'gluegun';

export default (toolbox: GluegunToolbox): void => {
  toolbox.prompts = {
    inputForSource,
    inputForTarget,
    confirmForNewSource,
  };
};

const inputForSource = {
  type: 'input',
  name: 'source',
  message: 'Enter a source path:',
};

const inputForTarget = {
  type: 'input',
  name: 'target',
  message: 'Enter a target path:',
};

const confirmForNewSource = {
  type: 'confirm',
  name: 'newSource',
  message: 'Do you want to add an additional source?',
};
