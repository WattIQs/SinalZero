import { createRootRoute, HeadContent, Outlet, Scripts } from "@tanstack/react-router";
import "../styles.css";

export const Route = createRootRoute({
  head: () => ({ meta: [{ title: "SinalZero — Caça de Leads" }, { name: "description", content: "Encontre, filtre e qualifique negócios para prospecção." }] }),
  component: () => <><HeadContent /><Outlet /><Scripts /></>,
});
