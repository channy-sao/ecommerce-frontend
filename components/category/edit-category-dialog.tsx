"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
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

import { CATEGORIES_QUERY_KEY, CategoryAPI } from '@/lib/api/category';
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCategorySchema } from "@/lib/validators/category-schema";
import { CategoryResponse } from "@/lib/types/category-response";

type FormValues = z.infer<typeof createCategorySchema>;

export function EditCategoryDialog({
  category,
  open,
  onOpenChange,
}: {
  category: CategoryResponse;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const queryClient = useQueryClient();

  const form = useForm<FormValues>({
    resolver: zodResolver(createCategorySchema),
    defaultValues: {
      name: category.name,
      description: category.description || "",
    },
  });

  const mutation = useMutation({
    mutationFn: (data: FormValues) => CategoryAPI.update(category.id, data),
    onSuccess: () => {
      toast.success("CategoryResponse updated successfully.");
      form.reset();
      void queryClient.invalidateQueries({ queryKey: [CATEGORIES_QUERY_KEY] });
      onOpenChange(false);
    },
    onError: () => {
      toast.error("Failed to update categories.");
    },
  });

  const onSubmit = (values: FormValues) => {
    mutation.mutate(values);
  };

  const handleCancel = () => {
    form.reset();
    onOpenChange(false);
  };

  const handleInteractOutside = (event: Event) => {
    if (form.formState.isDirty) {
      event.preventDefault();
      // Optional: Show confirmation dialog
      if (
        confirm("You have unsaved changes. Are you sure you want to close?")
      ) {
        onOpenChange(false);
        form.reset();
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {/*<span*/}
      {/*    className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"*/}
      {/*    onClick={() => setOpen(true)}*/}
      {/*>*/}
      {/*    Edit CategoryResponse*/}
      {/*</span>*/}

      <DialogContent onInteractOutside={handleInteractOutside}>
        <DialogHeader>
          <DialogTitle>Edit Category</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter category name" {...field} />
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
                  <FormLabel>Category Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter category description"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                variant="outline"
                type="button"
                onClick={handleCancel}
                disabled={mutation.isPending}
              >
                Cancel
              </Button>
              <Button variant={'custom'} type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
