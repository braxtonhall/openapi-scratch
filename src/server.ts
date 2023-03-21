import * as Hapi from '@hapi/hapi';
import path from "path";
import {addOpenAPIBackend} from "ts-openapi-backend";

const definition = require('./generated/openapi-spec.json');
const handlersDirectory = path.resolve("./src/routes/pets");

(async () => {
	const server = Hapi.server({
		port: 3000,
		host: 'localhost'
	});
	await addOpenAPIBackend(server, definition, handlersDirectory);
	return server.start();
})();
