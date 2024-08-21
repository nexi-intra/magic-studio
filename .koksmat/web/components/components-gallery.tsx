"use client";
import { useState, useEffect } from "react";
import RenderDynamicComponent from "./render-dynamic-component";

export default function ComponentsGallery() {
  const [components, setComponents] = useState([]);

  useEffect(() => {
    async function fetchComponents() {
      const response = await fetch("/api/components");
      const data = await response.json();
      setComponents(data);
    }
    fetchComponents();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Component Gallery</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* <RenderDynamicComponent componentName="workspace-toolbar" /> */}
        {components.map((component) => (
          <div key={component} className="border rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-2">{component}</h2>
            <div className="bg-gray-100 p-4 rounded">
              {/* <RenderDynamicComponent componentName={component} /> */}
              {/* <RenderComponent componentName={component} /> */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
