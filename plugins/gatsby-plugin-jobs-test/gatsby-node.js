
exports.onPostBootstrap = async ({ actions }) => {
  actions.createJobV2({
    name: 'JOB_TEST',
    inputPaths: [],
    outputDir: './public',
    args: {
      result: 'test',
    }
  })
}