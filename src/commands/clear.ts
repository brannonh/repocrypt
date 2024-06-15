import { GluegunCommand } from 'gluegun';

const command: GluegunCommand = {
  name: 'clear',
  alias: ['c'],
  description:
    'Clear encrypted files from <target> directory\nIf <sources> have been deleted, this may result in data loss',
  run: async ({ config, print, prompt, purge }) => {
    if (!config.target) {
      print.error('No target defined in the configuration file!');
      return;
    }

    const clear = await prompt.confirm('Clear encrypted files?');
    if (clear) {
      print.info(`Clearing files (${config.target}).`);
      purge.clearEncrypted(config.target);
    }
  },
};

export default command;
