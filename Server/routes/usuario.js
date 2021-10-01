const express = require('express');
const _ = require('underscore');
const bcrypt = require('bcrypt');
const Usuario = require('../models/usuario');
const app = express();

app.get('/usuario', (req, res) => {
    Usuario.find()
    .exec((err, usuarios) => {
        if(err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        return res.status(200).json({
            ok: true,
            usuarios
        });
    });
});

app.post('/usuario', (req, res) => {
    let body = req.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        apellido: body.apellido,
        telefono: body.telefono,
        correo: body.correo,
        password: bcrypt.hashSync(body.password, 10)
    });

    usuario.save((err, usrDB) => {
        if(err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        return res.status(200).json({
          ok: true,
          usrDB,
          msg: 'Usuario creado correctamente'
        });
    })
})

app.put('/usuario', (req, res) => {
    let id = req.body.id;
    let body = _.pick(req.body['nombre', 'apellido', 'telefono', 'correo', 'password'])

    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true, context: 'query'}, (err, usrDB) => {
        if (err){
            return res.status(400).json({
                ok: false,
                err
            });
        }
        return res.status(200).json({
            ok: true, 
            usrDB
        })
    })
})

app.delete('/usuario', (req, res) => {
    let id  = req.body.id

    Usuario.deleteOne({_id: id}, (err, resp) => {
        if(err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        if(resp.deletedCount === 0) {
            return res.status(400).json({
                ok: false,
                err: {
                    id,
                    msg: 'Usuario no encontrado'
                }
            })
        }

        return res.status(200).json({
            ok: true,
            resp
        })
    })
})

module.exports = app;