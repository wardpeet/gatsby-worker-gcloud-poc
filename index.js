const path = require('path');
const os = require('os');
const tmpDir = os.tmpdir();
const wrapWorker = require('./wrap-worker');

exports.STRUCTURED_LOG = async (req, res) => {
  const { id, inputPaths, outputDir, args } = req.body;
  const worker = require('@wardpeet/gatsby-plugin-structured-logging-worker/worker');

  const result = await wrapWorker(worker.STRUCTURED_LOG)(inputPaths, outputDir, args);

  res.json({ id, ...result });
}

exports.ERROR_LOG = async (req, res) => {
  const { id, inputPaths, outputDir, args } = req.body;
  const worker = require('@wardpeet/gatsby-plugin-structured-logging-worker/worker');

  const result = await wrapWorker(worker.ERROR_LOG)(inputPaths, outputDir, args);

  res.json({ id, ...result });
}

exports.IMAGE_PROCESSING = async (req, res) => {
  const { id, inputPaths, outputDir, args } = req.body;
  const worker = require('@wardpeet/gatsby-plugin-sharp-worker/worker');

  const result = await wrapWorker(worker.IMAGE_PROCESSING)(inputPaths, outputDir, args);

  res.json({ id, ...result });
}


exports.DOWNLOAD_FILE = async (req, res) => {
  const { id, inputPaths, outputDir, args } = req.body;
  const worker = require('@wardpeet/gatsby-plugin-remote-file/worker');

  const result = await wrapWorker(worker.DOWNLOAD_FILE)(inputPaths, outputDir, args);

  res.json({ id, ...result });
}

exports.GENERATE_SVG = async (req, res) => {
  const { id, inputPaths, outputDir, args } = req.body;
  const worker = require('@wardpeet/gatsby-plugin-sqip-worker/worker');

  const result = await wrapWorker(worker.GENERATE_SVG)(inputPaths, outputDir, args);

  res.json({ id, ...result });
}

