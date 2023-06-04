---
layout: post
title: Creating Pixel Forest
subtitle: Growing a website in the lab
date: 2023-06-04 10:00:00 +0200
thumbnail-img: /assets/img/2023-05-27/creating-pixel-forest-thumb.png
tags: [jekyll, html, javascript, css, markdown, design]
---

This site is primarily created using [Jekyll](https://jekyllrb.com/) (a static site generator). Jekyll is a tool developed in [Ruby](https://www.ruby-lang.org/en/), but no Ruby programming is required as long as you are satisified with the wide range of features already included. It is a mature and reliable tool with plenty of people adopting it for their projects.

I personally selected it due to it's wide adoption and the mentioning of it at [Jamstack](https://jamstack.org/) as one of the [top static site generators](https://jamstack.org/generators/).

<br />

## Responsive layout

Mobile first is something you generally hear nowadays when talking about responsive websites or webapps. Since this is a learning project, while also a tool to serve me, I made the decision early on to create the responsiveness using CSS and not a library that abstracts those parts away. I would most likely pick Bootstrap or Tailwind for any professional project to speed things up and get higher reliability (considering how incompatible some features are across different browsers).

I used the built-in developer tools in Firefox and Chrome to identify good thresholds to adapt the site to smaller devices.

Also referenced:
* https://getbootstrap.com/docs/4.1/layout/overview/

<br />

## Date and time - strftime

In Jekyll we can set a timestamp in the frontmatter (below). We want to be able to use this date for our paginator (on the Blog front page) when displaying our posts.

~~~
---
title: date: 2023-06-04 10:00:00 +0200
---
~~~

To accomplish this, we will fetch `page.date` to get the date from the frontmatter, and then we will call `date` which outputs the date in a format that seems to be similar (or identical?) to Ruby's strftime.

~~~ruby
{{ '{{' }} page.date | date: "%-d %B %Y" }}
~~~

I did not dig any deeper into this, but it seems to work fine to reference Ruby's official documentation for formatting: [https://ruby-doc.org/3.2.2/strftime_formatting_rdoc.html](https://ruby-doc.org/3.2.2/strftime_formatting_rdoc.html)

It looks like it could be Liquid (the template engine that Jekyll is using) that implements Ruby's strftime. I stumbled upon this Stackoverflow article which led me in the above direction: [https://stackoverflow.com/questions/7395520/how-does-jekyll-date-formatting-work](https://stackoverflow.com/questions/7395520/how-does-jekyll-date-formatting-work)

<br />

## Styling

### Synax highlighting

I decided to use [highlight.js](https://highlightjs.org) instead of the built-in Rouge because of higher flexibility since I don't know Ruby but do know Javascript.

### Escape opening curly braces in Liquid

It's not possible to escape the opening curly braces, but instead you can generate a pair of curly braces as a string: `{{ '{{' }} '{{'{{'}}' }}`

Source: https://joshtronic.com/2020/05/24/how-to-escape-curly-brackets-in-liquid-templates/