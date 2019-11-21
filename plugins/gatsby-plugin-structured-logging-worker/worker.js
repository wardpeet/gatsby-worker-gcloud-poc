
exports.STRUCTURED_LOG = () => {
  throw {
    id: `85907`,
    context: {
      message: 'error from a worker',
    },
  }
}

exports.ERROR_LOG = () => {
  throw new Error('error from a worker');
}