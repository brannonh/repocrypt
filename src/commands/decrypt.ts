import { GluegunCommand } from 'gluegun';

const command: GluegunCommand = {
  name: 'decrypt',
  alias: ['d'],
  description:
    'Decrypt files from the <target> directory into their original locations\nIf <sources> has been modified, original locations may not match current <sources> configuration',
  run: async (toolbox) => {
    const { config, decryption, filesystem, print, prompt, purge } = toolbox;

    if (!config.target) {
      print.error('No target defined in the configuration file!');
      return;
    }

    const clear = await prompt.confirm(
      `Discard source files first (${config.sources.join(', ')})?`,
    );
    if (clear) {
      print.info(`Discarding files (${config.sources.join(', ')}).`);
      purge.discardSources(config.sources);
    }

    print.info(`Decrypting files (${config.target}).`);
    if (filesystem.isDirectory(config.target)) {
      decryption.decryptDirectory(config.target, '.');
    } else {
      print.warning(`Skipping ${config.target} (not a directory).`);
    }
  },
};

module.exports = command;
