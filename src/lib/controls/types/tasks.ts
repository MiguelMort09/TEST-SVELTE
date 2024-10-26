import type { z } from 'zod';
import { zchema } from '$lib/zchema';

export const TasksSchema = zchema.object({
		/** Label: "Categoría", string que hace referencia al id de otra colección */
		category: zchema.string(),
		categoryName: zchema.string().optional(),
		/** Label: "Completado" */
		completed: zchema.coerce.boolean().optional(),
		/** Label: "Fecha Compromiso" */
		dueDate: zchema.preprocess((data) => {
				if (data === undefined || data === null) return;
				if ( typeof data === "string" || data instanceof String) {
					return data;
				} else if (data instanceof Date) {
					return data;
				} else if ( typeof data === "object" && "toDate" in data && Object.prototype.hasOwnProperty.call(data, "toDate") && typeof data.toDate === "function") {
					return (data.toDate()) as Date;
				}
				return;
			}, zchema.date().optional()),
					/** Objeto Luxon DateTime con la fecha */
		dueDateTime: zchema.any().optional(),
		/** Label: "Nombre" */
		name: zchema.string().default(""),
		/** Label: "Subcategoría", string que hace referencia al id de otra colección */
		subcategory: zchema.string(),
		subcategoryName: zchema.string().optional(),
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
export type TasksType = z.infer<typeof TasksSchema>;


