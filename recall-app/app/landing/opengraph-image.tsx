// /landing defines its own `metadata.openGraph` (see page.tsx), which stops
// Next from inheriting the root's generated image for this route — so it's
// colocated here explicitly instead of relying on inheritance. Same design,
// same file — see the root app/opengraph-image.tsx.
export { default, alt, size, contentType } from "../opengraph-image";
export const runtime = "edge";
