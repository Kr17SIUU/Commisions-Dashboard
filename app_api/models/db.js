const dns = require('node:dns');
const mongoose = require('mongoose');

dns.setServers([
  '8.8.8.8',
  '1.1.1.1'
]);

const dbURI =
  process.env.MONGODB_URI ||
  'mongodb://127.0.0.1:27017/commission-board';

mongoose.connect(dbURI);

mongoose.connection.on('connected', () => {
  console.log('MongoDB conectado correctamente');
  console.log('Host:', mongoose.connection.host);
  console.log('Base de datos:', mongoose.connection.name);
});

mongoose.connection.on('error', (err) => {
  console.error('Error de MongoDB:', err.message);
});

require('./usuarios');
require('./comisiones');