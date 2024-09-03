import { ChefHat, Utensils, Book, Users, Layers } from "lucide-react";

export default function KoksmatStudioProcess() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-amber-50 to-orange-100">
      <div className="container px-4 md:px-6 mx-auto">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-8 text-orange-800">
          Business Processes: A Culinary Adventure
        </h2>
        <div className="max-w-3xl mx-auto text-center mb-10 text-orange-900">
          <p className="text-xl">
            Imagine a business process as a recipe for making a meal. Just like
            in the kitchen, where you follow steps to create a delicious dish, a
            business process guides you through a series of actions to achieve
            your desired outcome.
          </p>
        </div>
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3 mt-12">
          <div className="flex flex-col items-center text-center p-6 bg-white rounded-lg shadow-lg">
            <ChefHat className="h-12 w-12 text-orange-500 mb-4" />
            <h3 className="text-xl font-bold mb-2 text-orange-800">
              Simple Recipes
            </h3>
            <p className="text-orange-700">
              Some processes are like simple recipes, with straightforward steps
              to follow.
            </p>
          </div>
          <div className="flex flex-col items-center text-center p-6 bg-white rounded-lg shadow-lg">
            <Book className="h-12 w-12 text-orange-500 mb-4" />
            <h3 className="text-xl font-bold mb-2 text-orange-800">
              Recipe of Recipes
            </h3>
            <p className="text-orange-700">
              Complex processes are like interconnected recipes, forming a
              comprehensive cookbook.
            </p>
          </div>
          <div className="flex flex-col items-center text-center p-6 bg-white rounded-lg shadow-lg">
            <Utensils className="h-12 w-12 text-orange-500 mb-4" />
            <h3 className="text-xl font-bold mb-2 text-orange-800">
              Tasty Outcomes
            </h3>
            <p className="text-orange-700">
              The dishes being prepared symbolize the outcomes or goals of these
              processes.
            </p>
          </div>
        </div>
        <div className="mt-16 bg-white p-8 rounded-lg shadow-xl">
          <h3 className="text-2xl font-bold mb-4 text-orange-800 text-center">
            Koksmat Studio: Your Master Chef&apos;s Kitchen
          </h3>
          <div className="flex flex-col md:flex-row items-center justify-center gap-8">
            <div className="flex-1 text-center md:text-left">
              <p className="text-lg text-orange-700 mb-4">
                At Koksmat Studio, our process definitions are anchored in these
                recipes, each representing a task or function within your
                organization.
              </p>
              <p className="text-lg text-orange-700">
                Whether you&apos;re crafting a single dish or orchestrating a
                banquet, Koksmat Studio helps you design and manage your
                business processes with the precision of a master chef.
              </p>
            </div>
            <div className="flex-1 flex justify-center">
              <div className="relative">
                <Layers className="h-24 w-24 text-orange-500" />
                <Users className="h-16 w-16 text-orange-400 absolute bottom-0 right-0" />
              </div>
            </div>
          </div>
        </div>
        <div className="text-center mt-12">
          <button className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-full text-lg transition duration-300 ease-in-out transform hover:scale-105">
            Let&apos;s Get Cooking!
          </button>
        </div>
      </div>
    </section>
  );
}
