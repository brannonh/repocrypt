import { GluegunCommand } from 'gluegun';

type PropKeys = 'secretKey' | 'secretIv' | 'source' | 'target';
type Props = Record<PropKeys, string>;

const description = `Initialize the configuration file.
This will overwrite the existing configuration file.
Options:   --force (-f)   Skip all prompts.`;

const command: GluegunCommand = {
  name: 'init',
  alias: ['i'],
  description,
  run: async ({ crypto, parameters, prompt, template }) => {
    const { options } = parameters;
    const force = options.force || options.f;

    const overwrite =
      force ||
      (await prompt.confirm(
        `This will overwrite any existing configuration file. Proceed?`,
      ));

    if (overwrite) {
      const props: Props = force
        ? {
            secretKey: crypto.randomString(64),
            secretIv: crypto.randomString(32),
            source: 'sources',
            target: 'encrypted',
          }
        : await prompt.ask([
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
              initial: 'sources',
            },
            {
              type: 'input',
              name: 'target',
              message: 'Enter the target directory.',
              initial: 'encrypted',
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
