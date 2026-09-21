const mongoose = require('mongoose');
const Usuario = mongoose.model('Usuario');
const Comision = mongoose.model('Comision');

const editarPerfil = async (req, res) => {
  const userid = req.query.userid || '';
  const nombre = req.query.nombre || 'Usuario';
  if (!userid || !mongoose.Types.ObjectId.isValid(userid)) return res.redirect('/?error=Debes iniciar sesión');

  try {
    const [usuario, comisiones] = await Promise.all([
      Usuario.findById(userid).lean(),
      Comision.find({ creador: userid }).sort({ createdAt: -1 }).lean()
    ]);
    if (!usuario) return res.redirect('/?error=Usuario no encontrado');
    return res.render('perfil', { title: 'Mi perfil', userid, usuario, comisiones, success: req.query.success || '', error: req.query.error || '' });
  } catch {
    return res.redirect(`/principal?nombre=${encodeURIComponent(nombre)}&userid=${encodeURIComponent(userid)}`);
  }
};

const actualizarPerfil = async (req, res) => {
  const { userid, nombre, email, eliminarFoto } = req.body;
  if (!userid || !mongoose.Types.ObjectId.isValid(userid)) return res.redirect('/?error=Debes iniciar sesión');

  try {
    const usuario = await Usuario.findById(userid);
    if (!usuario) return res.redirect('/?error=Usuario no encontrado');
    usuario.nombre = String(nombre || usuario.nombre).trim();
    usuario.email = String(email || usuario.email).toLowerCase().trim();
    if (req.file) usuario.fotoPerfil = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
    if (eliminarFoto === 'true') usuario.fotoPerfil = '';
    await usuario.save();
    return res.redirect(`/perfil?nombre=${encodeURIComponent(usuario.nombre)}&userid=${encodeURIComponent(userid)}&success=${encodeURIComponent('Perfil actualizado correctamente.')}`);
  } catch (err) {
    return res.redirect(`/perfil?nombre=${encodeURIComponent(nombre || 'Usuario')}&userid=${encodeURIComponent(userid)}&error=${encodeURIComponent(err.code === 11000 ? 'Ese correo ya está en uso.' : 'No se pudo actualizar el perfil.')}`);
  }
};

module.exports = { editarPerfil, actualizarPerfil };
