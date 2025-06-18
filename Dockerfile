# ---------- Base Stage ----------
FROM node:22-alpine AS base

WORKDIR /app

ARG ALGOLIA_APP_ID
ARG ALGOLIA_API_KEY
ARG ALGOLIA_INDEX_NAME

ENV ALGOLIA_APP_ID=$ALGOLIA_APP_ID
ENV ALGOLIA_API_KEY=$ALGOLIA_API_KEY
ENV ALGOLIA_INDEX_NAME=$ALGOLIA_INDEX_NAME

RUN corepack enable && corepack prepare yarn@4.5.1 --activate

# Copy only necessary files
COPY .yarnrc.yml package.json yarn.lock ./

# Install dependencies
RUN yarn install --immutable

# Copy the rest of the source
COPY . .

# Build the static site
RUN yarn build

# ---------- Production Stage ----------
FROM nginx:alpine AS prod

RUN rm -rf /usr/share/nginx/html/*

COPY --from=base /app/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
