const mongoose = require('mongoose');

let Schema = mongoose.Schema;
let ts = Date.now();
let date_ob = new Date(ts);
let date = date_ob.getDate();
let month = date_ob.getMonth() + 1;
let year = date_ob.getFullYear();
let fecha = year + "-" + month + "-" + date;
let rentaSchema = new Schema({
    libro: {
        type: String
    },
    usuario: {
        type: String
    },
    fecha: {
        type: Date,
        default:fecha
    },
    fecha_entrega: {
        type: Date
    }, 
    total_pagar: {
        type: Number
    },
    estado:{
        type:Boolean,
        default: true
    }
})

module.exports = mongoose.model('Renta', rentaSchema);