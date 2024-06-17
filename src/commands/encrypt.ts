import { GluegunCommand } from 'gluegun';

const description = `Encrypt files from <sources> locations into the <target> directory.
Options:   --force (-f)   Skip all prompts.`;

const command: GluegunCommand = {
  name: 'encrypt',
  alias: ['e'],
  description,
  run: async ({
    config,
    encryption,
    filesystem,
    parameters,
    print,
    prompt,
    purge,
  }) => {
    const { options } = parameters;
    const force = options.force || options.f;

    if (!config.sources || !config.sources.length) {
      print.error('No sources defined in the configuration file!');
      return;
    }

    if (!config.target) {
      print.error('No target defined in the configuration file!');
      return;
    }

    const clear =
      force ||
      (await prompt.confirm(`Clear encrypted files first (${config.target})?`));
    if (clear) {
      print.info(`Clearing files (${config.target}).`);
      purge.clearEncrypted(config.target);
    }

    print.info(`Encrypting files (${config.sources.join(', ')}).`);
    for (const source of config.sources) {
      if (filesystem.isFile(source)) {
        encryption.encryptFile(
          source,
          `${config.target}/${encryption.encrypt(source)}`,
        );
      } else if (filesystem.isDirectory(source)) {
        encryption.encryptDirectory(
          source,
          `${config.target}/${encryption.encrypt(source)}`,
        );
      } else {
        print.warning(`Skipping ${source} (not a file or directory).`);
      }
    }
  },
};

export default command;
