const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');
const app = express();


app.post('/login', (req, res) => {

    let body = req.body;
    Usuario.findOne({ correo: body.correo }, (err, UsrDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        if (!UsrDB) {
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'El usuario* y/o contraseña son incorrectos'
                }
            });
        }
        if (!bcrypt.compareSync(body.password, UsrDB.password)) {
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'El usuario y/o contraseña* son incorrectos'
                }
            });
        }
       
        return res.status(200).json({
            ok: true,
            UsrDB,
        });

    });


});

module.exports = app;