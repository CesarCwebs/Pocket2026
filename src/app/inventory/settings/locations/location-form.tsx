
'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Location } from './columns';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const formSchema = z.object({
    almacen: z.string().min(1, "El almacén es obligatorio."),
    zona: z.string().min(1, "La zona es obligatoria."),
    pasillo: z.string().min(1, "El pasillo es obligatorio."),
    estanteria: z.string().min(1, "La estantería es obligatoria."),
    nivel: z.string().min(1, "El nivel es obligatorio."),
    posicion: z.string().min(1, "La posición es obligatoria."),
    tipoUbicacion: z.string().min(1, "El tipo de ubicación es obligatorio."),
    estado: z.enum(['Activo', 'Bloqueado'], { required_error: "El estado es obligatorio." }),
});

interface LocationFormProps {
    onSubmit: (values: z.infer<typeof formSchema>, id?: string) => void;
    initialData?: Location | null;
}

export function LocationForm({ onSubmit, initialData }: LocationFormProps) {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData || {
            almacen: '',
            zona: '',
            pasillo: '',
            estanteria: '',
            nivel: '',
            posicion: '',
            tipoUbicacion: '',
            estado: 'Activo',
        },
    });

    const handleSubmit = (values: z.infer<typeof formSchema>) => {
        onSubmit(values, initialData?.id);
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 pt-4">
                <FormField control={form.control} name="almacen" render={({ field }) => (
                    <FormItem><FormLabel>Almacén</FormLabel><FormControl><Input placeholder="Ej: ALM01" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="zona" render={({ field }) => (
                    <FormItem><FormLabel>Zona</FormLabel><FormControl><Input placeholder="Ej: ZA" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="pasillo" render={({ field }) => (
                    <FormItem><FormLabel>Pasillo</FormLabel><FormControl><Input placeholder="Ej: P01" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="estanteria" render={({ field }) => (
                    <FormItem><FormLabel>Estantería</FormLabel><FormControl><Input placeholder="Ej: E01" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="nivel" render={({ field }) => (
                    <FormItem><FormLabel>Nivel</FormLabel><FormControl><Input placeholder="Ej: N01" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="posicion" render={({ field }) => (
                    <FormItem><FormLabel>Posición</FormLabel><FormControl><Input placeholder="Ej: P01" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="tipoUbicacion" render={({ field }) => (
                    <FormItem><FormLabel>Tipo de Ubicación</FormLabel><FormControl><Input placeholder="Ej: Picking, Reserva" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="estado" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Estado</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                                <SelectTrigger><SelectValue placeholder="Selecciona un estado" /></SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                <SelectItem value="Activo">Activo</SelectItem>
                                <SelectItem value="Bloqueado">Bloqueado</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )} />

                <Button type="submit" className="w-full">{initialData ? 'Guardar Cambios' : 'Crear Localizador'}</Button>
            </form>
        </Form>
    );
}
