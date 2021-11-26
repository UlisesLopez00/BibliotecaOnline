const express = require('express');
const _ = require('underscore');
const Renta = require('../models/renta');
const app = express();

app.get('/renta', (req, res) => {
    Renta.find({estado:true})
        .populate("libro")
        .populate("client")
        .exec((err, renta) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            // console.log(renta);
            let now = new Date()
            let response = [];
          
            renta.forEach((element) => {
                let strToDate = new Date(element.fecha_entrega);
                if ((Math.round((strToDate - now) / (1000 * 60 * 60 * 24))+1) < 0) {
                    response.push({
                        _id:element._id,
                        libro:element.libro.titulo,
                        client:element.client.nombre + " " + element.client.apellido ,
                        fecha_entrega:element.fecha_entrega,
                        telefono:element.client.telefono,
                        cargos:(Math.round((strToDate - now) / (1000 * 60 * 60 * 24))+1)
                    })
                }else{
                    response.push({
                        _id:element._id,
                        libro:element.libro.titulo,
                        client:element.client.nombre + " " + element.client.apellido ,
                        telefono:element.client.telefono,
                        fecha_entrega:element.fecha_entrega,
                        cargos:0
                    })
                }
            });
            response.sort(function (a, b) {
                if (a.cargos > b.cargos) {
                  return 1;
                }
                if (a.cargos < b.cargos) {
                  return -1;
                }
                // a must be equal to b
                return 0;
              });
            return res.status(200).json({
                ok: true,
                response
            });
        });
});

app.post('/renta', (req, res) => {
    let body = req.body;
    let renta = new Renta({
        libro: body.libro,
        client: body.usuario,
        fecha_entrega:body.entrega,
        total_pagar:body.total
    });

    renta.save((err, rentaDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        return res.status(200).json({
            ok: true,
            rentaDB,
            msg: 'La renta se registro correctamente'
        });
    });
});

app.put('/renta/delete=:id', (req, res) => {
    let id  = req.params.id;
    console.log(id);

    Renta.findByIdAndUpdate(id, {estado:false}, { new: true, runValidators: true, context: 'query' }, (err, libDB) => {
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

app.delete('/renta', (req, res) => {
    let id = req.body.id;

    Renta.deleteOne({ _id: id }, (err, resp) => {
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