FROM oven/bun:1 AS base

WORKDIR /opt/remote-wol/app

COPY . .

RUN bun install --production
RUN bun run build


FROM base AS production

WORKDIR /opt/remote-wol/

COPY --from=base /opt/remote-wol/app/.output ./app

VOLUME [ "/opt/remote-wol/data" ]
VOLUME [ "/opt/remote-wol/config" ]
VOLUME [ "/opt/remote-wol/logs" ]

EXPOSE 18232/tcp

CMD [ "bun", "run", "./app/server/index.mjs" ]
