const express = require('express');
const app = express()

app.use(require('./usuario'));
app.use(require('./libro'));
app.use(require('./renta'));
app.use(require('./login'));
app.use(require('./client'));




module.exports = app;