
import { getCostCenters } from "./actions";
import CostCentersClientPage from "./cost-centers-client-page";

/**
 * Componente de Servidor para la página de gestión de Centros de Costo.
 */
export default async function CostCentersPage() {
    // 1. Obtener los datos de los centros de costo.
    const costCentersResult = await getCostCenters();

    // 2. Manejar posibles errores.
    if ('error' in costCentersResult) {
        return <div className="p-8 text-red-500">Error al cargar los centros de costo: {costCentersResult.error}</div>;
    }

    // 3. Renderizar el componente de cliente con los datos.
    return <CostCentersClientPage initialCostCenters={costCentersResult} />;
}
