
import { NextResponse } from 'next/server';
import { admin } from '@/lib/firebase-admin';

// Los 10 localizadores que proporcionaste
const locations = [
    { id: 'ALM01-ZA-P01-E01-N01-P01', almacen: 'ALM01', zona: 'ZA', pasillo: 'P01', estanteria: 'E01', nivel: 'N01', posicion: 'P01', tipoUbicacion: 'Picking', estado: 'Activo' },
    { id: 'ALM01-ZA-P01-E01-N02-P02', almacen: 'ALM01', zona: 'ZA', pasillo: 'P01', estanteria: 'E01', nivel: 'N02', posicion: 'P02', tipoUbicacion: 'Picking', estado: 'Activo' },
    { id: 'ALM01-ZB-P02-E03-N01-P01', almacen: 'ALM01', zona: 'ZB', pasillo: 'P02', estanteria: 'E03', nivel: 'N01', posicion: 'P01', tipoUbicacion: 'Reserva', estado: 'Activo' },
    { id: 'ALM01-ZB-P02-E03-N02-P03', almacen: 'ALM01', zona: 'ZB', pasillo: 'P02', estanteria: 'E03', nivel: 'N02', posicion: 'P03', tipoUbicacion: 'Reserva', estado: 'Activo' },
    { id: 'ALM02-ZA-P01-E02-N01-P01', almacen: 'ALM02', zona: 'ZA', pasillo: 'P01', estanteria: 'E02', nivel: 'N01', posicion: 'P01', tipoUbicacion: 'Recepción', estado: 'Activo' },
    { id: 'ALM02-ZA-P03-E04-N03-P02', almacen: 'ALM02', zona: 'ZA', pasillo: 'P03', estanteria: 'E04', nivel: 'N03', posicion: 'P02', tipoUbicacion: 'Picking', estado: 'Activo' },
    { id: 'ALM02-ZC-P04-E01-N01-P01', almacen: 'ALM02', zona: 'ZC', pasillo: 'P04', estanteria: 'E01', nivel: 'N01', posicion: 'P01', tipoUbicacion: 'Cuarentena', estado: 'Bloqueado' },
    { id: 'ALM03-ZA-P02-E02-N02-P02', almacen: 'ALM03', zona: 'ZA', pasillo: 'P02', estanteria: 'E02', nivel: 'N02', posicion: 'P02', tipoUbicacion: 'Picking', estado: 'Activo' },
    { id: 'ALM03-ZD-P05-E03-N01-P04', almacen: 'ALM03', zona: 'ZD', pasillo: 'P05', estanteria: 'E03', nivel: 'N01', posicion: 'P04', tipoUbicacion: 'Reserva', estado: 'Activo' },
    { id: 'ALM03-ZD-P05-E03-N02-P01', almacen: 'ALM03', zona: 'ZD', pasillo: 'P05', estanteria: 'E03', nivel: 'N02', posicion: 'P01', tipoUbicacion: 'Devoluciones', estado: 'Activo' }
];

export async function GET() {
    try {
        const db = admin.firestore();
        const collectionRef = db.collection('inventory_locations');
        const batch = db.batch();

        console.log('Starting to seed locations via API route...');

        for (const loc of locations) {
            const { id, ...data } = loc;
            const docRef = collectionRef.doc(id);
            batch.set(docRef, {
                ...data,
                createdAt: new Date().toISOString()
            });
        }

        await batch.commit();
        console.log(`Successfully seeded ${locations.length} locations.`);
        return NextResponse.json({ success: true, message: `Successfully seeded ${locations.length} locations.` });

    } catch (error: any) {
        console.error('Error seeding data via API route:', error);
        return NextResponse.json({ success: false, message: 'Error seeding data.', error: error.message }, { status: 500 });
    }
}
