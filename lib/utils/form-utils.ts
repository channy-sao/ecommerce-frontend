// lib/utils/form-utils.ts
import { zodResolver } from "@hookform/resolvers/zod";
import { ZodSchema } from "zod";

export function customZodResolver<T>(schema: ZodSchema<T>) {
    return zodResolver(schema as never);
}