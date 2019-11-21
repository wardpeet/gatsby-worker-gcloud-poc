
exports.STRUCTURED_LOG = ({ inputPaths, outputDir, args }) => {
  throw {
    id: `85907`,
    context: {
      message: 'error from a worker',
    },
  }
}

exports.ERROR_LOG = ({ inputPaths, outputDir, args }) => {
  throw new Error('error from a worker');
}