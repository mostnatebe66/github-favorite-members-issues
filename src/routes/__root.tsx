import { Outlet, createRootRouteWithContext } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { RelayEnvironmentProvider } from "react-relay";
import relayEnvironment from "../utils/relay/environment";

export const Route = createRootRouteWithContext<{
	relayEnvironment: typeof relayEnvironment;
}>()({
	component: () => (
		<RelayEnvironmentProvider environment={relayEnvironment}>
			<Outlet />
			<TanStackRouterDevtools />
		</RelayEnvironmentProvider>
	),
});
