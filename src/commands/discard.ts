import { GluegunCommand } from 'gluegun';

const command: GluegunCommand = {
  name: 'discard',
  alias: ['x'],
  description:
    'Discard files from <sources> locations\nIf changes to source files have not been re-encrypted, this may result in data loss',
  run: async ({ config, print, prompt, purge }) => {
    if (!config.target) {
      print.error('No target defined in the configuration file!');
      return;
    }

    const clear = await prompt.confirm('Discard source files?');
    if (clear) {
      const confirm = await prompt.confirm(
        'Are you sure? If you have changes that need to be saved, you should encrypt the files first!'
      );
      if (confirm) {
        print.info(`Discarding files (${config.sources.join(', ')}).`);
        purge.discardSources(config.sources);
      }
    }
  },
};

export default command;
