import { renderBrandIcon } from "shared/lib/dynamic-icon";

export const runtime = "edge";
export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return renderBrandIcon({ size: 32, gradFrom: "#5b8dff", gradTo: "#8b5cf6" });
}
