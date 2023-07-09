---
layout: post
title: HAProxy for load balancing - Part 1
subtitle: Setup an Active/Standby HAProxy Cluster
date: 2023-06-04 10:00:00 +0200
thumbnail-img: /assets/img/2023-06-04/creating-digital-forest-thumb.png
tags: [jekyll, html, javascript, css, markdown, design]
category: systems-engineering
excerpt_separator: <!--more-->
published: false
---

I will be going through setting up a high availability load balancing solution using HAProxy. There are two parts to this:

* Create a cluster of HAProxy nodes
* Publish your web service to be load balanced in the cluster

<!--more-->

In step 1 we are making sure that we will be able to perform maintenance on the HAProxy cluster nodes without disrupting any backend services.

## Resources

HAProxy Active/Standby Clustering using their VRRP module:

* https://www.haproxy.com/documentation/hapee/latest/high-availability/active-standby/#debian-extras-vrrp

Docker image to try out things with a single HAProxy node:

* https://hub.docker.com/_/haproxy