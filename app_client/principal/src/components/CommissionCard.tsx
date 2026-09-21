import { useEffect, useState } from 'react';
import type { Comision, EstadoComision } from '../types';

interface Props {
  comision: Comision;
  onEdit: (comision: Comision) => void;
  onDelete: (comision: Comision) => void;
}

const labels: Record<EstadoComision, string> = { atrasado: 'Atrasado', demorado: 'En proceso', completado: 'Completado' };

export function CommissionCard({ comision, onEdit, onDelete }: Props) {
  const [actual, setActual] = useState(0);
  const imagenes = comision.imagenes || [];

  useEffect(() => { if (actual >= imagenes.length) setActual(0); }, [imagenes.length, actual]);

  const anterior = () => setActual((i) => (i === 0 ? imagenes.length - 1 : i - 1));
  const siguiente = () => setActual((i) => (i === imagenes.length - 1 ? 0 : i + 1));

  return (
    <article className="commission-card">
      <div className="commission-media">
        {imagenes.length ? (
          <>
            <img src={imagenes[actual]} alt={`Referencia ${actual + 1} de la comisión`} />
            {imagenes.length > 1 && (
              <>
                <button className="carousel-arrow carousel-left" type="button" onClick={anterior} aria-label="Imagen anterior"><i className="bi bi-chevron-left" /></button>
                <button className="carousel-arrow carousel-right" type="button" onClick={siguiente} aria-label="Imagen siguiente"><i className="bi bi-chevron-right" /></button>
                <div className="carousel-dots" aria-label="Seleccionar imagen">
                  {imagenes.map((_, index) => <button key={index} className={`carousel-dot ${index === actual ? 'active' : ''}`} type="button" onClick={() => setActual(index)} aria-label={`Ver imagen ${index + 1}`} />)}
                </div>
                <span className="carousel-counter">{actual + 1}/{imagenes.length}</span>
              </>
            )}
          </>
        ) : (
          <div className="commission-placeholder"><i className="bi bi-images" /><span>Sin imágenes</span></div>
        )}
        <span className={`status-pill status-${comision.estado}`}>{labels[comision.estado]}</span>
      </div>
      <div className="commission-body">
        <p>{comision.descripcion}</p>
        <small>Actualizado {new Date(comision.updatedAt).toLocaleDateString('es-EC')}</small>
        <div className="commission-actions">
          <button className="btn-edit" type="button" onClick={() => onEdit(comision)}><i className="bi bi-pencil-square" /> Editar</button>
          <button className="btn-delete" type="button" onClick={() => onDelete(comision)}><i className="bi bi-trash3" /> Eliminar</button>
        </div>
      </div>
    </article>
  );
}
