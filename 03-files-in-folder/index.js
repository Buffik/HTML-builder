const fs = require('fs');
const fsProm = require('fs').promises;
const { readdir } = require('fs').promises;
const path = require('path');

const pathFolder = path.join(__dirname, 'secret-folder');

const readFilesInFolder = async () => {
  const files = await readdir(pathFolder, { withFileTypes: true });
  for (const file of files)
    if (file.isFile()) {
      const fileFolder = path.join(pathFolder, file.name);
      const fileFullName = file.name.split('.');
      const fileName = fileFullName[0];
      const fileExtension = fileFullName[1];
      const fileStats = fsProm.stat(fileFolder);
      const fileSize = (await fileStats).size;

      console.log(`${fileName} - ${fileExtension} - ${fileSize} bytes`);
    }
};

readFilesInFolder();
