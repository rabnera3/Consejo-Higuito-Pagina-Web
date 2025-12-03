import { PlanificacionEntry } from '../../lib/api';

interface PlanDetailsModalProps {
    plan: PlanificacionEntry;
    onClose: () => void;
    onEdit?: (plan: PlanificacionEntry) => void;
    onDelete?: (id: number) => void;
    canEdit: boolean;
}

export default function PlanDetailsModal({ plan, onClose, onEdit, onDelete, canEdit }: PlanDetailsModalProps) {
    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h3>Detalles de Planificación</h3>
                    <button className="btn-close" onClick={onClose}>&times;</button>
                </div>
                <div className="modal-body">
                    <div className="detail-grid">
                        <div className="detail-item">
                            <label>Empleado</label>
                            <p>{plan.empleado_nombre || '—'}</p>
                        </div>
                        <div className="detail-item">
                            <label>Unidad</label>
                            <p>{plan.departamento || '—'}</p>
                        </div>
                        <div className="detail-item">
                            <label>Fecha</label>
                            <p>{plan.fecha}</p>
                        </div>
                        <div className="detail-item">
                            <label>Lugar</label>
                            <p>{plan.lugar}</p>
                        </div>
                        <div className="detail-item">
                            <label>Sector</label>
                            <p>{plan.sector_trabajo}</p>
                        </div>
                        <div className="detail-item">
                            <label>Área</label>
                            <p>{plan.area}</p>
                        </div>
                        <div className="detail-item">
                            <label>Recursos</label>
                            <p>{plan.recursos}</p>
                        </div>
                        <div className="detail-item">
                            <label>Línea de Servicio</label>
                            <p>{plan.linea_servicio}</p>
                        </div>
                        <div className="detail-item">
                            <label>Duración</label>
                            <p>{plan.duracion || '—'}</p>
                        </div>
                        <div className="detail-item full-width">
                            <label>Descripción</label>
                            <p>{plan.descripcion}</p>
                        </div>
                    </div>
                </div>
                <div className="modal-footer">
                    {canEdit && (
                        <>
                            <button
                                className="btn primary"
                                onClick={() => {
                                    if (onEdit) onEdit(plan);
                                    onClose();
                                }}
                            >
                                Editar
                            </button>
                            <button
                                className="btn danger"
                                onClick={() => {
                                    if (onDelete && plan.id) onDelete(plan.id);
                                    onClose();
                                }}
                            >
                                Eliminar
                            </button>
                        </>
                    )}
                    <button className="btn secondary" onClick={onClose}>Cerrar</button>
                </div>
            </div>
            <style>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          backdrop-filter: blur(2px);
        }
        .modal-content {
          background: white;
          border-radius: 12px;
          width: 90%;
          max-width: 600px;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
          animation: modal-in 0.2s ease-out;
        }
        @keyframes modal-in {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .modal-header {
          padding: 1.25rem;
          border-bottom: 1px solid #e2e8f0;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .modal-header h3 {
          margin: 0;
          font-size: 1.25rem;
          color: #1e293b;
        }
        .btn-close {
          background: none;
          border: none;
          font-size: 1.5rem;
          line-height: 1;
          color: #64748b;
          cursor: pointer;
        }
        .modal-body {
          padding: 1.5rem;
        }
        .detail-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
        }
        .detail-item {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }
        .detail-item.full-width {
          grid-column: 1 / -1;
        }
        .detail-item label {
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #64748b;
          font-weight: 600;
        }
        .detail-item p {
          margin: 0;
          color: #0f172a;
          font-size: 0.95rem;
        }
        .modal-footer {
          padding: 1.25rem;
          border-top: 1px solid #e2e8f0;
          display: flex;
          justify-content: flex-end;
          gap: 0.75rem;
          background: #f8fafc;
          border-radius: 0 0 12px 12px;
        }
        @media (max-width: 640px) {
          .detail-grid {
            grid-template-columns: 1fr;
            gap: 1rem;
          }
        }
      `}</style>
        </div>
    );
}
