import {
  createRootRoute,
  createRoute,
  lazyRouteComponent,
  Link,
  Outlet,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { AuthButton } from "@/components/AuthButton";

const rootRoute = createRootRoute({
  component: () => {
    return (
      <>
        <div className="p-2 flex gap-2 items-center">
          <Link to="/" className="[&.active]:font-bold">
            Home
          </Link>{" "}
          <Link to="/" className="[&.active]:font-bold">
            About
          </Link>
          <div className="ml-auto">
            <AuthButton />
          </div>
        </div>
        <hr />
        <Outlet />
        <TanStackRouterDevtools />
      </>
    );
  },
});

const googleCallbackRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/auth/google/callback",
  component: lazyRouteComponent(() => import("@/components/GoogleCallback")),
});

export const Route = rootRoute.addChildren([googleCallbackRoute]);
