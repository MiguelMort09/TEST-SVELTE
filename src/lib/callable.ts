import { httpsCallable } from "firebase/functions";
import type { HttpsCallable } from "firebase/functions";
import { functions } from "./app";

type HttpFunction = {
  [key: string]: HttpsCallable<any, FuncResponse>;
};

  interface FuncResponse{
    "error":string|undefined,
    "result":string|undefined
  }

export const fun:HttpFunction = {};