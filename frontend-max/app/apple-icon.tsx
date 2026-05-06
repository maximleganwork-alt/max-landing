import { renderBrandIcon } from "shared/lib/dynamic-icon";

export const runtime = "edge";
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return renderBrandIcon({ size: 180, gradFrom: "#5b8dff", gradTo: "#8b5cf6" });
}
