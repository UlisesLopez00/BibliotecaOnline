require('./config/config')
const express = require('express');
const app = express()
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
app.use(bodyParser.urlencoded({ limit: '100mb', extended: false, parameterLimit: 50000 }));
app.use(bodyParser.json({ limit: '100mb' }));

app.use(cors())

app.use(require('./routes/index'))

mongoose.connect(process.env.URLDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
},
    (err, resp) => {
        if(err) throw err;
        console.log("Base de datos conectada exitosamente")
}); 
//ftp
app.listen(process.env.PORT, () => {
    console.log("Escuchando por el puerto", process.env.PORT);
}) 
