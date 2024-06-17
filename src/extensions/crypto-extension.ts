import { randomBytes } from 'crypto';
import { GluegunToolbox } from 'gluegun';

export default (toolbox: GluegunToolbox): void => {
  toolbox.crypto = {
    randomString,
  };
};

export function randomString(length: number) {
  return generateForCustomCharacters(length, asciiPrintableCharacters);
}

const readUInt16LE = (uInt8Array: Uint8Array, offset: number) =>
  uInt8Array[offset] + (uInt8Array[offset + 1] << 8);

const asciiPrintableCharacters =
  '!"#$%&()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[]^_`abcdefghijklmnopqrstuvwxyz{|}~'.split(
    '',
  );

const generateForCustomCharacters = (size: number, characters: string[]) => {
  const generateBytes = (length: number) => new Uint8Array(randomBytes(length));

  // Generating entropy is faster than complex math operations, so we use the simplest way
  const characterCount = characters.length;
  const maxValidSelector =
    Math.floor(0x1_00_00 / characterCount) * characterCount - 1; // Using values above this will ruin distribution when using modular division
  const entropyLength = 2 * Math.ceil(1.1 * size); // Generating a bit more than required so chances we need more than one pass will be really low
  let string = '';
  let stringLength = 0;

  while (stringLength < size) {
    // In case we had many bad values, which may happen for character sets of size above 0x8000 but close to it
    const entropy = generateBytes(entropyLength);
    let entropyPosition = 0;

    while (entropyPosition < entropyLength && stringLength < size) {
      const entropyValue = readUInt16LE(entropy, entropyPosition);
      entropyPosition += 2;
      if (entropyValue > maxValidSelector) {
        // Skip values which will ruin distribution when using modular division
        continue;
      }

      string += characters[entropyValue % characterCount];
      stringLength++;
    }
  }

  return string;
};
