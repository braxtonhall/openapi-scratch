import { Handler, HandlerCollection } from "../types";

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