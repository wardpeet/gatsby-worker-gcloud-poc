const path = require('path');
const pDefer = require('p-defer');
const makeDir = require('make-dir');
const uuid = require('uuid/v4');
const fs = require('fs');
const crypto = require('crypto');
const package = require('./package.json');

let reporter;

const cachedJobs = new Map();
process.on('message', (msg) => {
  if (msg && msg.type && msg.payload) {
    if (cachedJobs.get(msg.payload.id)) {
      const deferred = cachedJobs.get(msg.payload.id);

      if (msg.type === 'JOB_COMPLETED') {
        deferred.resolve(msg.payload.result);
      }

      if (msg.type === 'JOB_FAILED') {
        deferred.reject(msg.payload.error);
      }
    }
  }
})

const hashFile = (filePath) => new Promise((resolve, reject) => {
  const hasher = crypto.createHash('sha1');
  fs.createReadStream(filePath)
    // TODO: Use `Stream.pipeline` when targeting Node.js 12.
    .on('error', reject)
    .pipe(hasher)
    .on('error', reject)
    .on('finish', () => {
      const { buffer } = hasher.read();
      resolve(Buffer.from(buffer).toString('hex'));
    });
});

const createJob = async (type, { inputPaths, outputDir, args }) => {
  inputPaths = await Promise.all(inputPaths.map(async file => {
    return {
      path: path.relative(process.cwd(), file),
      contentDigest: await hashFile(path.resolve(file))
    }
  }));

  outputDir = path.relative(process.cwd(), outputDir);

  if (process.send) {
    const id = uuid();
    const deferred = pDefer();
    cachedJobs.set(id, deferred)
    process.send({
      type: "JOB_CREATED",
      payload: {
        id,
        name: type,
        contentDigest: '1234',
        inputPaths,
        outputDir,
        args,
        plugin: {
          name: package.name,
          version: package.version,
        }
      }
    })

    try {
      const result = await deferred.promise;

      return result;
    } catch (err) {
      reporter.panic(err);
    }
  } else {
    inputPaths = inputPaths.map(inputPath => ({
      ...inputPath,
      path: path.join(process.cwd(), inputPath.path),
    }))
    outputDir = path.resolve(process.cwd(), outputDir)

    await makeDir(outputDir);

    try {
      const result = await require('./worker')[type]({ inputPaths, outputDir, args });
      return result;
    } catch (err) {
      reporter.panic(err);
    }
  }
}

const promises = [];
exports.onPreInit = async (actions, { inputPaths, ...args }) => {
  reporter = actions.reporter;
  const result = await createJob('GENERATE_SVG', {
    inputPaths,
    outputDir: './public',
    args,
  });

  console.log(result);
}

exports.onPostBootstrap = async () => {
  await Promise.all(promises)
}