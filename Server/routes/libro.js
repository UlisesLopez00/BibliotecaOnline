const express = require('express');
const _ = require('underscore');
const Libro = require('../models/libro');
const app = express();
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }
app.get('/libro', (req, res) => {
    Libro.find()
        .exec((err, libros) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            return res.status(200).json({
                ok: true,
                libros
            });
        });
});
app.get('/libro/buscar=:id', (req, res) => {
    let id = req.params.id;
    Libro.find({shortId:id})
        .exec((err, libros) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            return res.status(200).json({
                ok: true,
                libros
            });
        });
});
app.post('/libro', (req, res) => {
    let body = req.body;
    let libro = new Libro({
        shortId: getRandomInt(111111,999999),
        titulo: body.titulo,
        autor: body.autor,
        categoria: body.categoria,
        editorial: body.editorial,
        fecha: body.fecha,
        estado: body.estado
    });

    libro.save((err, libDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        return res.status(200).json({
            ok: true,
            libDB,
            msg: 'El libro se registro correctamente'
        });
    });
});

app.put('/libro', (req, res) => {
    let id = req.body.id;
    let body = _.pick(req.body['titulo', 'autor', 'categoria', 'editorial', 'fecha', 'estado'])

    Libro.findByIdAndUpdate(id, body, { new: true, runValidators: true, context: 'query' }, (err, libDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        return res.status(200).json({
            ok: true,
            libDB
        });
    });
});

app.delete('/libro', (req, res) => {
    let id = req.body.id;

    Libro.deleteOne({ _id: id }, (err, resp) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        if (resp.deletedCount === 0) {
            return res.status(400).json({
                ok: false,
                err: {
                    id,
                    msg: 'Libro no encontrado'
                }
            });
        }
        return res.status(200).json({
            ok: true,
            resp
        });
    });
});

module.exports = app;