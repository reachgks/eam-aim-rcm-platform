FROM timescale/timescaledb:latest-pg16

# Install additional extensions
RUN apk add --no-cache postgresql16-contrib

# Copy initialization scripts
COPY init.sql /docker-entrypoint-initdb.d/01-init.sql

EXPOSE 5432
