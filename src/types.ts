import { components, operations } from "./generated";
import * as Hapi from "@hapi/hapi";
import { Context } from "openapi-backend";

type OperationId = keyof operations;

type Responses<Op extends OperationId> = operations[Op]['responses'];
type ResponseCode<Op extends OperationId> = keyof Responses<Op>;

type Request<Op extends OperationId> = Omit<Hapi.Request, 'params' | 'payload' | 'headers'> & {
	params: operations[Op] extends { parameters: { query: infer T } } ? T : never;
	payload: operations[Op] extends { requestBody: { content: { "application/json": infer T } } } ? T : never;
	headers: operations[Op] extends { parameters: { header: infer T } } ? T : never;
}

type PickContent<T> = T extends { content: Record<string, infer C> }
	? C
	: T extends Record<string, infer C>
		? PickContent<C>
		: never;

type ResponseToolkit<Op extends OperationId> = Omit<Hapi.ResponseToolkit, 'response'> & {
	response<Code extends ResponseCode<Op>>(
		value?: PickContent<Responses<Op>[Code]>
	): ResponseObject<Op, Code>;
};

type ResponseObject<
	Op extends OperationId,
	Code extends ResponseCode<Op>,
> = Omit<Hapi.ResponseObject, 'code'> & {
	code(statusCode: number & Code): ResponseObject<Op, Code>;
};

// TODO get return type information!
export type Handler<Op extends OperationId> = (
	context: Context,
	req: Request<Op>,
	h?: ResponseToolkit<Op>,
	err?: Error,
) => Promise<unknown>;

export type CompleteHandlerCollection = {
	[Op in OperationId]: Handler<Op>;
};

export type HandlerCollection = Partial<CompleteHandlerCollection>;
