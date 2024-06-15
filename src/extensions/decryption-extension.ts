import { createDecipheriv } from 'crypto';
import {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  statSync,
  writeFileSync,
} from 'fs';
import { GluegunToolbox } from 'gluegun';

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
  debug = false
): void {
  if (existsSync(inputPath) && statSync(inputPath).isFile()) {
    const data = readFileSync(inputPath, 'utf-8');
    const encrypted = decrypt(data, debug);

    writeFileSync(outputPath, encrypted, 'utf-8');
  } else {
    throw new Error(`File not found: ${inputPath}`);
  }
}

export function decryptDirectory(
  inputPath: string,
  outputPath: string,
  debug = false
): void {
  if (existsSync(inputPath) && statSync(inputPath).isDirectory()) {
    const files = readdirSync(inputPath);

    if (!existsSync(outputPath)) {
      mkdirSync(outputPath, { recursive: true });
    }

    for (const file of files) {
      if (statSync(`${inputPath}/${file}`).isDirectory()) {
        decryptDirectory(
          `${inputPath}/${file}`,
          `${outputPath}/${decrypt(file)}`,
          debug
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
