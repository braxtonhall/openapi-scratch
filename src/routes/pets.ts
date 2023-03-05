import { operations } from "../generated";
import { Context } from "openapi-backend";
import * as Hapi from "@hapi/hapi";

type Request<Op extends keyof operations> = Omit<Hapi.Request, 'params' | 'payload' | 'headers'> & {
	params: operations[Op] extends { parameters: { query: infer T } } ? T : never;
	payload: operations[Op] extends { requestBody: { content: { "application/json": infer T } } } ? T : never;
	headers: operations[Op] extends { parameters: { header: infer T } } ? T : never;
}

type PickContent<T> = T extends { content: Record<string, infer C> }
	? C
	: T extends Record<string, infer C>
		? PickContent<C>
		: never;

type ResponseToolkit<Op extends keyof operations> = Omit<Hapi.ResponseToolkit, "response"> & {
	response(value?: PickContent<operations[Op]>): Hapi.ResponseObject
};

// TODO get return type information!
type Handler<Op extends keyof operations> = (
	context: Context,
	req: Request<Op>,
	h?: ResponseToolkit<Op>,
	err?: Error,
) => Promise<unknown>;

type HandlerCollection = {
	[Op in keyof operations]?: Handler<Op>;
}

// Alternative export style for more concise typechecking!
export const pets: HandlerCollection = {
	makePet: async (ctx, req) => {
		const id = req.payload.id;
		return "makePet";
	},
	listPets: async (ctx, req) => {
		const limit = req.params.limit;
		return "listPets";
	},
};