
import { getUnitsOfMeasure } from "./actions";
import UnitsOfMeasureClientPage from "./units-of-measure-client-page";

/**
 * Componente de Servidor para la página de gestión de Unidades de Medida.
 */
export default async function UnitsOfMeasurePage() {
    // 1. Obtener los datos de las unidades de medida.
    const unitsResult = await getUnitsOfMeasure();

    // 2. Manejar posibles errores.
    if ('error' in unitsResult) {
        return <div className="p-8 text-red-500">Error al cargar las unidades: {unitsResult.error}</div>;
    }

    // 3. Renderizar el componente de cliente con los datos.
    return <UnitsOfMeasureClientPage initialUnits={unitsResult} />;
}
