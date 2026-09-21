const mongoose = require('mongoose');

const dbURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/commission-board';

mongoose.connect(dbURI);

mongoose.connection.on('connected', () => console.log('Conectado a MongoDB'));
mongoose.connection.on('error', (err) => console.error('Error de MongoDB:', err.message));

require('./usuarios');
require('./comisiones');
