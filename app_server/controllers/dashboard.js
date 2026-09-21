const principal = (req, res) => {
  const userNombre = req.query.nombre || 'Usuario';
  const userid = req.query.userid || '';
  if (!userid) return res.redirect('/?error=Debes iniciar sesión');
  return res.render('principal', { title: 'Commission Board', userid, userNombre });
};
module.exports = { principal };
