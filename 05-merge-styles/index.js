const fs = require('fs');
const fsProm = require('fs').promises;
const path = require('path');

const pathFolderStyles = path.join(__dirname, 'styles');
const pathFolderProject = path.join(__dirname, 'project-dist', 'bundle.css');

const mergeStyles = async () => {
  const writeStream = fs.createWriteStream(pathFolderProject, {
    encoding: 'utf8',
  });
  const allFiles = await fsProm.readdir(pathFolderStyles, {
    withFileTypes: true,
  });
  allFiles.forEach(async (file) => {
    if (path.extname(file.name) === '.css') {
      const filePath = path.join(__dirname, 'styles', file.name);

      const readStream = new fs.ReadStream(filePath, 'utf8');
      readStream.on('readable', async () => {
        let chunk = await readStream.read();
        if (chunk) {
          const innerText = chunk.toString();
          writeStream.write(
            `/*  *******************new chunk****************  */ \n\n${innerText}\n\n /*  *******************end****************  */ \n\n`
          );
        }
      });
    }
  });
};

mergeStyles();
