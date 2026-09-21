const express = require('express');
const multer = require('multer');
const router = express.Router();

const auth = require('../controllers/auth');
const dashboard = require('../controllers/dashboard');
const perfil = require('../controllers/perfil');

const uploadPerfil = multer({
  storage: multer.memoryStorage(),
  fileFilter: (_req, file, cb) => cb(null, file.mimetype.startsWith('image/')),
  limits: { fileSize: 5 * 1024 * 1024 }
});

router.get('/', auth.login);
router.post('/login', auth.doLogin);
router.get('/registro', auth.registro);
router.post('/register', auth.doRegister);
router.get('/principal', dashboard.principal);
router.get('/perfil', perfil.editarPerfil);
router.post('/perfil', uploadPerfil.single('fotoPerfil'), perfil.actualizarPerfil);

module.exports = router;
