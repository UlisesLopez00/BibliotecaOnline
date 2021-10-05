const express = require('express');
const _ = require('underscore');
const Libros = require('../models/libros');
const app = express();

app.get('/libro', (req, res) => {
    Libros.find()
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
    let libro = new Libros({
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

    Libros.findByIdAndUpdate(id, body, { new: true, runValidators: true, context: 'query' }, (err, libDB) => {
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

    Libros.deleteOne({ _id: id }, (err, resp) => {
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