import { filesystem, GluegunToolbox, print } from 'gluegun';

export default (toolbox: GluegunToolbox): void => {
  toolbox.purge = {
    clearEncrypted,
    discardSources,
  };
};

function clearEncrypted(target: string) {
  if (!filesystem.isDirectory(target)) {
    print.warning(`Target (${target}) is not a directory!`);
    return;
  }

  filesystem.remove(target);
}

function discardSources(sources: string[]) {
  for (const source of sources) {
    if (filesystem.exists(source)) {
      filesystem.remove(source);
    } else {
      print.warning(`Source (${source}) does not exist!`);
    }
  }
}
