const fs = require('fs');
const fsProm = require('fs').promises;
const path = require('path');

const currentPathFolder = path.join(__dirname, 'files');
const copiedPathFolder = path.join(__dirname, 'files-copy');

const copyDir = async (cur, copied) => {
  await fsProm.rm(copied, { recursive: true, force: true });
  await fsProm.mkdir(copied, {
    recursive: true,
  });
  const files = await fsProm.readdir(cur, {
    withFileTypes: true,
  });
  for (let file of files) {
    const curPathFolder = path.join(cur, file.name);
    const copiedPathFolder = path.join(copied, file.name);
    if (file.isDirectory()) {
      await copyDir(curPathFolder, copiedPathFolder);
    } else {
      await fsProm.copyFile(curPathFolder, copiedPathFolder);
    }
  }
};

copyDir(currentPathFolder, copiedPathFolder);
