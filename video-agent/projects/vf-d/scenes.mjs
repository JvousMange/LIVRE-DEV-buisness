import { scenesF } from "../full/scenes-factory.mjs";
import { decorD } from "../../library/decors.mjs";
export function scenes(C, X) { return scenesF(C, X, { decor: decorD }); }
