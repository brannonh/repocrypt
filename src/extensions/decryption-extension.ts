import { createDecipheriv } from 'crypto';
import { filesystem, GluegunToolbox } from 'gluegun';

const encryptionAlgorithm = 'aes256';
let secretKey = 'my-secret-key';
let secretIv = 'my-secret-iv';

export default (toolbox: GluegunToolbox): void => {
  const { config } = toolbox;
  secretKey = config.secretKey;
  secretIv = config.secretIv;

  toolbox.decryption = {
    decrypt,
    decryptFile,
    decryptDirectory,
  };
};

export function decrypt(data: string, debug = false): string {
  const key = Buffer.from(secretKey, 'hex');
  const iv = Buffer.from(secretIv, 'hex');
  const decipher = createDecipheriv(encryptionAlgorithm, key, iv);

  const decrypted =
    decipher.update(data, 'hex', 'utf8') + decipher.final('utf8');

  if (debug) {
    console.dir({
      decrypted,
      iv: iv.toString('hex'),
      key: key.toString('hex'),
    });
  }

  return decrypted;
}

export function decryptFile(
  inputPath: string,
  outputPath: string,
  debug = false,
): void {
  if (filesystem.isFile(inputPath)) {
    const data = filesystem.read(inputPath);
    const decrypted = decrypt(data, debug);
    filesystem.write(outputPath, decrypted);
  } else {
    throw new Error(`File not found: ${inputPath}`);
  }
}

export function decryptDirectory(
  inputPath: string,
  outputPath: string,
  debug = false,
): void {
  if (filesystem.isDirectory(inputPath)) {
    const files = filesystem.list(inputPath);

    filesystem.dir(outputPath);

    for (const file of files) {
      if (filesystem.isDirectory(`${inputPath}/${file}`)) {
        decryptDirectory(
          `${inputPath}/${file}`,
          `${outputPath}/${decrypt(file)}`,
          debug,
        );
      } else {
        const fileName = decrypt(file);
        decryptFile(`${inputPath}/${file}`, `${outputPath}/${fileName}`, debug);
      }
    }
  } else {
    throw new Error(`Directory not found: ${inputPath}`);
  }
}
