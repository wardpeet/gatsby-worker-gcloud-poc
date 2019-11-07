
const path = require('path');

exports.GENERATE_SVG = ([inputPath], outputDir, args) => {
  if (args.throwError) {
    throw new Error('Oh no this function failed');
  }

  return path.basename(inputPath);
}