import { renderBrandIcon } from "shared/lib/dynamic-icon";

export const runtime = "edge";
export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return renderBrandIcon({ size: 32, gradFrom: "#34D399", gradTo: "#059669" });
}
