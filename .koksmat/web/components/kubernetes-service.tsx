import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChevronDown, ChevronUp, ExternalLink } from "lucide-react";

// Mock data for demonstration purposes
const mockResource = {
  name: "example-deployment",
  type: "Deployment",
  ingresses: ["main-ingress", "secondary-ingress"],
  endpoints: [
    { name: "http", port: 80, targetPort: 8080 },
    { name: "https", port: 443, targetPort: 8443 },
  ],
  instances: [
    { name: "pod-1", status: "Running", ip: "10.0.0.1" },
    { name: "pod-2", status: "Running", ip: "10.0.0.2" },
    { name: "pod-3", status: "Pending", ip: "N/A" },
  ],
};

export default function KubernetesService() {
  const [showInstances, setShowInstances] = useState(false);

  return (
    <Card className="w-full w-full mx-auto">
      <CardHeader>
        <CardTitle>{mockResource.name}</CardTitle>
        <CardDescription>Resource Type: {mockResource.type}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">Ingresses</h3>
            <div className="flex flex-wrap gap-2">
              {mockResource.ingresses.map((ingress, index) => (
                <Badge key={index} variant="secondary">
                  {ingress}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Endpoints</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Port</TableHead>
                  <TableHead>Target Port</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockResource.endpoints.map((endpoint, index) => (
                  <TableRow key={index}>
                    <TableCell>{endpoint.name}</TableCell>
                    <TableCell>{endpoint.port}</TableCell>
                    <TableCell>{endpoint.targetPort}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Instances</h3>
            <Button
              variant="outline"
              onClick={() => setShowInstances(!showInstances)}
              className="mb-2"
            >
              {showInstances ? "Hide" : "Show"} Instances
              {showInstances ? (
                <ChevronUp className="ml-2 h-4 w-4" />
              ) : (
                <ChevronDown className="ml-2 h-4 w-4" />
              )}
            </Button>
            {showInstances && (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>IP</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockResource.instances.map((instance, index) => (
                    <TableRow key={index}>
                      <TableCell>{instance.name}</TableCell>
                      <TableCell>
                        <Badge
                          className={
                            instance.status === "Running"
                              ? "bg-green-500"
                              : "bg-red-500"
                          }
                        >
                          {instance.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{instance.ip}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
