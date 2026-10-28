# syntax=docker/dockerfile:1
FROM oven/bun:1.4.4-alpine AS builder
WORKDIR /app
COPY --link package.json bun.lock ./
RUN --mount=type=cache,id=bun,target=/root/.bun/install/cache \
    bun install --frozen-lockfile
COPY --link . .
RUN --mount=type=cache,id=vite,target=/app/node_modules/.vite \
    bun run build

FROM alpine:3.24.2 AS compress
WORKDIR /app
RUN apk add --no-cache brotli zstd
COPY --link --from=builder /app/dist /app/dist
RUN find /app/dist -type f \( -name '*.html' -o -name '*.css' -o -name '*.js' -o -name '*.mjs' -o -name '*.json' -o -name '*.svg' -o -name '*.xml' -o -name '*.txt' -o -name '*.ico' -o -name '*.map' \) \
    -exec brotli -q 11 -k {} \; \
    -exec gzip -9 -k {} \; \
    -exec zstd --ultra -22 -k {} \;

FROM gcr.io/distroless/static-debian13:nonroot
COPY --link --from=ghcr.io/static-web-server/static-web-server:2.44.1 /static-web-server /usr/local/bin/static-web-server
COPY --link --from=compress /app/dist /public
COPY --link config.toml /etc/sws/config.toml
EXPOSE 8080
CMD ["/usr/local/bin/static-web-server", "--config-file", "/etc/sws/config.toml"]
