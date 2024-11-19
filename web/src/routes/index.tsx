import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <div>
      <h2 className="text-xl mb-4">Welcome to VITOS</h2>
    </div>
  );
}
