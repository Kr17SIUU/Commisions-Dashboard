import {
  useEffect,
  useMemo,
  useState,
  type ChangeEvent,
  type FormEvent
} from 'react';

import type {
  Comision,
  EstadoComision
} from '../types';

interface Props {
  open: boolean;
  comision: Comision | null;
  saving: boolean;

  onClose: () => void;

  onSubmit: (values: {
    descripcion: string;
    estado: EstadoComision;
    imagenes: File[];
    imagenesEliminadas: number[];
  }) => Promise<void>;
}

export function CommissionModal({
  open,
  comision,
  saving,
  onClose,
  onSubmit
}: Props) {

  const [descripcion, setDescripcion] =
    useState('');

  const [estado, setEstado] =
    useState<EstadoComision>('demorado');

  const [imagenes, setImagenes] =
    useState<File[]>([]);

  const [imagenesExistentes, setImagenesExistentes] =
    useState<string[]>([]);

  const [previews, setPreviews] =
    useState<string[]>([]);

  useEffect(() => {

    if (!open) return;

    setDescripcion(
      comision?.descripcion || ''
    );

    setEstado(
      comision?.estado || 'demorado'
    );

    setImagenes([]);

    setPreviews([]);

    setImagenesExistentes(
      comision?.imagenes || []
    );

  }, [open, comision]);


  useEffect(() => {

    return () => {

      previews.forEach((preview) => {

        if (preview.startsWith('blob:')) {
          URL.revokeObjectURL(preview);
        }

      });

    };

  }, [previews]);

  const total =
    imagenes.length +
    imagenesExistentes.length;

  const todasPreviews = useMemo(
    () => [
      ...imagenesExistentes,
      ...previews
    ],
    [
      imagenesExistentes,
      previews
    ]
  );

  const handleImages = (
    event: ChangeEvent<HTMLInputElement>
  ) => {

    const files =
      Array.from(
        event.target.files || []
      );

    if (!files.length) {
      return;
    }

    if (
      total + files.length > 8
    ) {

      window.alert(
        'Puedes subir máximo 8 imágenes por comisión.'
      );

      event.target.value = '';

      return;
    }

    const invalid =
      files.find(
        (file) =>
          ![
            'image/jpeg',
            'image/png',
            'image/webp',
            'image/gif'
          ].includes(file.type) ||
          file.size > 5 * 1024 * 1024
      );

    if (invalid) {

      window.alert(
        'Cada archivo debe ser una imagen JPG, PNG, WEBP o GIF de máximo 5 MB.'
      );

      event.target.value = '';

      return;
    }

    setImagenes(
      (current) => [
        ...current,
        ...files
      ]
    );

    setPreviews(
      (current) => [
        ...current,
        ...files.map(
          (file) =>
            URL.createObjectURL(file)
        )
      ]
    );

    event.target.value = '';
  };

  const removeAt = (
    index: number
  ) => {


    if (
      index <
      imagenesExistentes.length
    ) {

      setImagenesExistentes(
        (current) =>
          current.filter(
            (_, i) => i !== index
          )
      );

      return;
    }

    const newIndex =
      index -
      imagenesExistentes.length;

    const preview =
      previews[newIndex];

    if (
      preview &&
      preview.startsWith('blob:')
    ) {
      URL.revokeObjectURL(preview);
    }

    setImagenes(
      (current) =>
        current.filter(
          (_, i) =>
            i !== newIndex
        )
    );

    setPreviews(
      (current) =>
        current.filter(
          (_, i) =>
            i !== newIndex
        )
    );
  };

  const submit = async (
    event: FormEvent
  ) => {

    event.preventDefault();

    const originales =
      comision?.imagenes || [];

    const imagenesEliminadas:
      number[] = [];

    let currentIndex = 0;

    originales.forEach(
      (imagen, originalIndex) => {

        if (
          imagenesExistentes[
            currentIndex
          ] === imagen
        ) {

          currentIndex++;

        } else {

          imagenesEliminadas.push(
            originalIndex
          );

        }

      }
    );

    await onSubmit({
      descripcion,
      estado,
      imagenes,
      imagenesEliminadas
    });
  };

  if (!open) {
    return null;
  }

  return (

    <div
      className="modal-backdrop-custom"
      role="presentation"
      onMouseDown={(event) => {

        if (
          event.target ===
          event.currentTarget &&
          !saving
        ) {
          onClose();
        }

      }}
    >

      <div
        className="commission-modal"
        role="dialog"
        aria-modal="true"
        aria-label={
          comision
            ? 'Editar comisión'
            : 'Nueva comisión'
        }
      >

        <div className="modal-heading">

          <div>

            <span className="eyebrow">

              {comision
                ? 'Actualizar'
                : 'Nueva'}

            </span>

            <h2>

              {comision
                ? 'Editar comisión'
                : 'Crear comisión'}

            </h2>

          </div>

          <button
            className="icon-button"
            type="button"
            onClick={onClose}
            disabled={saving}
            aria-label="Cerrar"
          >

            <i className="bi bi-x-lg" />

          </button>

        </div>

        <form onSubmit={submit}>

          <label className="field-label">
            Imágenes de referencia
          </label>

          <div className="image-picker">

            {todasPreviews.length ? (

              <div className="image-preview-grid">

                {todasPreviews.map(
                  (src, index) => (

                    <div
                      className="preview-item"
                      key={`${src.slice(0, 24)}-${index}`}
                    >

                      <img
                        src={src}
                        alt={`Vista previa ${index + 1}`}
                      />

                      <button
                        className="preview-remove"
                        type="button"
                        onClick={() =>
                          removeAt(index)
                        }
                        disabled={saving}
                        aria-label={`Quitar imagen ${index + 1}`}
                      >

                        <i className="bi bi-x-lg" />

                      </button>

                    </div>

                  )
                )}

              </div>

            ) : (

              <div className="image-empty">

                <i className="bi bi-cloud-arrow-up" />

                <span>
                  Añade una o varias referencias visuales
                </span>

              </div>

            )}

            <div className="image-actions">

              <label
                className="secondary-button"
                htmlFor="imagenes"
              >

                <i className="bi bi-images" />

                Añadir imágenes

              </label>

              <input
                id="imagenes"
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                multiple
                onChange={handleImages}
                disabled={saving}
                hidden
              />

              <span>
                {total}/8 imágenes
              </span>

            </div>

          </div>

          <label
            className="field-label"
            htmlFor="descripcion"
          >
            Descripción
          </label>

          <textarea
            id="descripcion"
            value={descripcion}
            onChange={(event) =>
              setDescripcion(
                event.target.value
              )
            }
            rows={4}
            maxLength={1000}
            placeholder="Describe la comisión..."
            required
          />

          <div className="char-count">

            {descripcion.length}/1000

          </div>

          <label
            className="field-label"
            htmlFor="estado"
          >
            Estado
          </label>

          <select
            id="estado"
            value={estado}
            onChange={(event) =>
              setEstado(
                event.target
                  .value as EstadoComision
              )
            }
          >

            <option value="demorado">
              En proceso
            </option>

            <option value="atrasado">
              Atrasado
            </option>

            <option value="completado">
              Completado
            </option>

          </select>

          <div className="modal-actions">

            <button
              className="secondary-button"
              type="button"
              onClick={onClose}
              disabled={saving}
            >
              Cancelar
            </button>

            <button
              className="primary-button"
              type="submit"
              disabled={saving}
            >

              {saving
                ? 'Guardando...'
                : comision
                  ? 'Guardar cambios'
                  : 'Crear comisión'}

            </button>

          </div>

        </form>

      </div>

    </div>
  );
}