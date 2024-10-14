import { GoogleCallback } from "@/components/GoogleCallback";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/auth")({
  component: () => <GoogleCallback />,
});
