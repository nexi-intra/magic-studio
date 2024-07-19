import { z, ZodObject } from "zod";

export function generateValidationClass(
  databaseName: string,
  procedureName: string,
  jsonSchema: any,
  zodSchema: string
): string {
  // Get the properties of the schema
  const properties = Object.keys(jsonSchema.properties).filter(
    (key) => key !== "tenant" && key !== "searchindex"
  );

  // Create the TypeScript type definition
  const typeDefinition = properties
    .map((key) => `${key}: ${jsonSchema.properties[key].type}`)
    .join("; ");

  // Create the TypeScript function parameter list
  const parameterList = properties
    .map((key) => `${key}: ${jsonSchema.properties[key].type}`)
    .join(", ");

  // Create the class source code
  const classSource = `
/**
// Example usage
try {
  const ${databaseName}_${procedureName}_instance = new ${databaseName}_${procedureName}( ${properties.map((key) => `${key}: <value>`).join(",\n    ")});
  const ${procedureName}_instance = ${databaseName}_${procedureName}_instance.object();
  console.log('Validated data:', ${procedureName}_instance);
  ${databaseName}_${procedureName}_instance.execute(magicbox.authtoken);
} catch (error) {
  console.error('Validation failed:', error.message);
}
  */

class ${databaseName}_${procedureName} {
  private schema: ZodObject<any>;
  private instance: any = null;
  constructor(${parameterList}) {
   const input: InputType = { ${properties.join(", ")} };
     const schema = ${zodSchema};  
    this.schema = schema.omit({ tenant: true, searchindex: true });
    const result = this.schema.safeParse(input);

    if (!result.success) {
      throw new Error(result.error.errors.map(err => err.message).join(', '));
    }

    this.instance = result.data;
    this.instance.tenant = "";
    this.instance.searchindex = "";
  
  }
  

  // Getter method
  get(): object {
    if (this.instance === null) {
      throw new Error('Instance not set');
    }

    return this.instance;
  }

  execute(authtoken: string) {
        const result = await execute(
      token,
      "${databaseName}",
      "magic-mix.app",
      "${procedureName}",
      this.instance
    );

  }
}


  `;

  return classSource;
}

export function sample(databaseName: string, procedureName: string) {
  // Example usage:
  const jsonSchema = {
    type: "object",
    properties: {
      tenant: { type: "string" },
      searchindex: { type: "string" },
      name: { type: "string" },
      age: { type: "number" },
      email: { type: "string", format: "email" },
    },
    required: ["tenant", "searchindex", "name", "age", "email"],
  };

  const zodSchema = z
    .object({
      tenant: z.string(),
      searchindex: z.string(),
      name: z.string(),
      age: z.number(),
      email: z.string().email(),
    })
    .toString();

  console.log(
    generateValidationClass(databaseName, procedureName, jsonSchema, zodSchema)
  );
}
