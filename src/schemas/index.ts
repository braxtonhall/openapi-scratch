import {z} from "zod";
import {extendZodWithOpenApi} from "ts-lib-openapi-backend";

extendZodWithOpenApi(z);

export const petSchema = z.object({
	id: z.number().int().openapi({format: "int64"}),
	name: z.string(),
	tag: z.string().optional(),
});

export const petsSchema = z.array(petSchema);

export const errorSchema = z.object({
	code: z.number().int().openapi({format: "int32"}),
	message: z.string(),
});
