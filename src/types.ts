import { operations } from "./generated";
import * as Hapi from "@hapi/hapi";
import { Context } from "openapi-backend";

type Operation = keyof operations;

type Request<Op extends Operation> = Omit<Hapi.Request, 'params' | 'payload' | 'headers'> & {
	params: operations[Op] extends { parameters: { query: infer T } } ? T : never;
	payload: operations[Op] extends { requestBody: { content: { "application/json": infer T } } } ? T : never;
	headers: operations[Op] extends { parameters: { header: infer T } } ? T : never;
}

type PickContent<T> = T extends { content: Record<string, infer C> }
	? C
	: T extends Record<string, infer C>
		? PickContent<C>
		: never;

type ResponseToolkit<Op extends Operation> = Omit<Hapi.ResponseToolkit, "response"> & {
	response(value?: PickContent<operations[Op]['responses']>): Hapi.ResponseObject
};

// TODO get return type information!
export type Handler<Op extends Operation> = (
	context: Context,
	req: Request<Op>,
	h?: ResponseToolkit<Op>,
	err?: Error,
) => Promise<unknown>;

export type HandlerCollection = {
	[Op in Operation]?: Handler<Op>;
}
