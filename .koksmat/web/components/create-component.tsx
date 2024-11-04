/*
 * CreateComponent
 * 
 * This component handles the creation of new components in the Koksmat Studio.
 * It accepts parameters for the working directory, file extension, component name,
 * source code, workspace ID, authentication token, and a flag to indicate if it's a test file.
 * The component wraps the source code with appropriate comments based on the file extension
 * and creates the file in the specified directory. For test files, it adjusts the filename
 * according to the language-specific conventions.
 */

import { toast } from "@/components/ui/use-toast"
import { vsCodeOpen } from "@/lib/vscode-open"

function convertToDashCase(input: string): string {
  return input
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .toLowerCase();
}

interface CreateComponentParams {
  cwd: string
  extension: string
  componentName: string

  workspaceid: string
  magicbox: {
    authtoken: string
  }
  isTest: boolean
}

export async function createComponent({
  cwd,
  extension,
  componentName,

  workspaceid,
  magicbox,
  isTest
}: CreateComponentParams) {
  let filename = `${convertToDashCase(componentName)}${extension}`

  if (isTest) {
    switch (extension) {
      case '.go':
        filename = `${convertToDashCase(componentName)}_test.go`
        break
      case '.ts':
      case '.tsx':
        filename = `${convertToDashCase(componentName)}.test${extension}`
        break
      case '.ps1':
        filename = `${convertToDashCase(componentName)}.Tests.ps1`
        break
      // Add more cases for other languages as needed
      default:
        // If no specific test naming convention, append 'test' to the filename
        filename = `${convertToDashCase(componentName)}.test${extension}`
    }
  }

  const commentedCode = addComments("", extension)

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
      description: `Your new ${isTest ? "test " : ""}component "${componentName}" has been created with the provided source code and saved to ${filename}. VS Code has been asked to open the file.`,
    })
  } catch (error) {
    console.error(error)
    toast({
      title: "Error",
      description: `Failed to create ${isTest ? "test " : ""}component`,
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