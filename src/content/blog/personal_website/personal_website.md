---
title: "Turning my personal website dream into reality ft.Hugo"
date: 2024-08-28T19:29:20-05:00
draft: false
tags: [personal website, Hugo, Github-Actions, Github-Pages]
showToc: true
cover:
  image: "/images/personal_website/social.svg"
  caption: "My digital home"
  relative: true
---

### The Inception

Since I began programming, I had been wanting a website of my own. Surely it is one of those things that initially gets someone to pursue programming. Not me though. I wanted a website to showcase my art, and programming projects and have a
place to help grow my thoughts in. I wanted a very functional, yet lean website that didn't pull my focus away from my projects and life.

After much trial on different CMS like WordPress, Drupal and blogspot, I found them time-consuming to learn and start writing to. I had to create an account, choose and select my theming, tinker around till I could make it something that I sort of liked, and even then the UX was so messy, there were limited customizable options and etc. There was so much resistance I had to go through to write my blog that I eventually gave up.

## The Conception

Fast forward two years of coding and writing documentation for it (yes, I do document :P), I theorised that if I could somehow get to write about my thoughts and projects in a Markdown format and get that published as a website, then maybe I can re-start my dream of my own website. An that's when HUGO came into my life. It was perfect for my needs.

*I write in Markdown in VSCode -> Hugo takes it and builds an HTML website.*

![A vague idea of what I want.](/images/personal_website/wishlist.svg)

It also made me have total control on a style that I liked, pages I wanted to show and it was extremely fast to spin up and work in. No resistance. So I picked up a theme from the [HUGO theme collection](https://themes.gohugo.io/), set up my "blog-repo" and started writing into it. I did have to put my focus into learning how to tinker around in the theme to make it my own. Soon, I had a website that I felt 'home-made'.

However, I cannot expect people to come to my PC if they want to see my portfolio. Eventually you would want your website to be seen by other people, on their devices. That meant I had to consider hosting it somewhere. That somewhere was a no-brainer for me. I had learned from my Senior that Github can host code documentation from the repo itself, so I knew I could use that for hosting my personal website. Plus, it also gave me a free decent-sounding domain name, so another plus point. My only requirement now was to learn how to make Github look into my repo and host my website for me. This did not take much time to setup. Github has good documentation on how to setup github-pages for your repo.
My process now looked like this:

*Write blogpost->build using Hugo, This generates a static website in the `public/` directory->rename it do `docs/` cos Github only looked into either the root or `docs/` directory -> commit and push to Github repo, Github now hosts my website by looking into `docs/` folder -> "website is published"*

![A convoluted approach to Operations.](/images/personal_website/website_devops_1.svg)

## The Correction

Spinning up and setting it up was no problem, but I had no idea what was going on behind the scenes. And as an engineer, I had to know what was going on behind the scenes. This meant I had to learn DevOps( or just CI/CD, for now). And actually, I'm glad that I did this. Turns out my process of writing and publishing via Github had a completely, stupidly redundant step. I didn't need to "build" my site. I didn't need to go through the convoluted way on renaming my out folder. Github-Actions can take care of all that, if you let it to. I just had to setup a workflow that would constantly look for changes(commits) to my main branch, then build the `public/` directory for me, and deploy, only the generated out directory, to another branch `gh-pages`. This allowed it to publish my website from the '/' root directory iin `gh-pages` branch rather than go searching for a `docs/` directory. My mind was blown by the promise of technology. My entire process was now simplified:

*Write Blog -> Commit and Push to Github; Github builds, moves and deploys website -> "Website is published".*

![A much simpler workflow.](/images/personal_website/website_devops_2.svg)

## The Conclusion
Now I have my own hand-built website where I can put my thoughts down with a peace of mind knowing that if anything went wrong I could fix it myself. I guess it is kind of like building your own little wooden cottage and painting it. Now, I have a digital home and I'm proud of it.

![A cozy wooden cottage.](/images/personal_website/wooden_cottage.jpg)

Now I can relax. Whew! ... or that's what I wished for; but a small machine beside me beckoned me towards the dark side. "Host your website on me", it hissed. What choice did I have, a mere computer-science-fanatical mortal? I reached over and took the card-sized machine in my hand and started thinking about it. My next challenge was to host my website on my RaspberryPi.
