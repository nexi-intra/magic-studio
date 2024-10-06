/**
 * This function is generated by Koksmat Studio v0.1
 * Feel free to modify it as needed
 *
 */

import { z, ZodObject } from "zod";
import { execute } from "@/actions/client";

// The schema for the CreateKoksmatModel procedure
const _schema = z
  .object({
    tenant: z.string().optional(),
    searchindex: z
      .string()
      .describe(
        "Search Index is used for concatenating all searchable fields in a single field making in easier to search\n"
      )
      .optional(),
    name: z.string().optional(),
    description: z.string().optional(),
    data: z.record(z.any()).optional(),
  })
  .describe("Create operation");

//  TypeScript type based on the schema
export type CreateKoksmatModelProps = z.infer<typeof _schema>;

// Exclude 'tenant' and 'searchindex' from the type
export type InputType = Omit<CreateKoksmatModelProps, "tenant" | "searchindex">;

/**
// Example usage of the  function CreateKoksmatModel
try {
  const  result =  CreateKoksmatModel(
    authtoken, // ensure this is a valid token
    name, //replace name with your own variable
    description, //replace description with your own variable
    data, //replace data with your own variable);
  
  
} catch (error) {
  console.error( error.message);
}
  */

export default async function CreateKoksmatModel(
  database: string,
  authtoken: string,
  name: string,
  description: string,
  data: object,
  id?: number
) {
  // constructs an object from the input parameters
  const input = { name, description, data };

  // The tenant name and search index are applied upstream, so they are omitted from the schema
  const __schema = _schema.omit({ tenant: true, searchindex: true });

  // Input data is validated against the schema, and might be transform during that process
  const item = __schema.safeParse(input);

  if (!item.success) {
    throw new Error(item.error.errors.map((err) => err.message).join(", "));
  }

  const dbrecord = { ...item.data, tenant: "", searchindex: "", id: id };
  const result = await execute(
    authtoken, // <-- this is the authentication token containing the user's credentials - the upn will be used as "actor" name
    database, // <-- this is a reference to a record in the connections table in the mix database
    "magic-mix.app", // <-- this is the service name processing the request
    "create_koksmat_model", // <-- this is the name of the procedure in the database pointed to by the connection
    dbrecord // <-- this is the data to be sent to the procedure
  );
  if (result.hasError) {
    throw new Error(result.errorMessage);
  }
  return result.data;
}
