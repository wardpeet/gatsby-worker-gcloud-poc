
const path = require('path');

exports.GENERATE_SVG = ({ inputPaths, args }) => {
  if (args.throwError) {
    throw new Error('Oh no this function failed');
  }

  return {
    result: path.basename(inputPaths[0].path),
  }
}