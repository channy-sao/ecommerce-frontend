"use client";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import {
    Alert,
    AlertDescription,
    AlertTitle,
} from "@/components/ui/alert"
import { AlertCircleIcon, CheckCircle2Icon, PopcornIcon } from "lucide-react";


import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";

const chartData = [
    { month: "January", desktop: 186, mobile: 80 },
    { month: "February", desktop: 305, mobile: 200 },
    { month: "March", desktop: 237, mobile: 120 },
    { month: "April", desktop: 73, mobile: 190 },
    { month: "May", desktop: 209, mobile: 130 },
    { month: "June", desktop: 214, mobile: 140 },
];

const chartConfig = {
    desktop: {
        label: "Desktop",
        color: "#2563eb",
    },
    mobile: {
        label: "Mobile",
        color: "#60a5fa",
    },
} satisfies ChartConfig;



export default function BlockPage() {




    return (
        <div className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            Block Page

            <br />

            <AlertDialog>
                <AlertDialogTrigger>Open</AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete your account
                            and remove your data from our servers.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction>Continue</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>


            <br />


            <div className="grid w-full max-w-xl items-start gap-4">
                <Alert>
                    <CheckCircle2Icon />
                    <AlertTitle>Success! Your changes have been saved</AlertTitle>
                    <AlertDescription>
                        This is an alert with icon, title and description.
                    </AlertDescription>
                </Alert>
                <Alert>
                    <PopcornIcon />
                    <AlertTitle>
                        This Alert has a title and an icon. No description.
                    </AlertTitle>
                </Alert>
                <Alert variant="destructive">
                    <AlertCircleIcon />
                    <AlertTitle>Unable to process your payment.</AlertTitle>
                    <AlertDescription>
                        <p>Please verify your billing information and try again.</p>
                        <ul className="list-inside list-disc text-sm">
                            <li>Check your card details</li>
                            <li>Ensure sufficient funds</li>
                            <li>Verify billing address</li>
                        </ul>
                    </AlertDescription>
                </Alert>
            </div>

            <br />

            <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
                <BarChart accessibilityLayer data={chartData}>
                    <CartesianGrid vertical={false} />
                    <XAxis
                        dataKey="month"
                        tickLine={false}
                        tickMargin={10}
                        axisLine={false}
                        tickFormatter={(value) => value.slice(0, 3

                        )}
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
                    <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
                </BarChart>
            </ChartContainer>

        </div>
    );
}