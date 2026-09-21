const mongoose = require('mongoose');
const Usuario = mongoose.model('Usuario');
const Comision = mongoose.model('Comision');

const limpiarUsuario = (usuario) => ({
  id: usuario._id,
  _id: usuario._id,
  nombre: usuario.nombre,
  email: usuario.email,
  fotoPerfil: usuario.fotoPerfil || ''
});

const registro = async (req, res) => {
  const { nombre, email, password } = req.body;
  if (!nombre || !email || !password) {
    return res.status(400).json({ mensaje: 'Nombre, correo y contraseña son obligatorios.' });
  }

  try {
    const nuevoUsuario = await Usuario.create({ nombre, email, password });
    return res.status(201).json({ mensaje: 'Usuario registrado con éxito.', usuario: limpiarUsuario(nuevoUsuario) });
  } catch (err) {
    if (err.code === 11000) return res.status(400).json({ mensaje: 'Ya existe una cuenta con ese correo.' });
    return res.status(500).json({ mensaje: 'No se pudo registrar el usuario.', error: err.message });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ mensaje: 'Correo y contraseña son obligatorios.' });

  try {
    const usuario = await Usuario.findOne({ email: email.toLowerCase().trim() });
    if (!usuario || usuario.password !== password) {
      return res.status(401).json({ mensaje: 'Correo o contraseña incorrectos.' });
    }
    return res.status(200).json({ mensaje: 'Login exitoso.', usuario: limpiarUsuario(usuario) });
  } catch (err) {
    return res.status(500).json({ mensaje: 'No se pudo iniciar sesión.', error: err.message });
  }
};

const usuarioLeerUno = async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.params.userid).lean();
    if (!usuario) return res.status(404).json({ mensaje: 'Usuario no encontrado.' });
    return res.status(200).json(limpiarUsuario(usuario));
  } catch (err) {
    return res.status(500).json({ mensaje: 'No se pudo obtener el usuario.', error: err.message });
  }
};

const usuarioActualizar = async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.params.userid);
    if (!usuario) return res.status(404).json({ mensaje: 'Usuario no encontrado.' });

    if (req.body.nombre !== undefined) usuario.nombre = String(req.body.nombre).trim();
    if (req.body.email !== undefined) usuario.email = String(req.body.email).toLowerCase().trim();
    if (req.body.password) usuario.password = req.body.password;
    if (req.file) usuario.fotoPerfil = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
    if (req.body.eliminarFoto === 'true') usuario.fotoPerfil = '';

    await usuario.save();
    return res.status(200).json({ mensaje: 'Perfil actualizado.', usuario: limpiarUsuario(usuario) });
  } catch (err) {
    if (err.code === 11000) return res.status(400).json({ mensaje: 'Ese correo ya está en uso.' });
    return res.status(500).json({ mensaje: 'No se pudo actualizar el perfil.', error: err.message });
  }
};

const usuarioBorrar = async (req, res) => {
  try {
    const usuario = await Usuario.findByIdAndDelete(req.params.userid);
    if (!usuario) return res.status(404).json({ mensaje: 'Usuario no encontrado.' });
    await Comision.deleteMany({ creador: req.params.userid });
    return res.status(200).json({ mensaje: 'Cuenta eliminada.' });
  } catch (err) {
    return res.status(500).json({ mensaje: 'No se pudo eliminar la cuenta.', error: err.message });
  }
};

module.exports = { registro, login, usuarioLeerUno, usuarioActualizar, usuarioBorrar };
