import React from "react";

export default function Layout(props: { children: any }) {
  const { children } = props;
  return (
    <div>
      Web Navigation
      {children}
    </div>
  );
}
