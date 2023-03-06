import { OpenAPIBackend } from "openapi-backend";

import * as Hapi from '@hapi/hapi';
import { collect } from "./collect";
import { batchImport } from "./batchImport";
import path from "path";

const definition = require('./generated/openapi-spec.json');

const getHandlers = async () => {
	const requiredOperations = collect(definition, "operationId")
		.filter((id): id is string => typeof id === "string");
	const allImports = await batchImport(path.resolve("./src/routes/pets"));
	return Object.fromEntries(
		requiredOperations.map((operationId) => {
			const operations = collect(allImports, operationId)
				.filter((operation): operation is Function => typeof operation === "function");
			if (operations.length === 0) {
				throw new Error(`No operation bound for "${operationId}"`);
			} else if (operations.length > 1) {
				throw new Error(`Ambiguous operation bindings. Found ${operations.length} bindings for operation "${operationId}"`);
			} else {
				return [operationId, operations.at(0)];
			}
		})
	);
};

(async () => {
	const server = Hapi.server({
		port: 3000,
		host: 'localhost'
	});

	const api = new OpenAPIBackend({
		definition,
		handlers: {
			...await getHandlers(),
			validationFail: async (context, req: Hapi.Request, h: Hapi.ResponseToolkit) =>
				h.response({ err: context.validation.errors }).code(400),
			notFound: async (context, req: Hapi.Request, h: Hapi.ResponseToolkit) =>
				h.response({ context, err: 'not found' }).code(404),
		}
	});

	await api.init();

	server.route({
		method: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
		path: '/{path*}',
		handler: (req, h) =>
			api.handleRequest(
				{
					method: req.method,
					path: req.path,
					body: req.payload,
					query: req.query,
					headers: req.headers,
				},
				req,
				h,
			),
	});

	return server.start();
})();
