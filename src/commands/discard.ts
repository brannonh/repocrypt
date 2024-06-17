import { GluegunCommand } from 'gluegun';

const description = `Discard files from <sources> locations.
If changes to source files have not been re-encrypted, this may result in data loss.
Options:   --force (-f)   Skip all prompts.`;

const command: GluegunCommand = {
  name: 'discard',
  alias: ['x'],
  description,
  run: async ({ config, parameters, print, prompt, purge }) => {
    const { options } = parameters;
    const force = options.force || options.f;

    if (!config.target) {
      print.error('No target defined in the configuration file!');
      return;
    }

    const clear =
      force ||
      (await prompt.confirm(
        `Discard source files (${config.sources.join(', ')})?`,
      ));
    if (clear) {
      const confirm =
        force ||
        (await prompt.confirm(
          'Are you sure? If you have changes that need to be saved, you should encrypt the files first!',
        ));
      if (confirm) {
        print.info(`Discarding files (${config.sources.join(', ')}).`);
        purge.discardSources(config.sources);
      }
    }
  },
};

export default command;
