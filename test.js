const express = require('express')
const app = express()

app.use(express.json())

app.post('/structured-log', function (req, res) {
  require('./index').STRUCTURED_LOG(req, res);
})
app.post('/error-log', function (req, res) {
  require('./index').ERROR_LOG(req, res);
})
app.post('/image-processing', function (req, res) {
  require('./index').IMAGE_PROCESSING(req, res);
})
app.post('/download-file', function (req, res) {
  require('./index').DOWNLOAD_FILE(req, res);
})
app.post('/generate-svg', function (req, res) {
  require('./index').GENERATE_SVG(req, res);
})

app.listen(3000)