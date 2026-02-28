'use client';

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import { Textarea } from "@/components/ui/textarea";
import { Category } from "./columns";
import { createCategory, updateCategory } from "./actions";
import { useTransition } from "react";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  name: z.string().min(3, "El nombre debe tener al menos 3 caracteres."),
  description: z.string().optional(),
});

interface CategoryFormProps {
  category?: Category;
  onClose: () => void;
  onSave: (category: Category) => void;
}

export function CategoryForm({ category, onClose, onSave }: CategoryFormProps) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: category?.name || "",
      description: category?.description || "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    startTransition(async () => {
      const result = category
        ? await updateCategory(category.id, values)
        : await createCategory(values);

      if (result.success) {
        toast({
          title: "Éxito",
          description: result.message,
        });
        if (result.data) {
          onSave(result.data);
        }
        onClose();
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: result.message,
        });
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre de la Categoría</FormLabel>
              <FormControl>
                <Input placeholder="Ej: Equipos de Cómputo" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descripción</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Ej: Laptops, desktops, monitores, etc."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={isPending}>
                Cancelar
            </Button>
            <Button type="submit" disabled={isPending}>
                {isPending ? "Guardando..." : "Guardar"}
            </Button>
        </div>
      </form>
    </Form>
  );
}
