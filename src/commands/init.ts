import { GluegunCommand } from 'gluegun';

type PropKeys = 'secretKey' | 'secretIv' | 'source' | 'target';
type Props = Record<PropKeys, string>;

const command: GluegunCommand = {
  name: 'init',
  alias: ['i'],
  description:
    'Initialize the configuration file.\nThis will overwrite the existing configuration file.',
  run: async ({ crypto, prompt, template }) => {
    const overwrite = await prompt.confirm(
      `This will overwrite any existing configuration file. Proceed?`,
    );

    if (overwrite) {
      const props: Props = await prompt.ask([
        {
          type: 'input',
          name: 'secretKey',
          message: 'Enter a 64-character secret key.',
          initial: crypto.randomString(64),
        },
        {
          type: 'input',
          name: 'secretIv',
          message: 'Enter a 32-character secret key.',
          initial: crypto.randomString(32),
        },
        {
          type: 'input',
          name: 'source',
          message: 'Enter the source directory.',
          initial: 'sources/',
        },
        {
          type: 'input',
          name: 'target',
          message: 'Enter the target directory.',
          initial: 'encrypted/',
        },
      ]);

      template.generate({
        template: 'repocrypt.config.ejs',
        target: 'repocrypt.config.cjs',
        props,
      });
    }
  },
};

export default command;
