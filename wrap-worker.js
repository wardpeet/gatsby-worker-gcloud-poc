const path = require('path');
const os = require('os');
const { createContentDigest } = require('gatsby-core-utils');
const { Storage } = require('@google-cloud/storage');
const mkdir = require('make-dir');
const globby = require('globby');
const slash = require('slash')

const tmpDir = os.tmpdir();
const storage = new Storage({
  projectId: '110620695476',
});

const bucket = storage.bucket('gatsby-worker-test-site');

const preWorker = async ({ inputPaths, outputDir, args }) => {
  await mkdir(path.join(tmpDir, 'input'));
  await mkdir(path.join(tmpDir, 'output', outputDir));

  inputPaths = await Promise.all(inputPaths.map(async inputPath => {
    const ext = path.extname(inputPath);
    const hashedPath = `${createContentDigest(inputPath)}${ext}`;
    const downloadPath = path.join(tmpDir, 'input', hashedPath);

    await bucket.file(hashedPath)
      .download({
        destination: downloadPath,
      });

    return downloadPath;
  }));

  outputDir = path.join(tmpDir, 'output', outputDir);

  return {
    inputPaths,
    outputDir,
    args,
  }
}

module.exports = (workerFn) => {
  return async (inputPaths, outputDir, args) => {
    const newArgs = await preWorker({ inputPaths, outputDir, args });

    try {
      const result = await workerFn(newArgs)

      const paths = await globby('**/*', {
        cwd: newArgs.outputDir,
      });

      const gcloudFilePaths = await Promise.all(paths.map(async file => {
        const outputFile = slash(path.join(outputDir, file));
        await bucket.upload(path.join(newArgs.outputDir, file), {
          destination: outputFile,
        });

        return `https://storage.googleapis.com/gatsby-worker-test-site/${outputFile}`;
      }))

      return {
        status: 'success',
        result,
        files: gcloudFilePaths,
      }
    } catch (err) {
      return {
        status: 'failed',
        error: err instanceof Error ? err.message : err,
      };
    }
  }
}
