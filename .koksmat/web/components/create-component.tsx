/*
 * CreateComponent
 * 
 * This component handles the creation of new components in the Koksmat Studio.
 * It accepts parameters for the working directory, file extension, component name,
 * source code, workspace ID, and authentication token. The component wraps the
 * source code with appropriate comments based on the file extension and creates
 * the file in the specified directory.
 */

import { toast } from "@/components/ui/use-toast"

import { vsCodeOpen } from "@/lib/vscode-open"
/*
//Example usage:
const result = convertToDashCase("StudioWelcomePage");
console.log(result); // Outputs: studio-welcome-page
  */
function convertToDashCase(input: string): string {
  return input
    .replace(/([a-z])([A-Z])/g, "$1-$2") // Insert dash between lowercase and uppercase
    .toLowerCase(); // Convert the entire string to lowercase
}
interface CreateComponentParams {
  cwd: string
  extension: string
  componentName: string
  sourceCode: string
  workspaceid: string
  magicbox: {
    authtoken: string
  }
}

export async function createComponent({
  cwd,
  extension,
  componentName,
  sourceCode,
  workspaceid,
  magicbox
}: CreateComponentParams) {
  const filename = `${convertToDashCase(componentName)}${extension}`

  const commentedCode = addComments(sourceCode, extension)

  const args = [
    "-c",
    `echo "${commentedCode.replaceAll('"', '\\"')}" > ${filename}`,
  ]
  const command = "bash"

  const request = new Request(`/api/autopilot/exec`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${magicbox.authtoken}`,
    },
    body: JSON.stringify({
      sessionid: workspaceid,
      action: "execute",
      command,
      args,
      cwd,
    }),
  })

  try {
    const result = await fetch(request)
    if (!result.ok) {
      throw new Error(`HTTP error! status: ${result.status}`)
    }

    await vsCodeOpen(magicbox.authtoken, filename, cwd)

    toast({
      title: "Component Created!",
      description: `Your new component "${componentName}" has been created with the provided source code and saved to ${filename}. VS Code has been asked to open the file.`,
    })
  } catch (error) {
    console.error(error)
    toast({
      title: "Error",
      description: "Failed to create component",
      variant: "destructive",
    })
  }
}

function addComments(sourceCode: string, extension: string): string {
  const commentWrappers: { [key: string]: [string, string] } = {
    '.ps1': ['<#', '#>'],
    '.go': ['/*', '*/'],
    '.ts': ['/*', '*/'],
    '.tsx': ['/*', '*/'],
    '.sql': ['/*', '*/'],
  }

  const [startComment, endComment] = commentWrappers[extension] || ['/**', '*/']

  return `${startComment}\n${sourceCode}\n${endComment}`
}

