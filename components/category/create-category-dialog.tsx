"use client";

import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
import * as z from "zod";
import {toast} from "sonner";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogFooter,
    DialogTitle,
    DialogTrigger,
    DialogClose,
} from "@/components/ui/dialog";
import {Textarea} from "@/components/ui/textarea";
import {Button} from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {Input} from "@/components/ui/input";

import {createCategorySchema, CreateCategoryValues} from "@/lib/validators/category-schema";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {CategoryAPI} from "@/lib/api/category";
import {useState} from "react";

type FormValues = z.infer<typeof createCategorySchema>;

export function CreateCategoryDialog() {
    const queryClient = useQueryClient();
    const [open, setOpen] = useState(false);


    const form = useForm<FormValues>({
        resolver: zodResolver(createCategorySchema),
        defaultValues: {
            name: "",
            description: ""
        },
    });

    const mutation = useMutation({
        mutationFn: (data: CreateCategoryValues) => CategoryAPI.create(data),
        onSuccess: (data: CreateCategoryValues) => {
            toast.success("CategoryResponse created successfully.");
            form.reset();
            setOpen(false);
            void queryClient.invalidateQueries({queryKey: ['categories']});
        }
    });

    const onSubmit = async (values: FormValues) => {
        console.log("Submitted:", values);
        mutation.mutate(values);
    };

    const handleInteractOutside = (event: Event) => {
        // Prevent closing when clicking outside
        event.preventDefault();
    };

    return (
        <Dialog open={open} onOpenChange={(val) => {
            setOpen(val);
            if (!val) form.reset(); // reset when dialog closes
        }}>
            <DialogTrigger asChild>
                <Button>Create New Category</Button>
            </DialogTrigger>

            <DialogContent onInteractOutside={handleInteractOutside}>
                <DialogHeader>
                    <DialogTitle>Create Category</DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

                        <FormField
                            control={form.control}
                            name="name"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Category Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter category name" {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="description"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Category Description</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="Enter category description" {...field} />
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
                            <Button type="submit">Save</Button>
                        </DialogFooter>

                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
