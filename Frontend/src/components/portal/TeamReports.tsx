import { useState, useEffect } from 'react';
import { fetchPlanificacionByUnit, PlanificacionEntry } from '../../lib/api';

export function TeamReports() {
    const [plans, setPlans] = useState<PlanificacionEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadTeamReports();
    }, []);

    const loadTeamReports = async () => {
        try {
            const response = await fetchPlanificacionByUnit();
            if (response.success && response.data) {
                // Show all plans, sorted by date desc (already sorted by backend)
                setPlans(response.data);
            }
        } catch (err) {
            setError('Error al cargar reportes');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const downloadXLSX = async () => {
        const XLSX = await import('xlsx');
        const rows = plans.map(p => ({
            Fecha: p.fecha,
            Empleado: p.empleado_nombre,
            Lugar: p.lugar,
            Sector: p.sector_trabajo,
            Actividad: p.descripcion,
            Duración: p.duracion
        }));
        const worksheet = XLSX.utils.json_to_sheet(rows);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Reporte');
        XLSX.writeFile(workbook, `reporte_equipo_${new Date().toISOString().split('T')[0]}.xlsx`);
    };

    if (loading) return <div className="p-4 text-center text-gray-500">Cargando reportes...</div>;
    if (error) return <div className="p-4 text-center text-red-500">{error}</div>;

    return (
        <div className="cih-card mt-6">
            <div className="cih-card__body">
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <h3 className="cih-card__title">Reporte de Actividades</h3>
                        <p className="cih-card__subtitle">Historial de actividades planificadas por el equipo.</p>
                    </div>
                    <button
                        onClick={downloadXLSX}
                        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm font-medium flex items-center gap-2"
                    >
                        <span>📥</span> Descargar Excel
                    </button>
                </div>

                <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 sticky top-0">
                            <tr>
                                <th className="px-4 py-3">Fecha</th>
                                <th className="px-4 py-3">Empleado</th>
                                <th className="px-4 py-3">Lugar / Sector</th>
                                <th className="px-4 py-3">Actividad</th>
                            </tr>
                        </thead>
                        <tbody>
                            {plans.map((plan) => (
                                <tr key={plan.id} className="bg-white border-b hover:bg-gray-50">
                                    <td className="px-4 py-3 whitespace-nowrap text-gray-600">
                                        {new Date(plan.fecha).toLocaleDateString()}
                                    </td>
                                    <td className="px-4 py-3 font-medium text-gray-900">
                                        {plan.empleado_nombre}
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="font-medium">{plan.lugar}</div>
                                        <div className="text-xs text-gray-500">{plan.sector_trabajo}</div>
                                    </td>
                                    <td className="px-4 py-3 text-gray-600">
                                        {plan.descripcion}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
