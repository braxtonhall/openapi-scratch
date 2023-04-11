import * as Hapi from "@hapi/hapi";
import path from "path";
import {addOpenAPIBackend} from "ts-lib-openapi-backend";
import {Handler} from "./generated";

const definition = require("./generated/openapi-spec.json");
const handlerDirectory = path.resolve("./src/routes/pets");

(async () => {
	const server = Hapi.server({
		port: 3000,
		host: "localhost",
	});
	await addOpenAPIBackend({
		server,
		definition,
		handlerDirectory,
		handlerDecorator: (handler: Handler): Handler => handler,
	});
	return server.start();
})();
