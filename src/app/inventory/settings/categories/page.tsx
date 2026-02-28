
import { getCategories } from "./actions";
import CategoriesClientPage from "./categories-client-page";

/**
 * Componente de Servidor para la página de gestión de Categorías.
 * 
 * Su principal responsabilidad es obtener los datos iniciales del servidor
 * y pasarlos al componente de cliente correspondiente, que manejará
 * toda la interactividad y el estado de la interfaz de usuario.
 */
export default async function CategoriesPage() {
    // 1. Obtener los datos de las categorías.
    const categoriesResult = await getCategories();

    // 2. Manejar posibles errores durante la obtención de datos.
    if ('error' in categoriesResult) {
        // En un caso real, podríamos mostrar un componente de error más elaborado.
        return <div className="p-8 text-red-500">Error al cargar las categorías: {categoriesResult.error}</div>;
    }

    // 3. Renderizar el componente de cliente con los datos iniciales.
    return <CategoriesClientPage initialCategories={categoriesResult} />;
}
