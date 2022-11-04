const fs = require('fs');
const fsProm = require('fs').promises;
const path = require('path');

const pathFolderTemplate = path.join(__dirname, 'template.html');
const pathFolderComponents = path.join(__dirname, 'components');
const pathFolderStyles = path.join(__dirname, 'styles');
const currentPathFolder = path.join(__dirname, 'assets');

const buildPage = async () => {
  createFolder(path.join(__dirname, 'project-dist'));

  await copyDir(currentPathFolder);

  await readFilesInFolder();

  await mergeStyles();
};

const readFilesInFolder = async () => {
  let innerTextTemplate;

  let template = fs.readFile(pathFolderTemplate, 'utf8', async (err, data) => {
    if (!data) {
      throw err;
    } else {
      innerTextTemplate = data;
    }
  });
  const files = await fsProm.readdir(pathFolderComponents, {
    withFileTypes: true,
  });

  for await (const file of files) {
    if (path.extname(file.name) === '.html') {
      fs.readFile(
        path.join(pathFolderComponents, file.name),
        'utf-8',
        async (err, data) => {
          innerTextTemplate = await innerTextTemplate.replace(
            `{{${file.name.split('.')[0]}}}`,
            data
          );
          await fsProm.writeFile(
            path.join(__dirname, 'project-dist', 'index.html'),
            innerTextTemplate,
            (err) => {
              if (err) {
                console.log(err);
              }
            }
          );
        }
      );
    }
  }
};

const mergeStyles = async () => {
  const pathFolderProject = path.join(__dirname, 'project-dist', 'style.css');
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

const hasFolder = async (folder) => {
  let hasFolderPath = false;
  await fs.access(folder, async (error) => {
    if (!error) hasFolderPath = true;
  });
  return hasFolderPath;
};

const createFolder = async (folder) => {
  if (await hasFolder(folder)) {
    await fsProm.rm(folder, {
      recursive: true,
      force: true,
    });
  }
  await fsProm.mkdir(folder, {
    recursive: true,
    force: true,
  });
  return true;
};

const copyDir = async (cur, copied) => {
  if (!copied) {
    copied = path.join(__dirname, 'project-dist', 'assets');
    createFolder(copied);
  } else {
    createFolder(copied);
  }

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

buildPage();
