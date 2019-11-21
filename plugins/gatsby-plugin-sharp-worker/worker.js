
const fs = require('fs');
const path = require('path');
const makeDir = require('make-dir');
const sleep = (timeout) => new Promise(resolve => setTimeout(resolve, timeout))

exports.IMAGE_PROCESSING = async ({ inputPaths, outputDir, args }) => {
  if (args.throwError) {
    throw new Error('Oh no this function failed');
  }

  outputDir = path.join(outputDir, args.digest);
  await makeDir(outputDir);

  const parsedPath = path.parse(inputPaths[0].path);
  const ouputFiles = [
    path.join(outputDir, `${parsedPath.name}-100x100${parsedPath.ext}`),
    path.join(outputDir, `${parsedPath.name}-200x200${parsedPath.ext}`),
  ];

  await sleep(2000)

  ouputFiles.map((file) => {
    fs.copyFileSync(inputPaths[0].path, file);
  });
}