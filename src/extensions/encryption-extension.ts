import { createCipheriv } from 'crypto';
import {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  statSync,
  writeFileSync,
} from 'fs';
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
  if (existsSync(inputPath) && statSync(inputPath).isFile()) {
    const data = readFileSync(inputPath, 'utf-8');
    const encrypted = encrypt(data, debug);

    writeFileSync(outputPath, encrypted, 'utf-8');
  } else {
    throw new Error(`File not found: ${inputPath}`);
  }
}

function encryptDirectory(
  inputPath: string,
  outputPath: string,
  debug = false
) {
  if (existsSync(inputPath) && statSync(inputPath).isDirectory()) {
    const files = readdirSync(inputPath);

    if (!existsSync(outputPath)) {
      mkdirSync(outputPath, { recursive: true });
    }

    for (const file of files) {
      if (statSync(`${inputPath}/${file}`).isDirectory()) {
        encryptDirectory(
          `${inputPath}/${file}`,
          `${outputPath}/${encrypt(file)}`,
          debug
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
