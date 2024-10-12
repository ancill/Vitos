import { createFileRoute } from "@tanstack/react-router";
import { Button } from "../components/ui/button";
import { client } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const { data, refetch } = useQuery({
    queryKey: ["hello"],
    queryFn: () => client.api.hello.$get().then((response) => response.text()),
    enabled: false,
  });

  return (
    <div>
      <h2 className="text-xl mb-4">Welcome to VITOS</h2>
      <Button onClick={() => refetch()}>Fetch Hello</Button>
      {data && <p className="mt-4">{data}</p>}
    </div>
  );
}
