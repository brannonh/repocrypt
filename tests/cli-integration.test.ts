import { system, filesystem } from 'gluegun';

const src = filesystem.path(__dirname, '..');

const cli = async (cmd) =>
  system.run('node ' + filesystem.path(src, 'bin', 'repocrypt') + ` ${cmd}`);

test('is defined', async () => {
  const output = await cli('--version');
  expect(output).toBeDefined();
});
