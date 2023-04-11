import {RouteOptions} from "ts-lib-openapi-backend";
export default {
	path: "/old",
	method: "GET",
	async handler(): Promise<unknown> {
		return "old";
	},
} satisfies RouteOptions;
