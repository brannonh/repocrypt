import { GluegunCommand } from 'gluegun';

const description = `Decrypt files from the <target> directory into their original locations.
If <sources> has been modified, original locations may not match current <sources> configuration.
Options:   --force (-f)   Skip all prompts.`;

const command: GluegunCommand = {
  name: 'decrypt',
  alias: ['d'],
  description,
  run: async ({
    config,
    decryption,
    filesystem,
    parameters,
    print,
    prompt,
    purge,
  }) => {
    const { options } = parameters;
    const force = options.force || options.f;

    if (!config.target) {
      print.error('No target defined in the configuration file!');
      return;
    }

    const clear =
      force ||
      (await prompt.confirm(
        `Discard source files first (${config.sources.join(', ')})?`,
      ));
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
