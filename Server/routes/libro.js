const express = require('express');
const _ = require('underscore');
const Libro = require('../models/libro');
const OneSignal = require('onesignal-node');
const client = new OneSignal.Client('823879a6-405f-4a69-80b3-531d05936ada', 'NWQ1ZTgyNzItN2M0MC00NzM2LWIzNzQtYTM5YzY5NDhjMjdl');
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
    Libro.find({ shortId: id })
        .exec( async(err, libros) => {
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
app.get('/libro/regex=:regex', (req, res) => {
    let regex = req.params.regex;
    Libro.find({ titulo: { $regex: '.*' + regex + '.*', $options: 'i' } })
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
        shortId: getRandomInt(111111, 999999),
        titulo: body.titulo,
        autor: body.autor,
        categoria: body.categoria,
        editorial: body.editorial,
        fecha: body.fecha,
        estado: body.estado
    });
    const notification = {
        headings:{
            "en": "New book added", 
            "es": "Se agrego un nuevo libro"
        },
        contents: {
            'es': body.titulo,
            'en': body.titulo,
        },
        url:'http://localhost:3000/',
        big_picture:'https://images-na.ssl-images-amazon.com/images/I/513HVNQ7N8L._SY344_BO1,204,203,200_QL70_ML2_.jpg',
        chrome_web_image:'https://images-na.ssl-images-amazon.com/images/I/513HVNQ7N8L._SY344_BO1,204,203,200_QL70_ML2_.jpg',
        included_segments: ['Subscribed Users'],
    };
    libro.save((err, libDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        client.createNotification(notification)
            .then(response => {
                console.log(response.body);
            })
            .catch(e => {});
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

app.delete('/libro/:id', (req, res) => {
    let id = req.params.id;

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