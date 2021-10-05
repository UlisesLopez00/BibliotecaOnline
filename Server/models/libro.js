const mongoose = require('mongoose');
const { now } = require('underscore');
let ts = Date.now();
let date_ob = new Date(ts);
let date = date_ob.getDate();
let month = date_ob.getMonth() + 1;
let year = date_ob.getFullYear();
let fecha = year + "-" + month + "-" + date;
let Schema = mongoose.Schema;

let libroSchema = new Schema({
    titulo: {
        type: String
    },
    autor: {
        type: String
    },
    categoria: {
        type: String
    },
    editorial: {
        type: String
    }, 
    fecha: {
        type: String,
        default:fecha
    },
    estado: {
        type: Boolean,
        default: true
    }
})

module.exports = mongoose.model('Libro', libroSchema);