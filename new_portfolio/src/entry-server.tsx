import { renderToString } from "react-dom/server";
import { App } from "./App";
export { pageInfo } from "./content";
export function render(path: string) {
  return renderToString(<App initialPath={path} />);
}
