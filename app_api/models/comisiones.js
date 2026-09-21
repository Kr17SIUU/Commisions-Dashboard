const mongoose = require('mongoose');
const { Schema } = mongoose;

const comisionSchema = new Schema({
  descripcion: { type: String, required: true, trim: true, maxlength: 1000 },
  estado: {
    type: String,
    enum: ['atrasado', 'demorado', 'completado'],
    default: 'demorado',
    required: true
  },
  imagenes: { type: [String], default: [] },
  creador: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true, index: true }
}, { timestamps: true });

mongoose.model('Comision', comisionSchema);
