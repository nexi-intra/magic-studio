"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Cloud, Bot, Database } from "lucide-react";
import Link from "next/link";
import { ca } from "date-fns/locale";

const apiCategories = [
  {
    name: "Microsoft Graph",
    icon: <Cloud className="h-6 w-6" />,
    color: "bg-blue-500",
    href: "/studio/api/microsoft/graph",
  },
  { name: "OpenAI", icon: <Bot className="h-6 w-6" />, color: "bg-green-500" },
  {
    name: "Google Services",
    icon: <Cloud className="h-6 w-6" />,
    color: "bg-red-500",
  },
  {
    name: "AWS Services",
    icon: <Database className="h-6 w-6" />,
    color: "bg-yellow-500",
  },
];

const featuredApis = [
  {
    name: "Microsoft Graph Users",
    category: "Microsoft Graph",
    description: "Manage user data and relationships",
  },
  {
    name: "OpenAI GPT-3",
    category: "OpenAI",
    description: "Generate human-like text with AI",
  },
  {
    name: "Google Maps",
    category: "Google Services",
    description: "Integrate mapping and location services",
  },
  {
    name: "AWS S3",
    category: "AWS Services",
    description: "Scalable storage in the cloud",
  },
];

export default function ApiBrowser() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredApis = featuredApis.filter(
    (api) =>
      api.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      api.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-14 flex items-center">
        <Link className="flex items-center justify-center" href="#">
          <Search className="h-6 w-6" />
          <span className="sr-only">API Browser</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link
            className="text-sm font-medium hover:underline underline-offset-4"
            href="#"
          >
            Home
          </Link>
          <Link
            className="text-sm font-medium hover:underline underline-offset-4"
            href="#"
          >
            Documentation
          </Link>
          <Link
            className="text-sm font-medium hover:underline underline-offset-4"
            href="#"
          >
            Pricing
          </Link>
          <Link
            className="text-sm font-medium hover:underline underline-offset-4"
            href="#"
          >
            Contact
          </Link>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Explore APIs with Ease
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  Your gateway to Microsoft Graph, OpenAI, Google Services, and
                  AWS APIs. Discover, learn, and integrate effortlessly.
                </p>
              </div>
              <div className="w-full max-w-sm space-y-2">
                <form className="flex space-x-2">
                  <Input
                    className="max-w-lg flex-1"
                    placeholder="Search APIs..."
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <Button type="submit">Search</Button>
                </form>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              API Categories
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
              {apiCategories.map((category) => (
                <Card
                  key={category.name}
                  className="flex flex-col items-center p-4 transition-all hover:shadow-lg"
                >
                  <Link href={category.href ?? "#"}>
                    <div className={`p-2 rounded-full ${category.color}`}>
                      {category.icon}
                    </div>
                    <h3 className="mt-4 text-xl font-semibold">
                      {category.name}
                    </h3>
                  </Link>
                </Card>
              ))}
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-8">
              Featured APIs
            </h2>
            <Tabs defaultValue="all" className="w-full">
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                {apiCategories.map((category) => (
                  <TabsTrigger key={category.name} value={category.name}>
                    {category.name}
                  </TabsTrigger>
                ))}
              </TabsList>
              <TabsContent value="all">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                  {filteredApis.map((api) => (
                    <Card key={api.name}>
                      <CardHeader>
                        <CardTitle>{api.name}</CardTitle>
                        <CardDescription>{api.category}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p>{api.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              {apiCategories.map((category) => (
                <TabsContent key={category.name} value={category.name}>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                    {filteredApis
                      .filter((api) => api.category === category.name)
                      .map((api) => (
                        <Card key={api.name}>
                          <CardHeader>
                            <CardTitle>{api.name}</CardTitle>
                            <CardDescription>{api.category}</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <p>{api.description}</p>
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          © 2023 API Browser. All rights reserved.
        </p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  );
}
