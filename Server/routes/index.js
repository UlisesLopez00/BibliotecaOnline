const express = require('express');
const app = express()

app.use(require('./usuario'));
app.use(require('./libro'));
app.use(require('./renta'));
app.use(require('./login'));
app.use(require('./client'));
<<<<<<< HEAD

=======
>>>>>>> cab2374dbcacea6172204f5f0d6882dbcb164240



module.exports = app;