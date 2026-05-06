import { renderBrandIcon } from "shared/lib/dynamic-icon";

export const runtime = "edge";

export function GET() {
  return renderBrandIcon({ size: 192, gradFrom: "#5b8dff", gradTo: "#8b5cf6" });
}
