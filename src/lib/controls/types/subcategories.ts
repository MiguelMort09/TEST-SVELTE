import type { z } from 'zod';
import { zchema } from '$lib/zchema';

export const SubcategoriesSchema = zchema.object({
		/** Label: "Categoría", string que hace referencia al id de otra colección */
		category: zchema.string(),
		categoryName: zchema.string().optional(),
		/** Label: "Nombre" */
		name: zchema.string().default(""),
		/** Label: "Orden" */
		order: zchema.coerce.number().int(),
		id: zchema.string().optional(),
		/** Objeto Firestore Timestamp con fecha de alta del registro */
		added: zchema.any().optional(),
		/** Objeto Luxon DateTime con fecha de alta del registro */
		addedTime: zchema.any().optional(),
		/** Objeto Firestore Timestamp con fecha de alta del registro */
		edited: zchema.any().optional(),
		/** Objeto Luxon DateTime con fecha de alta del registro */
		editedTime: zchema.any().optional(),
});

// eslint-disable-next-line camelcase
export type SubcategoriesType = z.infer<typeof SubcategoriesSchema>;


