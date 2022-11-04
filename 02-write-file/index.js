const fs = require('fs');
const path = require('path');
const readline = require('readline');
const process = require('process');
const { stdout } = process;

const pathFolder = path.join(__dirname, 'text.txt');

const writeFile = async () => {
  console.log('Hey, student! Print some letters :)');

  const stream = fs.createWriteStream(pathFolder, { encoding: 'utf8' });

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const printMessages = () => {
    rl.question('', (data) => {
      if (data !== 'exit') {
        stream.write(`${data}\n`);
        printMessages();
      } else {
        rl.close();
      }
    });
  };

  rl.on('close', () => {
    stdout.write('Unbelievable, yeah? Good bye!');
  });

  printMessages();
};

writeFile();
