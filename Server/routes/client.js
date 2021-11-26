const express = require('express');
const Client = require('./../models/client');
const app = express();
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }
app.post('/client', (req, res) => {
    let body = req.body;

    let client = new Client({
        shortId: getRandomInt(111111,999999),
        nombre: body.nombre,
        apellido: body.apellido,
        telefono: body.telefono,
        direccion: body.direccion,
        correo: body.correo,
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

app.get('/client/buscar=:id', (req, res) => {
    let id = req.params.id;
    Client.findById(id)
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