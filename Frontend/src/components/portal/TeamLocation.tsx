import { useState, useEffect } from 'react';
import { fetchPlanificacionByUnit, PlanificacionEntry } from '../../lib/api';

export function TeamLocation() {
    const [plans, setPlans] = useState<PlanificacionEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadTeamLocation();
    }, []);

    const loadTeamLocation = async () => {
        try {
            const response = await fetchPlanificacionByUnit();
            if (response.success && response.data) {
                // Filter for today's plans
                const today = new Date().toISOString().split('T')[0];
                const todaysPlans = response.data.filter(p => p.fecha === today);
                setPlans(todaysPlans);
            }
        } catch (err) {
            setError('Error al cargar la ubicación del equipo');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="p-4 text-center text-gray-500">Cargando ubicación del equipo...</div>;
    if (error) return <div className="p-4 text-center text-red-500">{error}</div>;

    return (
        <div className="cih-card">
            <div className="cih-card__body">
                <h3 className="cih-card__title">Ubicación del Equipo (Hoy)</h3>
                <p className="cih-card__subtitle mb-4">Dónde se encuentra tu personal el día de hoy.</p>

                {plans.length === 0 ? (
                    <div className="text-center text-gray-500 py-4">
                        No hay planificaciones registradas para hoy.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3">Empleado</th>
                                    <th className="px-4 py-3">Lugar</th>
                                    <th className="px-4 py-3">Actividad</th>
                                    <th className="px-4 py-3">Horario</th>
                                </tr>
                            </thead>
                            <tbody>
                                {plans.map((plan) => (
                                    <tr key={plan.id} className="bg-white border-b hover:bg-gray-50">
                                        <td className="px-4 py-3 font-medium text-gray-900">
                                            {plan.empleado_nombre}
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                                                {plan.lugar}
                                            </span>
                                            <div className="text-xs text-gray-500 mt-1">{plan.sector_trabajo}</div>
                                        </td>
                                        <td className="px-4 py-3">
                                            {plan.descripcion}
                                        </td>
                                        <td className="px-4 py-3 text-gray-500">
                                            {plan.duracion || 'Día completo'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
