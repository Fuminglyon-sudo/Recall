// This route defines its own metadata.openGraph block (see page.tsx),
// which stops Next from inheriting the root's generated image — so it's
// colocated here explicitly. Same design, same file — see
// the root app/opengraph-image.tsx.
export { default, alt, size, contentType } from "../opengraph-image";
export const runtime = "edge";
