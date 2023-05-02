import {Route, extendZodWithOpenApi} from "ts-lib-openapi-backend";

import joi from "joi";
import {z} from "zod";

export const foo: Route = {
	handler: async (req) => ({bar: req.query.bar}),
	method: "GET",
	path: "/foo",
	options: {
		validate: {
			query: joi.object().keys({
				bar: joi.string(),
			}),
		},
	},
	// OpenAPI fields are allowable on a Route to match
	// the Routes used by code generation
	summary: "Here's a summary of the route for OpenAPI",
	responses: {
		200: {
			description: "Some description",
			content: {
				"application/json": {
					schema: z.string(),
				},
			},
		},
	},
};
