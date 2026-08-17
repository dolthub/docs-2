import { fileURLToPath } from "url";
import path from "path";
import { buildPostcssConfig } from "../shared/config/postcss.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default buildPostcssConfig(__dirname);
