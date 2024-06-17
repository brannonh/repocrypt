import { randomBytes } from 'crypto';
import { GluegunToolbox } from 'gluegun';

export default (toolbox: GluegunToolbox): void => {
  toolbox.crypto = {
    randomString,
  };
};

export function randomString(bytes: number) {
  return randomBytes(bytes).toString('hex');
}
