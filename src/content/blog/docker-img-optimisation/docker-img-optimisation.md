---
title: "How I managed to reduce my Docker image size by 81%"
date: 2024-12-27T19:14:01-04:00
draft: false
summary: "Optimising Docker Image size for a nodejs web server application"
tags: [optimization, docker, nodejs]
ShowToc: true
cover:
  image: ""
  alt: ""
  caption: ""
  relative: true
---

## Current Docker Image stats

You can find the stats of a docker container if you run

```
$ docker stats <container-id>
```

Alternatively, you can find the image size of a docker image by running

```
$ docker image ls
```

Another way to determine the (compressed) image size of your docker image is to check your image size on Dockerhub or in your AWS ECR repository.

Docker image size depends on the number of dependencies in the image and the amount of layers in the image.

Here is a Dockerfile sample of my Nodejs web server before optimisation:

```docker
FROM node:20.17.0
WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

COPY ./src/alt_schema/sandbox.prisma /app/src/alt_schema/sandbox.prisma

COPY . .

# create my prisma client
RUN npx prisma generate
RUN npx prisma migrate deploy

# check for DB connection and seed DB
RUN node waitForDB.js

ENTRYPOINT ["node server.js"]

EXPOSE 3000
```

This, highly unoptimised docker image, had the following stats:

```
Docker image size: 1.29GB
Docker image size on Dockerhub: 459MB
Docker image size on AWS ECR: 440MB
```

This was the initial image version of my node.js based web-application. The image size is a whopping 1.29GB ! On Dockerhub, the compressed image size is 459MB. For comparison, the compressed image size of nodejs-alpine on Docker hub is around 40MB.

## Why you should optimise docker image size

Sure, the Docker image for my application was quite large—but so was the application itself! I had been working on a project management tool, a web application with significant complexity due to the intricate relationships between its data models and the substantial size of its codebase. After thoroughly refining the application during local development, I decided it was time to deploy it on AWS Cloud services. However, in my excitement to get it up and running, I overlooked an important consideration: the size of the Docker image and how it could impact deployment performance and resource usage. I wanted to deploy it on a t2.micro instance.

A t2.micro instance has limitations of 1GB memory and 1vCPU. This raised several issues for me:

1. Memory Limitations
   1. A docker container spawned from this docker image reqested a limit of 7GiB memory which was ridiculous for a web server.
   2. Any additional services running on the instance (e.g., the Docker engine, OS processes) could exacerbate memory pressure.
2. CPU bursting
   1. If my image size is larger than the available memory size, most of the work done by my CPU would be swapping memory for disk space. This could lead to CPU throttling and degraded performance. It could also eat at my CPU credits which should be handling business logic more than bookkeeping.
3. Network Bandwith
   1. EC2 instance use EBS for disk space. More swapping meant more network usage for making space in memory for other tasks.

All this made me consider on how can I reduce the image size of my application.

## Optimising Docker images

There are multiple ways to reduce docker image size. I implemented 3 ways that quickly reduced more than 80% of the image sizes.

### Using a smaller variants of the base image.

The base image for my nodejs application was `node:20` , This image comes packed with package managers like apt and yarn, which was not necessary for my application, So, I opted for the alpine version of node. Using `node:20.17-alpine` version itself reduced the (compressed) image size to 124MB from 459MB. This image sits on disk (uncompressed) with size 358 MB, a **70%** decrease in image size from 1.2 GB.

### Reducing the number of layers during build.

Docker saves your image in layers. Each layer corresponds to a statement in the Dockerfile. Layers take up a lot of space within your docker image because Docker uses layers to cache its build stages. This is done to make the image building process faster, because the layers which are not changed are not built again.

This means it is necessary to minimize the number of layers in your Dockerfile during optimization. If you take a look at my Dockerfile, you will notice certain RUN commands that are required for the application to run. However, there is no need to keep them in the Dockerfile. These commands are not necessary for the build process, but are only required to run during runtme. So these commands go into their bash script which I called `entrypoint.sh` . This way I can reduce the number of layers.

```docker
--- removed
# creating my prisma client
RUN npx prisma generate
RUN npx prisma migrate deploy

#check for DB connection and seed DB
RUN node waitForDB.js

ENTRYPOINT ["node server.js"]

+++ added
ENTRYPOINT ["./entrypoint.sh"]
```

Similary, some files are not necessary to be in the docker images. These files are required by source control or for CI/CD pipelines. Static directories like `public/` can be omitted as well(you can serve static files through CDNs). These files can be automatically omitted by the `.dockerignore` file.

This way, you can specify docker to copy all files other than the ones mentioned in the `.dockerignore` file, thus reducing the number of layers for copying over necessary files.

### Using Multi-stage builds

Building your docker image in multiple stages is a very powerful tool in your arsenal to optimisation. Some dependencies that you require during the build process are not required for the end product. For a language like Go, the end artifact is a binary executable that doesn’t require compilers, libraries and other dependencies, so packing the go compiler, libraries is unecessary to the final image.

However, since our application is a Nodejs application, we need the node runtime to run the javascript files. However, we are free to exclude the node package manager (npm) or any other package manager as a matter of fact. We need npm only for filling up the `node_modules` directory with our required dependencies, and then we do not need npm anymore.

Hence, we run `npm install` in our first image → save the artifacts (in our case, it is the `node_modules` directory) →then create another fresh image without npm → copy over the artifacts → and create our final image without the build tools (npm, yarn).

Here is the revised code for our Dockerfile:

```docker
`#Stage 1: Build stage
FROM node:20.17.0-alpine AS builder
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

# Stage 2: Runtime Stage
FROM node:20.17.0-alpine

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY . .

RUN chmod +x ./entrypoint.sh

EXPOSE 3000

ENTRYPOINT ["./entrypoint.sh"]`
```

This reduces over uncompressed image size from 385 MB to 256 MB. On the dockerhub and ECR, the compressed image size goes down from 120MB to 85 MB, which boils down to around 30% decrease in image size.

## Conclusion

After applying three simple optimisations, we were able to reduce our compressed Docker image size from 460 MB to 85 MB, which is a staggering 81% decrease in image size.

The base node-alpine image size is 42.83 MB. Which means there is still room for more optimization. However, we managed to achieve 80% of our result (quite literally this time) with just 20% of effort. Pareto would be proud!
