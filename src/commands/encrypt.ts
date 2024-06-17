import { GluegunCommand } from 'gluegun';

const command: GluegunCommand = {
  name: 'encrypt',
  alias: ['e'],
  description:
    'Encrypt files from <sources> locations into the <target> directory',
  run: async ({ config, encryption, filesystem, print, prompt, purge }) => {
    if (!config.sources || !config.sources.length) {
      print.error('No sources defined in the configuration file!');
      return;
    }

    if (!config.target) {
      print.error('No target defined in the configuration file!');
      return;
    }

    const clear = await prompt.confirm('Clear encrypted files first?');
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
