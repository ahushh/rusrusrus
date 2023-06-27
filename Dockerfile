FROM node:alpine
RUN apk add curl 
RUN curl -L https://unpkg.com/@pnpm/self-installer | node
RUN pnpm --version
WORKDIR /usr/app
COPY package.json package.json
RUN pnpm i
COPY . .
RUN pnpm run build
CMD pnpm run start:prod