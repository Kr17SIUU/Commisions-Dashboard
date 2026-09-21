const axios = require('axios');
const getApiBase = (req) => `${req.protocol}://${req.get('host')}/api`;

const login = (req, res) => res.render('login', { title: 'Commission Board', error: req.query.error || '' });
const registro = (_req, res) => res.render('registro', { title: 'Crear cuenta' });

const doLogin = async (req, res) => {
  try {
    const response = await axios.post(`${getApiBase(req)}/login`, { email: req.body.email, password: req.body.password });
    const { nombre, id } = response.data.usuario;
    return res.redirect(`/principal?nombre=${encodeURIComponent(nombre)}&userid=${encodeURIComponent(id)}`);
  } catch (error) {
    return res.render('login', { title: 'Commission Board', error: error.response?.data?.mensaje || 'No se pudo iniciar sesión.' });
  }
};

const doRegister = async (req, res) => {
  try {
    await axios.post(`${getApiBase(req)}/register`, { nombre: req.body.nombre, email: req.body.email, password: req.body.password });
    return res.redirect('/?success=Cuenta creada');
  } catch (error) {
    return res.render('registro', { title: 'Crear cuenta', error: error.response?.data?.mensaje || 'No se pudo crear la cuenta.' });
  }
};

module.exports = { login, registro, doLogin, doRegister };
