const express = require('express');
const _ = require('underscore');
const request = require('request');
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
        .exec(async (err, libros) => {
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
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
app.post('/libro', async (req, res) => {

    let body = req.body;
    let urlL1;
    let urlL2;
    if (body.img || body.img2) {
        let Image = body.img.split(';base64,').pop();
        let Image2 = body.img2.split(';base64,').pop();
        const options = {
            method: 'POST',
            url: 'https://imgur-apiv3.p.rapidapi.com/3/image',
            headers: {
                'content-type': 'application/x-www-form-urlencoded',
                authorization: 'Client-ID 546c25a59c58ad7',
                'x-rapidapi-host': 'imgur-apiv3.p.rapidapi.com',
                'x-rapidapi-key': '1127d077d3mshcc3a04163b872c0p1cf914jsn7ea85f77df39',
                useQueryString: true
            },
            form: { image: Image }
        };
        const options2 = {
            method: 'POST',
            url: 'https://imgur-apiv3.p.rapidapi.com/3/image',
            headers: {
                'content-type': 'application/x-www-form-urlencoded',
                authorization: 'Client-ID 546c25a59c58ad7',
                'x-rapidapi-host': 'imgur-apiv3.p.rapidapi.com',
                'x-rapidapi-key': '1127d077d3mshcc3a04163b872c0p1cf914jsn7ea85f77df39',
                useQueryString: true
            },
            form: { image: Image2 }
        };   
        await request(options,async (error, response, bodyResponse) => {
            if (error) { };
            await sleep(5000)
            urlL1 = JSON.parse(bodyResponse)['data']['link'];
        });
        await request(options2,async (error, response, bodyResponse) => {
            if (error) { };
            await sleep(5000)
            urlL2 = JSON.parse(bodyResponse)['data']['link'];
        });
       await sleep(10000)
    } else {
        urlL1 = 'https://www.researchpad.co/public/assets/14648/cover.png'
        urlL2 = 'https://www.researchpad.co/public/assets/14648/cover.png'
    }
    let libro = await new Libro({
        shortId: getRandomInt(111111, 999999),
        titulo: body.titulo,
        autor: body.autor,
        categoria: body.categoria,
        editorial: body.editorial,
        fecha: body.fecha,
        img: [urlL1, urlL2],
        estado: body.estado
    });

    const notification = {
        headings: {
            "en": "New book added",
            "es": "Se agrego un nuevo libro"
        },
        contents: {
            'es': body.titulo,
            'en': body.titulo,
        },
        url: 'http://localhost:3000/',
        big_picture: libro.img[0],
        chrome_web_image: libro.img[0],
        included_segments: ['Subscribed Users'],
    };
    await libro.save((err, libDB) => {
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
            .catch(e => { });
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