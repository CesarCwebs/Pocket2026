
import { getLocations } from "./actions";
import LocationsClientPage from "./locations-client-page";

export default async function LocationsPage() {
    const locationsResult = await getLocations();

    // Manejo de errores o estado vacío
    if ('error' in locationsResult) {
        return <div>Error: {locationsResult.error}</div>;
    }

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-4">Gestión de Localizadores</h1>
            <p className="mb-6">Crea, edita y gestiona los localizadores de tu inventario.</p>
            <LocationsClientPage initialLocations={locationsResult} />
        </div>
    );
}
