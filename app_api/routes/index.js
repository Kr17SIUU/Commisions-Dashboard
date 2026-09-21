const express = require('express');
const multer = require('multer');
const router = express.Router();

const auth = require('../controllers/auth');
const comisiones = require('../controllers/comisiones');

const imageFilter = (_req, file, cb) => {
  if (!['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(file.mimetype)) {
    return cb(new Error('Solo se permiten imágenes JPG, PNG, WEBP o GIF.'));
  }
  cb(null, true);
};

const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: imageFilter,
  limits: { fileSize: 5 * 1024 * 1024, files: 8 }
});

router.post('/register', auth.registro);
router.post('/login', auth.login);
router.get('/users/:userid', auth.usuarioLeerUno);
router.put('/users/:userid', upload.single('fotoPerfil'), auth.usuarioActualizar);
router.delete('/users/:userid', auth.usuarioBorrar);

router.route('/comisiones')
  .get(comisiones.comisionesListar)
  .post(upload.array('imagenes', 8), comisiones.comisionesCrear);

router.route('/comisiones/:comisionid')
  .get(comisiones.comisionesLeerUna)
  .put(upload.array('imagenes', 8), comisiones.comisionesActualizar)
  .delete(comisiones.comisionesBorrar);

module.exports = router;
