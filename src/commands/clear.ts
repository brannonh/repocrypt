import { GluegunCommand } from 'gluegun';

const description = `Clear encrypted files from <target> directory.
If <sources> have been deleted, this may result in data loss.
Options:   --force (-f)   Skip all prompts.`;

const command: GluegunCommand = {
  name: 'clear',
  alias: ['c'],
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
      (await prompt.confirm(`Clear encrypted files (${config.target})?`));
    if (clear) {
      print.info(`Clearing files (${config.target}).`);
      purge.clearEncrypted(config.target);
    }
  },
};

export default command;
