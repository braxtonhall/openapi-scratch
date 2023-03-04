import {Request as HapiRequest} from '@hapi/hapi'
import { components, operations, paths } from "../generated";
import { Context } from "openapi-backend";
import * as Hapi from "@hapi/hapi";


type Request<Op extends keyof operations> = HapiRequest & {
	params: operations[Op] extends { parameters: { query: infer T } } ? T : never;
	payload: operations[Op] extends { requestBody: { content: { "application/json": infer T } } } ? T : never;
	headers: operations[Op] extends { parameters: { header: infer T } } ? T : never;
}

// TODO get return type information!
type Handler<Op extends keyof operations> = (
	context: Context,
	req: Request<Op>,
	h?: Hapi.ResponseToolkit,
	err?: Error,
) => Promise<unknown>;

type HandlerCollection = {
	[Op in keyof operations]?: Handler<Op>;
}

// Alternative export style for more concise typechecking!
export const pets: HandlerCollection = {
	makePet: async (ctx, req) => {
		const id = req.payload.id;
	},
	listPets: async (ctx, req) => {
		const limit = req.params.limit;
	},
};