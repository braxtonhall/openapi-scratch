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

/**
 * @swagger
 * /pets:
 *   get:
 *     summary: List all pets
 *     operationId: listPets
 *     tags:
 *       - pets
 *     parameters:
 *       - name: limit
 *         in: query
 *         description: How many items to return at one time (max 100)
 *         required: false
 *         schema:
 *           type: integer
 *           format: int32
 *     responses:
 *       "200":
 *         description: A paged array of pets
 *         headers:
 *           x-next:
 *             description: A link to the next page of responses
 *             schema:
 *               type: string
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Pets"
 *       default:
 *         description: unexpected error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Error"
 */
export const listPets: Handler<"listPets"> = async (ctx, req) => {
	return "listPets";
};

/**
 * @swagger
 * /pets:
 *   post:
 *     summary: Create a new pet
 *     operationId: makePet
 *     tags:
 *       - pets
 *     requestBody:
 *       description: Optional description in Markdown
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Pet'
 *     responses:
 *       "200":
 *         description: A paged array of pets
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Pets"
 *       default:
 *         description: unexpected error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Error"
 */
export const makePet: Handler<"makePet"> = async (context, req) => {
	const petId: number = req.payload.id;
	return "makePet";
};

// Alternative export style for more concise typechecking!
export const pets: HandlerCollection = {
	makePet,
	listPets,
};