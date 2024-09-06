import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { ExternalLink } from "lucide-react"

export default function MsGraphNavCard() {
  const docSections = [
    {
      id: "overview",
      title: "Overview",
      description: "Get started with Microsoft Graph",
      links: [
        { href: "/graph/overview", text: "What is Microsoft Graph?" },
        { href: "https://developer.microsoft.com/en-us/graph/use-the-api", text: "Use the API", external: true },
        { href: "/graph/auth", text: "Authentication" },
      ],
    },
    {
      id: "users",
      title: "Users",
      description: "Work with user resources",
      links: [
        { href: "/graph/api/user-list", text: "List users" },
        { href: "/graph/api/user-get", text: "Get user" },
        { href: "/graph/api/user-update", text: "Update user" },
      ],
    },
    {
      id: "groups",
      title: "Groups",
      description: "Manage groups and team collaboration",
      links: [
        { href: "/graph/api/group-list", text: "List groups" },
        { href: "/graph/api/group-post-groups", text: "Create group" },
        { href: "/graph/api/group-delete", text: "Delete group" },
      ],
    },
    {
      id: "files",
      title: "Files",
      description: "Work with files in OneDrive and SharePoint",
      links: [
        { href: "/graph/api/driveitem-get", text: "Get file or folder" },
        { href: "/graph/api/driveitem-put-content", text: "Upload file content" },
        { href: "/graph/api/driveitem-createlink", text: "Create sharing link" },
      ],
    },
    {
      id: "sharepoint",
      title: "SharePoint",
      description: "Interact with SharePoint sites and lists",
      links: [
        { href: "/graph/api/site-get", text: "Get site" },
        { href: "/graph/api/list-create", text: "Create list" },
        { href: "/graph/api/listitem-get", text: "Get list item" },
      ],
    },
    {
      id: "devices",
      title: "Devices",
      description: "Manage and monitor devices",
      links: [
        { href: "/graph/api/device-list", text: "List devices" },
        { href: "/graph/api/device-get", text: "Get device" },
        { href: "/graph/api/device-update", text: "Update device" },
      ],
    },
    {
      id: "security",
      title: "Security",
      description: "Access security-related resources and functionalities",
      links: [
        { href: "/graph/api/security-list-alerts", text: "List security alerts" },
        { href: "/graph/api/security-get-alert", text: "Get security alert" },
        { href: "/graph/api/security-update-alert", text: "Update security alert" },
      ],
    },
    {
      id: "compliance",
      title: "Compliance",
      description: "Work with compliance-related data and policies",
      links: [
        { href: "/graph/api/ediscoverycase-list", text: "List eDiscovery cases" },
        { href: "/graph/api/ediscoverycase-post", text: "Create eDiscovery case" },
        { href: "/graph/api/ediscoverycase-update", text: "Update eDiscovery case" },
      ],
    },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Microsoft Graph Documentation</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {docSections.map((section) => (
          <Card key={section.id} className="flex flex-col">
            <CardHeader>
              <CardTitle>{section.title}</CardTitle>
              <CardDescription>{section.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <ul className="space-y-2">
                {section.links.map((link, index) => (
                  <li key={index}>
                    <Link
                      href={link.href}
                      className="text-blue-600 hover:underline flex items-center"
                      target={link.external ? "_blank" : undefined}
                      rel={link.external ? "noopener noreferrer" : undefined}
                    >
                      <span>{link.text}</span>
                      {link.external && (
                        <ExternalLink className="ml-1 h-4 w-4" />
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}