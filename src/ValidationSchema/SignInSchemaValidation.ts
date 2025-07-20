import { z } from "zod";
export const SigInSchemaValidation = z.object({
  username: z.string(),
  password: z.string(),
});
