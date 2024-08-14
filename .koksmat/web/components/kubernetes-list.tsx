"use client";
import { GenericTable } from "@/app/koksmat/table";
import { DataTableColumnHeader } from "@/app/koksmat/table/components/data-table-column-header";
import { GenericItem } from "@/app/koksmat/table/data/schema";
import useWorkspaceExec from "@/components/hooks/use-workspace-exec";
import { ColumnDef } from "@tanstack/react-table";
import React, { use, useEffect, useState } from "react";
import { Button } from "./ui/button";
import { GenericTableActions } from "@/app/koksmat/table/components/GenericTableActions";
import { set } from "date-fns";
import Link from "next/link";
import { APPNAME } from "@/app/global";

export interface ResouceTypePresention<T> {
  key: string;
  name: string;
  description: string;
  additionalColumns?: ColumnDef<GenericItem<T>>[];
  actions?: GenericTableActions<GenericItem<T>>;
  parseItem: (item: any) => any;
}

const ingressResource = (
  workspaceId: string,
  nameSpace: string
): ResouceTypePresention<any> => {
  return {
    key: "ingress",
    name: "Ingress",
    description:
      "A Kubernetes Ingress resource manages external access to services within a cluster, typically via HTTP/HTTPS, by defining rules for routing traffic to different backend services based on the host or path",
    additionalColumns: [
      {
        id: "link",
        accessorKey: "link",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Link" />
        ),
        cell: ({ row }) => {
          debugger;
          const href = row.original.link;
          if (!href) return null;
          return (
            <div className="cursor-pointer">
              <a href={href} target="_blank">
                <Button variant="outline"> {href}</Button>
              </a>
            </div>
          );
        },
        enableSorting: true,
        enableHiding: true,
      },
      {
        id: "service",
        accessorKey: "service",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Service" />
        ),
        cell: ({ row }) => {
          const service = row.original.string1;
          if (!service) return null;
          return (
            <div className="cursor-pointer">
              <Link
                href={
                  "/" +
                  APPNAME +
                  "/workspace/" +
                  workspaceId +
                  "/kubernetes/" +
                  nameSpace +
                  "/service/" +
                  service
                }
              >
                <Button variant="outline">{service}</Button>
              </Link>
            </div>
          );
        },
        enableSorting: true,
        enableHiding: true,
      },
    ],
    actions: {
      filterComponent: (params) => {
        if (params) {
          let x = 1;
        }
        return (
          <div className="flex w-max space-x-4 hidden">
            <Button
            // disabled={accounts.length > 0}
            // onClick={() => {
            //   instance.loginPopup();
            // }}
            >
              Login
            </Button>
            <Button
              // disabled={accounts.length < 1}
              variant={"destructive"}
              // onClick={() => {
              //   instance.loginRedirect();
              // }}
            >
              Logout
            </Button>
            <div className="grow">&nbsp;</div>
            <Button
              variant={"secondary"}
              // onClick={() => {
              //   setlatestResponse(undefined);
              // }}
            >
              Clear
            </Button>
          </div>
        );
      },
      selectedItemsActionsComponent: (params) => {
        return (
          <div>
            {/* <Button variant="destructive"> Delete</Button> */}
            {params.rows.length === 1 && (
              // params.rows[0].original.string1 === "New" &&

              <Button>Single</Button>
              // <AcceptOrder
              //   order={
              //     cava.orders.find(
              //       (o) => o.id === params.rows[0].original.id
              //     ) ?? null
              //   }
              //   onAcceptOrder={function (order: Order): void {

              //      createWorkOrderItems(
              //        magicbox.session?.accessToken ?? "",
              //        order
              //      )
              //      params.rows[0].original.string1 = "Pending"
              //      toast({
              //         title: "Work Orders created",

              //        variant: "default"
              //      })

              //   }}
              // />
            )}
            {params.rows.length > 1 && (
              <Button
                onClick={() => {
                  const items = params.rows.map((r) => {
                    return r.original;
                  });
                }}
              >
                Multiple
              </Button>
            )}
          </div>
        );
      },
    },
    parseItem: function (item: any) {
      return {
        //title: item.metadata.name,
        namespace: item.metadata.namespace,
        title: item.metadata.name,
        link: "https://" + item.spec.rules[0].host,
      };
    },
  };
};
const serviceResource = (
  workspaceId: string,
  nameSpace: string
): ResouceTypePresention<any> => {
  return {
    key: "service",
    name: "Service",
    description:
      "A Kubernetes Service is an abstraction that defines a logical set of Pods and a policy to access them, enabling stable network endpoints for applications, even as the underlying Pods change.",
    additionalColumns: [
      {
        id: "metadata",
        accessorKey: "metadata",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Link" />
        ),
        cell: ({ row }) => {
          debugger;
          const href = row.original.link;
          if (!href) return null;
          return (
            <div className="bg-red-300">
              <a href={href} target="_blank" className="cursor-pointer">
                {href}
              </a>
            </div>
          );
        },
        enableSorting: true,
        enableHiding: true,
      },
    ],
    actions: {
      filterComponent: (params) => {
        if (params) {
          let x = 1;
        }
        return (
          <div className="flex w-max space-x-4 hidden">
            <Button
            // disabled={accounts.length > 0}
            // onClick={() => {
            //   instance.loginPopup();
            // }}
            >
              Login
            </Button>
            <Button
              // disabled={accounts.length < 1}
              variant={"destructive"}
              // onClick={() => {
              //   instance.loginRedirect();
              // }}
            >
              Logout
            </Button>
            <div className="grow">&nbsp;</div>
            <Button
              variant={"secondary"}
              // onClick={() => {
              //   setlatestResponse(undefined);
              // }}
            >
              Clear
            </Button>
          </div>
        );
      },
      selectedItemsActionsComponent: (params) => {
        return (
          <div>
            {/* <Button variant="destructive"> Delete</Button> */}
            {params.rows.length === 1 && (
              // params.rows[0].original.string1 === "New" &&

              <Button>Single</Button>
              // <AcceptOrder
              //   order={
              //     cava.orders.find(
              //       (o) => o.id === params.rows[0].original.id
              //     ) ?? null
              //   }
              //   onAcceptOrder={function (order: Order): void {

              //      createWorkOrderItems(
              //        magicbox.session?.accessToken ?? "",
              //        order
              //      )
              //      params.rows[0].original.string1 = "Pending"
              //      toast({
              //         title: "Work Orders created",

              //        variant: "default"
              //      })

              //   }}
              // />
            )}
            {params.rows.length > 1 && (
              <Button
                onClick={() => {
                  const items = params.rows.map((r) => {
                    return r.original;
                  });
                }}
              >
                Multiple
              </Button>
            )}
          </div>
        );
      },
    },
    parseItem: function (item: any) {
      return {
        //title: item.metadata.name,
        namespace: item.metadata.namespace,
        title: item.metadata.name,
        link: "https://" + item.spec.rules[0].host,
      };
    },
  };
};

export default function KubernetesList(props: {
  namespace: string;
  workspaceid: string;
  resourceType: string;
}) {
  const resourceTypePresentations: ResouceTypePresention<any>[] = [
    ingressResource(props.workspaceid, props.namespace),
  ];

  const { resourceType, workspaceid } = props;

  //const [columns, setcolumns] = useState<ColumnDef<GenericItem<any>>[]>([]);

  const [currentPresentation, setcurrentPresentation] =
    useState<ResouceTypePresention<any>>();
  useEffect(() => {
    setcurrentPresentation(
      resourceTypePresentations.find((p) => p.key === resourceType)
    );
  }, [resourceType]);

  useEffect(() => {
    if (!currentPresentation) return;
    //setcolumns(currentPresentation.additionalColumns)
    /**
        switch (resourceType) {
      case "ingress":
        setcolumns([
          {
            id: "metadata",
            accessorKey: "metadata",
            header: ({ column }) => (
              <DataTableColumnHeader column={column} title="Metadata" />
            ),
            cell: ({ row }) => (
              <div>
                <Button
                  onClick={() => {
                    // aquireToken(row.original.refObject1);
                  }}
                >
                  Aquire
                </Button>
              </div>
            ),
            enableSorting: true,
            enableHiding: true,
          },
        ]);
        break;
      default:
        // setcolumns([
        //   { header: "Namespace"},
        //   { header: "Title" },
        // ]);
        break;
    }
     * 
     */
  }, [currentPresentation]);

  const data = useWorkspaceExec(
    workspaceid,
    "kubectl",
    ["get", resourceType, "-n", "magicbox-christianiabpos", "-o", "json"],
    "",
    (response: string) => {
      if (!response) return [];
      try {
        const data = JSON.parse(response);

        switch (resourceType) {
          case "ingress":
            return data?.items
              .map((item: any) => {
                const service =
                  item.spec.rules[0].http.paths[0].backend.service.name;
                const serviceport =
                  item.spec.rules[0].http.paths[0].backend.service.port.number;
                return {
                  //title: item.metadata.name,
                  namespace: item.metadata.namespace,
                  details: service + ":" + serviceport,
                  string1: service,
                  string2: serviceport,
                  title: item.metadata.name,
                  link: "https://" + item.spec.rules[0].host,
                };
              })
              .filter((a: any, b: any) => {
                return (a.title as string).localeCompare(b.title as string);
              });
          case "services":
            return data?.items.map((item: any) => {
              return {
                title: item.metadata.name,
                description: item.metadata.name,
                namespace: item.metadata.namespace,
                clusterIP: item.spec.clusterIP,
              };
            });
          case "pods":
            return data?.items.map((item: any) => {
              return {
                title: item.metadata.name,
                namespace: item.metadata.namespace,
                status: item.status.phase,
              };
            });
          case "deployment":
            return data?.items.map((item: any) => {
              return {
                name: item.metadata.name,
                namespace: item.metadata.namespace,
                replicas: item.status.replicas,
              };
            });
          case "configmap":
            return data?.items.map((item: any) => {
              return {
                name: item.metadata.name,
                namespace: item.metadata.namespace,
              };
            });
          case "secret":
            return data?.items.map((item: any) => {
              return {
                name: item.metadata.name,
                namespace: item.metadata.namespace,
              };
            });
          default:
            return [];
        }
      } catch (error) {
        debugger;
        return [];
      }
    }
  );
  return (
    <div>
      <GenericTable
        caption={currentPresentation?.name}
        actions={currentPresentation?.actions}
        description={currentPresentation?.description}
        data={data}
        addtionalColumns={currentPresentation?.additionalColumns}
      />
    </div>
  );
}
