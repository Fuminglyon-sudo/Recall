// Twitter/X falls back to og:image tags if no twitter:image is set, but we
// declare this explicitly for clarity and to keep the file-convention meta
// tags fully populated. Same design, same file — see opengraph-image.tsx.
//
// `runtime` is route-segment config and must be a literal export in this
// file (Next statically parses it at build time) — it can't be re-exported
// through an import chain like the other four can.
export { default, alt, size, contentType } from "./opengraph-image";
export const runtime = "edge";
