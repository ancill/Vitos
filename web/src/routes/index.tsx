import { createFileRoute } from "@tanstack/react-router";
import { Button } from "../components/ui/button";
import { useState } from "react";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const [message, setMessage] = useState("");

  const fetchHello = async () => {
    const response = await fetch("/api/hello");
    const data = await response.json();
    setMessage(data.message);
  };

  return (
    <div>
      <h2 className="text-xl mb-4">Welcome to VITOS</h2>
      <Button onClick={fetchHello}>Fetch Hello</Button>
      {message && <p className="mt-4">{message}</p>}
    </div>
  );
}
