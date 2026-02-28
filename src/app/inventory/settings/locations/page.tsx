
import { getLocations } from "./actions";
import LocationsClientPage from "./locations-client-page";

// Este es un COMPONENTE DE SERVIDOR. Es async.
// Su única responsabilidad es obtener los datos.
export default async function LocationsPage() {
    const locationsResult = await getLocations();

    // Manejo de errores o estado vacío
    if ('error' in locationsResult) {
        return <div>Error: {locationsResult.error}</div>;
    }

    // Pasa los datos obtenidos al componente de cliente.
    return <LocationsClientPage initialLocations={locationsResult} />;
}
