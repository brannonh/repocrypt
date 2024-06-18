import { createCipheriv } from 'crypto';
import { filesystem, GluegunToolbox, print } from 'gluegun';

const encryptionAlgorithm = 'aes256';
let secretKey = 'my-secret-key';
let secretIv = 'my-secret-iv';

export default (toolbox: GluegunToolbox): void => {
  const { config } = toolbox;
  secretKey = config.secretKey;
  secretIv = config.secretIv;

  toolbox.encryption = {
    clear,
    encrypt,
    encryptFile,
    encryptDirectory,
  };
};

function clear(target: string) {
  if (!filesystem.isDirectory(target)) {
    print.error('Target is not a directory!');
    return;
  }

  filesystem.remove(target);
}

function encrypt(data: string, debug = false): string {
  const key = Buffer.from(secretKey, 'hex');
  const iv = Buffer.from(secretIv, 'hex');
  const cipher = createCipheriv(encryptionAlgorithm, key, iv);

  const encrypted = cipher.update(data, 'utf8', 'hex') + cipher.final('hex');

  if (debug) {
    console.dir({
      encrypted,
      iv: iv.toString('hex'),
      key: key.toString('hex'),
    });
  }

  return encrypted;
}

function encryptFile(inputPath: string, outputPath: string, debug = false) {
  if (filesystem.isFile(inputPath)) {
    const data = filesystem.read(inputPath);
    const encrypted = encrypt(data, debug);
    filesystem.write(outputPath, encrypted);
  } else {
    throw new Error(`File not found: ${inputPath}`);
  }
}

function encryptDirectory(
  inputPath: string,
  outputPath: string,
  debug = false,
) {
  if (filesystem.isDirectory(inputPath)) {
    const files = filesystem.list(inputPath);

    filesystem.dir(outputPath);

    for (const file of files) {
      if (filesystem.isDirectory(`${inputPath}/${file}`)) {
        encryptDirectory(
          `${inputPath}/${file}`,
          `${outputPath}/${encrypt(file)}`,
          debug,
        );
      } else {
        const fileName = encrypt(file);
        encryptFile(`${inputPath}/${file}`, `${outputPath}/${fileName}`, debug);
      }
    }
  } else {
    throw new Error(`Directory not found: ${inputPath}`);
  }
}
