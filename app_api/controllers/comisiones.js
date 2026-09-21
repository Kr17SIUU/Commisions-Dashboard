const mongoose =
  require('mongoose');

const Comision =
  mongoose.model('Comision');

const Usuario =
  mongoose.model('Usuario');


const ESTADOS = [
  'atrasado',
  'demorado',
  'completado'
];

const MAX_IMAGENES = 8;


const validarObjectId =
  (value) =>
    mongoose.Types
      .ObjectId
      .isValid(value);


const archivosADataUrl =
  (files = []) =>
    files.map(
      (file) =>
        `data:${file.mimetype};base64,${file.buffer.toString('base64')}`
    );


function parseIndicesEliminados(
  raw
) {

  if (!raw) {
    return [];
  }

  try {

    const parsed =
      JSON.parse(raw);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed
      .map(
        (value) =>
          Number(value)
      )
      .filter(
        (value) =>
          Number.isInteger(value) &&
          value >= 0
      );

  } catch {

    return [];

  }

}



const comisionesListar =
  async (req, res) => {

    try {

      const {
        creador
      } = req.query;


      if (
        !creador ||
        !validarObjectId(creador)
      ) {

        return res
          .status(400)
          .json({
            mensaje:
              'Debes indicar un usuario válido.'
          });

      }


      const comisiones =
        await Comision
          .find({
            creador
          })
          .sort({
            createdAt: -1
          })
          .lean();


      return res
        .status(200)
        .json(
          comisiones
        );


    } catch (err) {

      console.error(
        'Error listando comisiones:',
        err
      );

      return res
        .status(500)
        .json({
          mensaje:
            'No se pudieron cargar las comisiones.',

          error:
            err.message
        });

    }

  };



const comisionesCrear =
  async (req, res) => {

    try {

      const {
        userId,
        descripcion,
        estado
      } = req.body;


      if (
        !userId ||
        !validarObjectId(userId)
      ) {

        return res
          .status(400)
          .json({
            mensaje:
              'El usuario no es válido.'
          });

      }


      if (
        !descripcion ||
        !String(
          descripcion
        ).trim()
      ) {

        return res
          .status(400)
          .json({
            mensaje:
              'La descripción es obligatoria.'
          });

      }


      if (
        !ESTADOS.includes(
          estado
        )
      ) {

        return res
          .status(400)
          .json({
            mensaje:
              'Selecciona un estado válido.'
          });

      }


      const usuario =
        await Usuario
          .findById(
            userId
          )
          .lean();


      if (!usuario) {

        return res
          .status(404)
          .json({
            mensaje:
              'Usuario no encontrado.'
          });

      }


      const imagenes =
        archivosADataUrl(
          req.files
        );


      if (
        imagenes.length >
        MAX_IMAGENES
      ) {

        return res
          .status(400)
          .json({
            mensaje:
              `Puedes guardar máximo ${MAX_IMAGENES} imágenes.`
          });

      }


      const comision =
        await Comision.create({

          creador:
            userId,

          descripcion:
            String(
              descripcion
            ).trim(),

          estado,

          imagenes

        });


      return res
        .status(201)
        .json(
          comision
        );


    } catch (err) {

      console.error(
        'Error creando comisión:',
        err
      );

      return res
        .status(500)
        .json({

          mensaje:
            'No se pudo crear la comisión.',

          error:
            err.message

        });

    }

  };


const comisionesLeerUna =
  async (req, res) => {

    try {

      if (
        !validarObjectId(
          req.params
            .comisionid
        )
      ) {

        return res
          .status(400)
          .json({
            mensaje:
              'ID de comisión no válido.'
          });

      }


      const comision =
        await Comision
          .findById(
            req.params
              .comisionid
          )
          .lean();


      if (!comision) {

        return res
          .status(404)
          .json({
            mensaje:
              'Comisión no encontrada.'
          });

      }


      return res
        .status(200)
        .json(
          comision
        );


    } catch (err) {

      console.error(
        'Error obteniendo comisión:',
        err
      );

      return res
        .status(500)
        .json({

          mensaje:
            'No se pudo obtener la comisión.',

          error:
            err.message

        });

    }

  };


const comisionesActualizar =
  async (req, res) => {

    try {

      const {
        userId,
        descripcion,
        estado,
        imagenesEliminadas
      } = req.body;


      if (
        !validarObjectId(
          req.params
            .comisionid
        )
      ) {

        return res
          .status(400)
          .json({
            mensaje:
              'ID de comisión no válido.'
          });

      }


      if (
        !userId ||
        !validarObjectId(
          userId
        )
      ) {

        return res
          .status(400)
          .json({
            mensaje:
              'El usuario no es válido.'
          });

      }


      const comision =
        await Comision.findOne({

          _id:
            req.params
              .comisionid,

          creador:
            userId

        });


      if (!comision) {

        return res
          .status(404)
          .json({
            mensaje:
              'Comisión no encontrada.'
          });

      }


      if (
        descripcion !==
        undefined
      ) {

        const descripcionLimpia =
          String(
            descripcion
          ).trim();


        if (
          !descripcionLimpia
        ) {

          return res
            .status(400)
            .json({
              mensaje:
                'La descripción no puede quedar vacía.'
            });

        }


        comision.descripcion =
          descripcionLimpia;

      }


      /*
       * Estado
       */
      if (
        estado !==
        undefined
      ) {

        if (
          !ESTADOS.includes(
            estado
          )
        ) {

          return res
            .status(400)
            .json({
              mensaje:
                'Selecciona un estado válido.'
            });

        }


        comision.estado =
          estado;

      }


      const indicesEliminar =
        parseIndicesEliminados(
          imagenesEliminadas
        );



      const existentes =
        (
          comision.imagenes ||
          []
        ).filter(
          (_imagen, index) =>
            !indicesEliminar.includes(
              index
            )
        );



      const nuevas =
        archivosADataUrl(
          req.files
        );


      const todas = [
        ...existentes,
        ...nuevas
      ];


      if (
        todas.length >
        MAX_IMAGENES
      ) {

        return res
          .status(400)
          .json({
            mensaje:
              `Puedes guardar máximo ${MAX_IMAGENES} imágenes.`
          });

      }


      comision.imagenes =
        todas;


      await comision.save();


      return res
        .status(200)
        .json(
          comision
        );


    } catch (err) {

      console.error(
        'Error actualizando comisión:',
        err
      );

      return res
        .status(500)
        .json({

          mensaje:
            'No se pudo actualizar la comisión.',

          error:
            err.message

        });

    }

  };



const comisionesBorrar =
  async (req, res) => {

    try {

      const {
        userId
      } = req.body;


      if (
        !validarObjectId(
          req.params
            .comisionid
        )
      ) {

        return res
          .status(400)
          .json({
            mensaje:
              'ID de comisión no válido.'
          });

      }


      if (
        !userId ||
        !validarObjectId(
          userId
        )
      ) {

        return res
          .status(400)
          .json({
            mensaje:
              'El usuario no es válido.'
          });

      }


      const eliminada =
        await Comision
          .findOneAndDelete({

            _id:
              req.params
                .comisionid,

            creador:
              userId

          });


      if (!eliminada) {

        return res
          .status(404)
          .json({
            mensaje:
              'Comisión no encontrada.'
          });

      }


      return res
        .status(200)
        .json({
          mensaje:
            'Comisión eliminada.'
        });


    } catch (err) {

      console.error(
        'Error eliminando comisión:',
        err
      );

      return res
        .status(500)
        .json({

          mensaje:
            'No se pudo eliminar la comisión.',

          error:
            err.message

        });

    }

  };


module.exports = {

  comisionesListar,

  comisionesCrear,

  comisionesLeerUna,

  comisionesActualizar,

  comisionesBorrar

};