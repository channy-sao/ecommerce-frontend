"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter, DialogClose,
} from "@/components/ui/dialog";

import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";

import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage, FormDescription,
} from "@/components/ui/form";

import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";

import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";

import {toast} from "sonner";
import {useQuery, useMutation, useQueryClient} from "@tanstack/react-query";

import {ProductApi} from "@/lib/api/product";
import {createProductSchema, CreateProductSchema} from "@/lib/validators/product-schema";
import {CategoryAPI} from "@/lib/api/category";
import {CategoryResponse} from "@/lib/types/category-response";
import {useState} from "react";
import {ImageUpload} from "@/components/ui/image-upload";
import {Switch} from "@/components/ui/switch";


export function CreateProductDialog() {
    const queryClient = useQueryClient();
    const [open, setOpen] = useState(false);

    const {data: categories} = useQuery({
        queryKey: ["categories"],
        queryFn: CategoryAPI.getAll,
    });

    // Create mutation for creating products
    const createProductMutation = useMutation({
        mutationFn: ProductApi.createProduct,
        onSuccess: () => {
            // Invalidate and refetch products queries
            void queryClient.invalidateQueries({queryKey: ["products"]});
            setOpen(false); // closing dialog after saved
            toast.success("Product created successfully");
            form.reset();
        },
        onError: (error) => {
            toast.error("Failed to create products");
            console.error("Create products error:", error);
        },
    });

    const form = useForm<CreateProductSchema>({
        resolver: zodResolver(createProductSchema),
        defaultValues: {
            name: "",
            description: "",
            price: "0",
            categoryId: "",
            isFeature: false, //matches boolean exactly
            image: undefined, // Single image, not array
        },
    });

    const onSubmit = async (values: CreateProductSchema) => {
        createProductMutation.mutate(values);
    };

    return (
        <Dialog open={open} onOpenChange={(val) => {
            setOpen(val);
            if (!val) form.reset(); // reset when dialog closes
        }}>
            <DialogTrigger asChild>
                <Button>Add Product</Button>
            </DialogTrigger>

            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Add Product</DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

                        {/* Name */}
                        <FormField
                            control={form.control}
                            name="name"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Product name" {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="price"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Price</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            step="0.01"
                                            placeholder="0.00"
                                            {...field}
                                            onChange={(e) => field.onChange(e.target.value)} // <-- FIX
                                        />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />

                        {/* Image Upload */}
                        <FormField
                            control={form.control}
                            name="image"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Product Images</FormLabel>
                                    <FormControl>
                                        <ImageUpload
                                            value={field.value}
                                            onChange={field.onChange}
                                            maxSize={5 * 1024 * 1024} // 5MB
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Upload one product image. Max file size: 5MB.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />


                        {/* Category */}
                        <FormField
                            control={form.control}
                            name="categoryId"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Category</FormLabel>
                                    <FormControl>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select category"/>
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
                                    <FormMessage/>
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
                                            Mark this product as featured to highlight it on the homepage
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

                        {/* Description */}
                        <FormField
                            control={form.control}
                            name="description"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="Description" {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />

                        <DialogFooter>
                            <DialogClose asChild>
                                <Button variant="outline" type="button">
                                    Cancel
                                </Button>
                            </DialogClose>
                            <Button
                                type="submit"
                                disabled={createProductMutation.isPending}
                            >
                                {createProductMutation.isPending ? "Creating..." : "Create"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}