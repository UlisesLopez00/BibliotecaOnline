const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let clientSchema = new Schema({
<<<<<<< HEAD
    shortId: {
        type: String
    },
=======
>>>>>>> cab2374dbcacea6172204f5f0d6882dbcb164240
    nombre: {
        type: String
    },
    apellido: {
        type: String
    },
    telefono: {
        type: String
    },
    direccion: {
        type: String
<<<<<<< HEAD
    },
    correo: {
        type: String
=======
>>>>>>> cab2374dbcacea6172204f5f0d6882dbcb164240
    }
});

module.exports = mongoose.model('Client', clientSchema);