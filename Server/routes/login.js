const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');
const app = express();


app.post('/login', (req, res) => {

    let body = req.body;
    Usuario.findOne({ email: body.email }, (err, UsrDB) => {
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
                    message: 'El usuario y/o contraseña son incorrectos'
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
        if (UsrDB.role != "ADMIN"){
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'El usuario y/o contraseña son incorrectos'
                }
            });
        }
        let token = jwt.sign({
            usuario: UsrDB
        }, process.env.SEED,{ expiresIn: process.env.CADUCIDAD_TOKEN }
        );
        return res.status(200).json({
            ok: true,
            UsrDB,
            token: token 
        });

    });


});

module.exports = app;