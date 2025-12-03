import { PlanificacionEntry } from '../../lib/api';

interface WeeklyPlanViewProps {
  plans: PlanificacionEntry[];
  weekStart: string;
  weekEnd: string;
  onEdit: (plan: PlanificacionEntry) => void;
  onAdd: (date: string) => void;
  onViewDetails: (plan: PlanificacionEntry) => void;
  currentUserId?: number;
  userRole?: string;
}

export default function WeeklyPlanView({ plans, weekStart, onAdd, onViewDetails, currentUserId, userRole }: WeeklyPlanViewProps) {
  const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];

  // Generate dates for the week
  const getWeekDates = () => {
    if (!weekStart) return [];
    const start = new Date(weekStart);
    // Adjust for timezone offset to ensure we get the correct local date
    const dates = [];
    for (let i = 0; i < 5; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      dates.push(d.toISOString().split('T')[0]);
    }
    return dates;
  };

  const weekDates = getWeekDates();

  const getPlansForDate = (date: string) => {
    return plans.filter(p => p.fecha === date);
  };

  const canEdit = (plan: PlanificacionEntry) => {
    return currentUserId === plan.empleado_id || userRole === 'gerente';
  };

  return (
    <div className="weekly-grid-container">
      <div className="weekly-grid">
        {days.map((day, index) => {
          const date = weekDates[index];
          const dayPlans = getPlansForDate(date);
          const isToday = new Date().toISOString().split('T')[0] === date;

          return (
            <div key={day} className={`day-column ${isToday ? 'today' : ''}`}>
              <div className="day-header">
                <span className="day-name">{day}</span>
                <span className="day-date">{date ? date.split('-').slice(1).reverse().join('/') : ''}</span>
                <button
                  className="btn-icon-add"
                  onClick={() => onAdd(date)}
                  title="Agregar actividad"
                >
                  +
                </button>
              </div>
              <div className="day-content">
                {dayPlans.map(plan => {
                  const isEditable = canEdit(plan);
                  return (
                    <div
                      key={plan.id}
                      className={`plan-card ${isEditable ? 'editable' : ''}`}
                      onClick={() => onViewDetails(plan)}
                      style={{ cursor: 'pointer', opacity: isEditable ? 1 : 0.9 }}
                    >
                      <div className="plan-time">{plan.duracion}</div>
                      <div className="plan-title">{plan.lugar}</div>
                      <div className="plan-desc">{plan.descripcion}</div>
                      <div className="plan-meta">
                        <span className="badge">{plan.linea_servicio}</span>
                        {/* Show employee name if it's not the current user's plan, so they know whose it is */}
                        {plan.empleado_id !== currentUserId && (
                          <span className="badge user-badge" style={{ background: '#e0e7ff', color: '#3730a3' }}>
                            {plan.empleado_nombre?.split(' ')[0]}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
                {dayPlans.length === 0 && (
                  <div className="empty-slot" onClick={() => onAdd(date)}>
                    Sin actividades
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <style>{`
        .weekly-grid-container {
          overflow-x: auto;
          padding-bottom: 1rem;
        }
        .weekly-grid {
          display: grid;
          grid-template-columns: repeat(5, minmax(200px, 1fr));
          gap: 1rem;
          min-width: 1000px;
        }
        .day-column {
          background: #f8fafc;
          border-radius: 8px;
          border: 1px solid #e2e8f0;
          display: flex;
          flex-direction: column;
        }
        .day-column.today {
          background: #fff;
          border-color: #3b82f6;
          box-shadow: 0 0 0 1px #3b82f6;
        }
        .day-header {
          padding: 0.75rem;
          border-bottom: 1px solid #e2e8f0;
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: #f1f5f9;
          border-radius: 8px 8px 0 0;
        }
        .day-column.today .day-header {
          background: #eff6ff;
          color: #1e40af;
        }
        .day-name {
          font-weight: 600;
          font-size: 0.9rem;
        }
        .day-date {
          font-size: 0.8rem;
          color: #64748b;
        }
        .btn-icon-add {
          background: none;
          border: none;
          color: #64748b;
          cursor: pointer;
          font-size: 1.2rem;
          line-height: 1;
          padding: 0 0.25rem;
          border-radius: 4px;
        }
        .btn-icon-add:hover {
          background: #e2e8f0;
          color: #0f172a;
        }
        .day-content {
          padding: 0.5rem;
          flex: 1;
          min-height: 200px;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .plan-card {
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          padding: 0.5rem;
          transition: all 0.2s;
          box-shadow: 0 1px 2px rgba(0,0,0,0.05);
        }
        .plan-card.editable:hover {
          border-color: #cbd5e1;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          transform: translateY(-1px);
        }
        .plan-time {
          font-size: 0.75rem;
          color: #64748b;
          margin-bottom: 0.25rem;
        }
        .plan-title {
          font-weight: 600;
          font-size: 0.85rem;
          color: #0f172a;
          margin-bottom: 0.25rem;
        }
        .plan-desc {
          font-size: 0.8rem;
          color: #334155;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          margin-bottom: 0.5rem;
        }
        .plan-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 0.25rem;
        }
        .badge {
          font-size: 0.7rem;
          padding: 0.1rem 0.4rem;
          background: #f1f5f9;
          color: #475569;
          border-radius: 999px;
        }
        .empty-slot {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #94a3b8;
          font-size: 0.8rem;
          border: 1px dashed #cbd5e1;
          border-radius: 6px;
          cursor: pointer;
          min-height: 50px;
        }
        .empty-slot:hover {
          background: #f8fafc;
          border-color: #64748b;
          color: #64748b;
        }
      `}</style>
    </div>
  );
}
