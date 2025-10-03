import * as z from "zod";

export const authSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, "Password is To Short"),
});

export type AuthSchemaType = z.infer<typeof authSchema>;
