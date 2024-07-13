import React from "react";

export default function page(props: { params: { workspaceid: string } }) {
  const { workspaceid } = props.params;
  return <div>workspace {workspaceid} - Kitchens</div>;
}
