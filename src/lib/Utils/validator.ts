import { createContext } from "./context"
import type { Writable } from "svelte/store";

export const validateFrom = createContext< Writable<Validator[]>>();

export interface Validator {
    validate: () => boolean;
    field: string;
}