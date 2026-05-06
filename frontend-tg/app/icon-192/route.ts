import { renderBrandIcon } from "shared/lib/dynamic-icon";

export const runtime = "edge";

export function GET() {
  return renderBrandIcon({ size: 192, gradFrom: "#2AABEE", gradTo: "#0088CC" });
}
