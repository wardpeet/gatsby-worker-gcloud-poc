
const fs = require('fs');
const path = require('path');
const got = require('got');


exports.DOWNLOAD_FILE = (inputPaths, outputDir, args) => {
  if (args.throwError) {
    throw new Error('Oh no this function failed');
  }

  return new Promise(resolve => {
    got.stream(args.url)
      .on('response', (res) => {
        resolve();
      }).pipe(fs.createWriteStream(path.join(outputDir, args.ouputFilename)))
  })
}