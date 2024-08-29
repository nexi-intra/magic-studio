import * as jq from "node-jq";

/**
 * // Example usage
(async () => {
    // Example input JSON data
    const inputData = [
        { name: "John Doe", age: 30 },
        { name: "Jane Doe", age: 25 },
        { name: "John Smith", age: 40 }
    ];

    // Example jq filter
    const jqFilter = 'map(select(.name == "John Doe"))';

    try {
        const filteredData = await applyJqFilter(inputData, jqFilter);
        console.log('Filtered Data:', filteredData);
    } catch (error) {
        console.error('Failed to filter data:', error);
    }
})();
 * 
 * @param inputData 
 * @param jqFilter 
 * @returns 
 */
export async function applyJqFilter(
  inputData: any,
  jqFilter: string
): Promise<string> {
  try {
    // Convert input data to a string if it's not already
    const inputString =
      typeof inputData === "string" ? inputData : JSON.stringify(inputData);

    // Apply the jq filter
    const options = { input: "string" };
    const result = await jq.run(jqFilter, inputString, {
      input: "json",
      output: "string",
    });

    return result as string;
  } catch (error) {
    console.error("Error applying jq filter:", error);
    throw error;
  }
}
