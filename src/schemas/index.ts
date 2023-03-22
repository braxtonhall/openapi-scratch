import {z} from "zod";
import {extendZodWithOpenApi} from "ts-openapi-backend";
extendZodWithOpenApi(z);

export const Pet = z.object({
	id: z.number().int().openapi({format: "int64"}),
	name: z.string(),
	tag: z.string().optional(),
});

export const Pets = z.array(Pet);

export const Error = z.object({
	code: z.number().int().openapi({format: "int32"}),
	message: z.string(),
});
