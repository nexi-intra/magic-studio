import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  Code,
  BarChart,
  Users,
  LineChart,
  TestTube2,
  Paintbrush,
} from "lucide-react";

const roles = [
  {
    title: "Auditor",
    description: "Review and assess financial records and processes",
    icon: CheckCircle2,
    color: "from-blue-500 to-blue-600",
    pattern: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23fff' fill-opacity='0.1' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E")`,
  },
  {
    title: "Developer",
    description: "Design, code, and maintain software applications",
    icon: Code,
    color: "from-green-500 to-green-600",
    pattern: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h20L0 20z' fill='%23fff' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
  },
  {
    title: "Business Analyst",
    description: "Analyze business processes and recommend improvements",
    icon: BarChart,
    color: "from-purple-500 to-purple-600",
    pattern: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23fff' fill-opacity='0.1' fill-rule='evenodd'%3E%3Cpath d='M0 0h20v20H0V0zm10 17L0 7v10h10zM10 3L0 13V3h10z'/%3E%3C/g%3E%3C/svg%3E")`,
  },
  {
    title: "End User",
    description: "Utilize software applications in day-to-day operations",
    icon: Users,
    color: "from-yellow-500 to-yellow-600",
    pattern: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M10 0v20L0 10h20L10 0z' fill='%23fff' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
  },
  {
    title: "CXO",
    description: "Executive-level decision making and strategy",
    icon: LineChart,
    color: "from-red-500 to-red-600",
    pattern: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23fff' fill-opacity='0.1' fill-rule='evenodd'%3E%3Cpath d='M0 0h20L0 20z'/%3E%3Cpath d='M20 0v20H0z'/%3E%3C/g%3E%3C/svg%3E")`,
  },
  {
    title: "Tester",
    description: "Ensure software quality through rigorous testing",
    icon: TestTube2,
    color: "from-indigo-500 to-indigo-600",
    pattern: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h20L0 20z' fill='%23fff' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
  },
  {
    title: "Designer",
    description: "Create user-friendly and visually appealing interfaces",
    icon: Paintbrush,
    color: "from-pink-500 to-pink-600",
    pattern: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23fff' fill-opacity='0.1' fill-rule='evenodd'%3E%3Cpath d='M10 0v20L0 10h20L10 0z'/%3E%3C/g%3E%3C/svg%3E")`,
  },
];

export default function Component() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Select Your Role</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {roles.map((role, index) => (
          <Card
            key={index}
            className="overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className={`h-32 bg-gradient-to-br ${role.color} relative`}>
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: role.pattern,
                  opacity: 0.2,
                }}
              />
              <role.icon className="w-16 h-16 text-white absolute bottom-2 right-2 opacity-50" />
            </div>
            <CardHeader>
              <CardTitle className="text-xl">{role.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>{role.description}</CardDescription>
              <Button className="w-full mt-4">Select Role</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
