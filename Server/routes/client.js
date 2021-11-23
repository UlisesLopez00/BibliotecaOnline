const express = require('express');
const Client = require('../models/client');
const app = express();

app.post('/client', (req, res) => {
    let body = req.body;

    let client = new Client({
        nombre: body.nombre,
        apellido: body.apellido,
        telefono: body.telefono,
        direccion: body.direccion
    });

    client.save((err, clientDB) => {
        if(err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        return res.status(200).json({
            ok: true,
            clientDB
        })
    })
})

app.get('/client', (req, res) => {
    Client.find()
    .exec((err, clientDB) => {
        if(err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        return res.status(200).json({
            ok: true,
            clientDB
        })
    })
})

app.delete('/client/:id', (req, res) => {
    let id = req.params.id
    
    Client.findByIdAndDelete({_id: id}, (err, resp) => {
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
                    msg: 'Cliente no encontrado'
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