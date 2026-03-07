---
title: "Cudafying ray tracing in one weekend"
date: 2022-07-02T19:14:01-04:00
draft: true
summary: "My understanding from porting Raytracing to Cuda"
categories: [Graphics]
tags: [coding, graphics, GPU]
ShowToc: true
cover:
  image: "/images/rt_cuda/nv_cuda.png"
  alt: "Nvidia Logo"
  caption: "Nvidia logo"
  relative: true
---

CUDA is a library for using Nvidia GPU cores for parallelising code, but it’s multi purpose and is not tailored only towards graphics applications. Hence, the API is low level and memory needs to be managed responsibly by the developer themselves. This makes the code a pain to write and the performance obtained is not much improvement over the software multithreading option (although I admit that this code is not a good bench mark for checking performance between CUDA and CPU parallelism).

**Prerequisites for this post** : This post is for accelerating the raytracing in one weekend code using CUDA, which means you need to be familiar with the raytracer code used in "[raytracing in one weeekend](../rt_one_weekend/)".
I mostly followed the excellent guide on [Accelerating Raytracing using CUDA](https://developer.nvidia.com/blog/accelerated-ray-tracing-cuda/) presented in Nvidia's blog.

what Cuda is expert at is talking to the GPU and allocating resources that can be used either by GPU or GPU and CPU both. Hence, setting up a Common Frame Buffer is important.

 System Properties:
 1. Cuda 11.7
 2. Visual Studio 2022 community edition
 3. Device Query

Setup - Install the Cuda toolkit which comes with the Cuda library, debugger tools, optimization tools, Cuda c++ compiler and runtime library.
To make the C++ code compatible with cuda compiler, the C++ file where the cuda code is used must have extension `.cu`. During the setup for Cuda in Visual Studio, I encountered some problems, the solutions to which are listed below.
1. There should be a CUDA C/C++ tab in the project properties. If not then go to Build Dependencies by right clicking on the Project in the Solution View, and make sure the CUDA 11.7 (or whatever version of CUDA you have) box is selected True. Also make sure that you have set your runtime lib to `MT` in `Linker > Code Generation` tab in `Project Properties`.
2. When you build the code, the compiler may throw an error where VS cannot find CUDA 11.7rt. In that case, you need to find the device compatibility version by running the `Device Query` sample from the CUDA samples. In my case, my device is 5.0 compatible. Then, add "compute_50, sm_50" (50 because 5.0 in my case ) in `CUDA C/C++ > Device > Code Generation` tab in Project Properties.

After following the above steps, the setup was done and my code built without errors. Now, I followed through with the raytracing with CUDA guide by Nivdia, and made the following observations

1. Using `printf()` in the CUDA segment crashed my PC entirely. It did not just crashed the raytracing software, but just straight hung up my laptop (I had to forcefully shut it down). My guess is that since control was not handed to CPU by the GPU implicitly when `printf()` was called inside the GPU segment of the CUDA code. This made me be wary about experimenting with CUDA as some crashes could potentially be non-recoverable.
2. This observation is a followup on the previous that STL library cannot be used in CUDA code, which entails that STL smart pointers cannot be used which means you have to resort to passing objects via dumb pointers or even double pointers. Cuda provides dynamic memory allocation through `cudaMalloc()` and `cudaFree()` but this introduces a danger as it becomes the developer's responsibilty to manage freeing of resources. Having to deal with these make the code messy to deal with.

