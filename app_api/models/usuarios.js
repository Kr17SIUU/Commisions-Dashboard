const mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema({
  nombre: { type: String, required: true, trim: true, maxlength: 80 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, minlength: 4 },
  fotoPerfil: { type: String, default: '' }
}, { timestamps: true });

mongoose.model('Usuario', usuarioSchema);
