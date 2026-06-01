import { fileURLToPath } from "url";
import path from "path";
import { buildAstroConfig } from "../shared/config/astro.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default buildAstroConfig("https://doltgres.com", __dirname);
