import { createRoot, hydrateRoot } from "react-dom/client";
import { App } from "./App";
import "./styles.css";

const root = document.getElementById("root")!;
const app = <App initialPath={location.pathname} />;
if (root.querySelector("main")) hydrateRoot(root, app);
else createRoot(root).render(app);
