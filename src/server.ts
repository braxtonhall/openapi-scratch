import * as Hapi from "@hapi/hapi";
import path from "path";
import {addOpenAPIBackend, registerRoutes} from "ts-lib-openapi-backend";
import {Handler} from "./generated";

const definition = require("./generated/openapi-spec.json");
const handlerDirectory = path.resolve("./src/routes/pets");
const oldHandlerDirectory = path.resolve("./src/old-routes");

(async () => {
	const server = Hapi.server({
		port: 3000,
		host: "localhost",
	});
	await registerRoutes(server, oldHandlerDirectory, (handler: Handler): Handler => handler);
	await addOpenAPIBackend({
		server,
		definition,
		handlerDirectory,
		handlerDecorator: (handler: Handler): Handler => handler,
	});
	return server.start();
})();
