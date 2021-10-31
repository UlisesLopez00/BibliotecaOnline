process.env.PORT = process.env.PORT || 3001;
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

let urlDB 

if(process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb+srv://admin:admin@cluster0.gw00l.mongodb.net/Biblioteca?retryWrites=true&w=majority'
}

process.env.URLDB = urlDB;