// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({
  // Hashes every script/style Astro emits into a <meta> Content-Security-Policy.
  // Headers that cannot live in a <meta> tag (HSTS, frame-ancestors...) are in public/_headers.
  security: {
    csp: {
      directives: [
        "default-src 'self'",
        "img-src 'self' data:",
        "font-src 'self'",
        "connect-src 'self'",
        "object-src 'none'",
        "base-uri 'self'",
        "form-action 'self'",
      ],
    },
  },
  build: { inlineStylesheets: 'never' },
  // Keep small font files as real files: inlined data: fonts would be blocked by font-src 'self'.
  vite: { build: { assetsInlineLimit: 0 } },
});
