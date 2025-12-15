"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

import { ProductApi } from "@/lib/api/product";
import { CategoryAPI } from "@/lib/api/category";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createProductSchema,
  CreateProductSchema,
} from "@/lib/validators/product-schema";
import { CategoryResponse } from "@/lib/types/category-response";

import { ImageUpload } from "@/components/ui/image-upload";
import { useEffect } from "react";
import { ProductResponse } from "@/lib/types/product-response";

interface EditProductDialogProps {
  product: ProductResponse;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditProductDialog({
  product,
  open,
  onOpenChange,
}: EditProductDialogProps) {
  const queryClient = useQueryClient();

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: () => CategoryAPI.getAll(),
  });

  // NOTE: image default is undefined -> means "no change" (keep existing image)
  const form = useForm<CreateProductSchema>({
    resolver: zodResolver(createProductSchema),
    defaultValues: {
      name: product.name,
      description: product.description || "",
      price: product.price.toString(),
      categoryId: product.categoryId.toString(),
      isFeature: product.isFeature,
      image: undefined, // <-- undefined = keep current image
    },
  });

  // Ensure form resets whenever dialog opens or products changes
  useEffect(() => {
    if (open) {
      form.reset({
        name: product.name,
        description: product.description || "",
        price: product.price.toString(),
        categoryId: product.categoryId.toString(),
        isFeature: product.isFeature,
        image: undefined,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, product?.id]);

  const mutation = useMutation({
    mutationFn: (data: CreateProductSchema) =>
      ProductApi.updateProduct(product.id, data),
    onSuccess: () => {
      toast.success("Product updated successfully.");
      form.reset(); // will reset to defaultValues (if you want to reset to products again call reset with products)
      void queryClient.invalidateQueries({ queryKey: ["products"] });
      onOpenChange(false);
    },
    onError: () => {
      toast.error("Failed to update products.");
    },
  });

  const onSubmit = (values: CreateProductSchema) => {
    // values.image: undefined = keep existing, null = remove image, File = new upload
    mutation.mutate(values);
  };

  const handleCancel = () => {
    // Reset to products values and keep image undefined (keep existing)
    form.reset({
      name: product.name,
      description: product.description || "",
      price: product.price.toString(),
      categoryId: product.categoryId.toString(),
      isFeature: product.isFeature,
      image: undefined,
    });
    onOpenChange(false);
  };

  const handleInteractOutside = (event: Event) => {
    if (form.formState.isDirty) {
      event.preventDefault();
      // Note: we purposely confirm client-side; user can still cancel
      if (
        confirm("You have unsaved changes. Are you sure you want to close?")
      ) {
        onOpenChange(false);
        form.reset({
          name: product.name,
          description: product.description || "",
          price: product.price.toString(),
          categoryId: product.categoryId.toString(),
          isFeature: product.isFeature,
          image: undefined,
        });
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        onInteractOutside={handleInteractOutside}
        className="max-w-md"
      >
        <DialogHeader>
          <DialogTitle>Edit Product</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter product name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Price */}
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      {...field}
                      onChange={(e) => field.onChange(e.target.value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Category */}
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories?.data?.map((cat: CategoryResponse) => (
                          <SelectItem key={cat.id} value={cat.id.toString()}>
                            {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Featured Switch */}
            <FormField
              control={form.control}
              name="isFeature"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                  <div className="space-y-0.5">
                    <FormLabel>Featured Product</FormLabel>
                    <FormDescription>
                      Mark this product as featured to highlight it
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Image Upload */}
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Image</FormLabel>
                  <FormControl>
                    <ImageUpload
                      value={field.value as File | null | undefined}
                      onChange={field.onChange}
                      existingImageUrl={product.image ?? null}
                      maxSize={5 * 1024 * 1024}
                    />
                  </FormControl>
                  <FormDescription>
                    {product.image
                      ? "Current image is displayed. Upload a new file to replace it or click remove to delete."
                      : "Upload products image. Max file size: 5MB."}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter product description"
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
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
