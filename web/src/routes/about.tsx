import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
  component: About,
});

function About() {
  return (
    <div>
      <h2 className="text-xl mb-4">About VITOS</h2>
      <p>
        VITOS is a powerful project template combining modern frontend and
        backend technologies.
      </p>
    </div>
  );
}
