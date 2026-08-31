import { Route as rootRoute } from "./routes/__root";
import { Route as indexRoute } from "./routes/index";
import { Route as authRoute } from "./routes/auth";

export const routeTree = rootRoute.addChildren([indexRoute, authRoute]);
