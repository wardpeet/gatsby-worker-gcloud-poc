const path = require('path');
const pDefer = require('p-defer');
const makeDir = require('make-dir');
const uuid = require('uuid/v4');
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

const createJob = async (type, { inputPaths, outputDir, args }) => {
  inputPaths = inputPaths.map(file => {
    return path.relative(process.cwd(), file)
  });

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
    inputPaths = inputPaths.map(inputPath => path.join(process.cwd(), inputPath))
    outputDir = path.resolve(process.cwd(), outputDir)

    await makeDir(outputDir);

    try {
      const result = await require('./worker')[type](inputPaths, outputDir, args);
      return result;
    } catch (err) {
      reporter.panic(err);
    }
  }
}

const promises = [];
exports.onPreInit = (actions, { plugins, ...options }) => {
  reporter = actions.reporter;
  promises.push(createJob('DOWNLOAD_FILE', {
    inputPaths: [],
    outputDir: './public/static/',
    args: options,
  }));
}

exports.onPostBootstrap = async () => {
  await Promise.all(promises)
}