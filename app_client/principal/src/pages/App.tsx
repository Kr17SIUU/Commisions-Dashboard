import {
  useEffect,
  useMemo,
  useState
} from 'react';

import {
  CommissionCard
} from '../components/CommissionCard';

import {
  CommissionModal
} from '../components/CommissionModal';

import {
  actualizarComision,
  crearComision,
  eliminarComision,
  getApiError,
  listarComisiones,
  obtenerUsuario
} from '../services/api';

import type {
  Comision,
  EstadoComision,
  Usuario
} from '../types';

import '../principal.css';


function getInitialContext() {

  const root =
    document.getElementById(
      'principal-react-root'
    );

  const params =
    new URLSearchParams(
      window.location.search
    );

  return {

    userid:
      root?.dataset.userid ||
      params.get('userid') ||
      '',

    nombre:
      root?.dataset.nombre ||
      params.get('nombre') ||
      'Usuario'

  };
}


export default function App() {

  const context =
    useMemo(
      getInitialContext,
      []
    );

  const [
    usuario,
    setUsuario
  ] =
    useState<Usuario>({
      nombre: context.nombre,
      email: ''
    });

  const [
    comisiones,
    setComisiones
  ] =
    useState<Comision[]>([]);

  const [
    loading,
    setLoading
  ] =
    useState(true);

  const [
    saving,
    setSaving
  ] =
    useState(false);

  const [
    error,
    setError
  ] =
    useState('');

  const [
    success,
    setSuccess
  ] =
    useState('');

  const [
    modalOpen,
    setModalOpen
  ] =
    useState(false);

  const [
    editing,
    setEditing
  ] =
    useState<Comision | null>(
      null
    );


  const cargar =
    async () => {

      if (!context.userid) {
        return;
      }

      try {

        setLoading(true);
        setError('');

        const [
          userData,
          commissionData
        ] =
          await Promise.all([

            obtenerUsuario(
              context.userid
            ),

            listarComisiones(
              context.userid
            )

          ]);

        setUsuario(userData);

        setComisiones(
          commissionData
        );

      } catch (err) {

        setError(
          getApiError(err)
        );

      } finally {

        setLoading(false);

      }

    };


  useEffect(() => {

    void cargar();

  }, []);


  const openCreate = () => {

    setEditing(null);

    setModalOpen(true);

    setError('');

    setSuccess('');

  };


  const openEdit = (
    comision: Comision
  ) => {

    setEditing(comision);

    setModalOpen(true);

    setError('');

    setSuccess('');

  };


  const saveCommission =
    async (
      values: {
        descripcion: string;
        estado: EstadoComision;
        imagenes: File[];
        imagenesEliminadas: number[];
      }
    ) => {

      try {

        setSaving(true);

        setError('');

        setSuccess('');

        const formData =
          new FormData();

        formData.append(
          'userId',
          context.userid
        );

        formData.append(
          'descripcion',
          values.descripcion
        );

        formData.append(
          'estado',
          values.estado
        );

        /*
         * Solo enviamos las posiciones
         * eliminadas.
         *
         * Ya NO enviamos imágenes Base64
         * existentes.
         */
        if (editing) {

          formData.append(
            'imagenesEliminadas',
            JSON.stringify(
              values.imagenesEliminadas
            )
          );

        }

        /*
         * Solo se envían archivos nuevos.
         */
        values.imagenes.forEach(
          (imagen) => {

            formData.append(
              'imagenes',
              imagen
            );

          }
        );


        if (editing) {

          await actualizarComision(
            editing._id,
            formData
          );

          setSuccess(
            'Comisión actualizada correctamente.'
          );

        } else {

          await crearComision(
            formData
          );

          setSuccess(
            'Comisión creada correctamente.'
          );

        }

        setModalOpen(false);

        setEditing(null);

        await cargar();

      } catch (err) {

        setError(
          getApiError(err)
        );

      } finally {

        setSaving(false);

      }

    };


  const deleteCommission =
    async (
      comision: Comision
    ) => {

      if (
        !window.confirm(
          '¿Eliminar esta comisión? Esta acción no se puede deshacer.'
        )
      ) {

        return;

      }

      try {

        setError('');

        setSuccess('');

        await eliminarComision(
          comision._id,
          context.userid
        );

        setSuccess(
          'Comisión eliminada correctamente.'
        );

        setComisiones(
          (current) =>
            current.filter(
              (item) =>
                item._id !==
                comision._id
            )
        );

      } catch (err) {

        setError(
          getApiError(err)
        );

      }

    };


  return (

    <div className="app-shell">

      <header className="topbar">

        <a
          className="brand"
          href={
            `/principal?nombre=${
              encodeURIComponent(
                usuario.nombre ||
                context.nombre
              )
            }&userid=${
              encodeURIComponent(
                context.userid
              )
            }`
          }
        >

          <span className="brand-mark">
            C
          </span>

          <span>
            Commission Board
          </span>

        </a>


        <div className="user-area">

          <div className="user-copy">

            <strong>
              {
                usuario.nombre ||
                context.nombre
              }
            </strong>

            <span>
              {
                usuario.email ||
                'Mi cuenta'
              }
            </span>

          </div>


          <a
            className="avatar"
            href={
              `/perfil?nombre=${
                encodeURIComponent(
                  usuario.nombre ||
                  context.nombre
                )
              }&userid=${
                encodeURIComponent(
                  context.userid
                )
              }`
            }
            title="Ver perfil"
          >

            {usuario.fotoPerfil ? (

              <img
                src={
                  usuario.fotoPerfil
                }
                alt="Foto de perfil"
              />

            ) : (

              <i className="bi bi-person-fill" />

            )}

          </a>

        </div>

      </header>


      <main className="content-wrap">

        <section className="hero-row">

          <div>

            <span className="eyebrow">
              Moodboard personal
            </span>

            <h1>
              Mis comisiones
            </h1>

            <p>
              Guarda referencias visuales,
              descripción y estado de cada
              trabajo en un solo lugar.
            </p>

          </div>


          <button
            className="primary-button create-button"
            type="button"
            onClick={openCreate}
          >

            <i className="bi bi-plus-lg" />

            Nueva comisión

          </button>

        </section>


        {error && (

          <div className="notice notice-error">

            <i className="bi bi-exclamation-circle" />

            {error}

          </div>

        )}


        {success && (

          <div className="notice notice-success">

            <i className="bi bi-check-circle" />

            {success}

          </div>

        )}


        {loading ? (

          <div className="loading-state">

            <div className="spinner" />

            <p>
              Cargando tus comisiones...
            </p>

          </div>

        ) : comisiones.length === 0 ? (

          <section className="empty-state">

            <div className="empty-icon">

              <i className="bi bi-journal-plus" />

            </div>

            <h2>
              Aún no tienes comisiones
            </h2>

            <p>
              Crea la primera para comenzar
              tu moodboard.
            </p>

            <button
              className="primary-button"
              type="button"
              onClick={openCreate}
            >

              Crear mi primera comisión

            </button>

          </section>

        ) : (

          <section
            className="commission-grid"
            aria-label="Lista de comisiones"
          >

            {comisiones.map(
              (comision) => (

                <CommissionCard
                  key={
                    comision._id
                  }
                  comision={
                    comision
                  }
                  onEdit={
                    openEdit
                  }
                  onDelete={
                    (item) =>
                      void deleteCommission(
                        item
                      )
                  }
                />

              )
            )}

          </section>

        )}

      </main>


      <CommissionModal
        open={modalOpen}
        comision={editing}
        saving={saving}
        onClose={() => {

          if (!saving) {

            setModalOpen(false);

            setEditing(null);

          }

        }}
        onSubmit={saveCommission}
      />

    </div>
  );
}