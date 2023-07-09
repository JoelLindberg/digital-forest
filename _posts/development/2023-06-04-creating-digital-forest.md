---
layout: post
title: Creating Digital Forest
subtitle: Growing a website in the lab
date: 2023-06-04 10:00:00 +0200
thumbnail-img: /assets/img/2023-06-04/creating-digital-forest-thumb.png
tags: [jekyll, html, javascript, css, markdown, design]
category: development
published: true
---

This site is primarily created using [Jekyll](https://jekyllrb.com/) (a static site generator). Jekyll is a tool developed in [Ruby](https://www.ruby-lang.org/en/), but no Ruby programming is required as long as you are satisified with the wide range of features already included. It is a mature and reliable tool with plenty of people adopting it for their projects.

I personally selected it due to it's wide adoption and the mentioning of it at [Jamstack](https://jamstack.org/) as one of the [top static site generators](https://jamstack.org/generators/).

The following article is written primarily for myself, but I'd be happy if anyone else also also found some of this information useful.

<br />

## Responsive layout

Mobile first is something you generally hear nowadays when talking about responsive websites or webapps. I decided to go for this approach as well as it's a a large amount of people browse the web using their mobile, plus it makes more sense from an optimization point of view.

Since this is a learning project, but also a tool to serve me, I made the decision early on to create the responsiveness using standard CSS and not a library that abstracts those parts.

I used the built-in developer tools in Firefox and Chrome to identify good thresholds to adapt the site to smaller devices. Since I focused on mobile first, everything on the top in the CSS are styles that apply to mobile devices and general styles that apply for all devices. In the bottom I put the `@media` CSS at-rules that scales the page for larger devices.

Regarding the `@media` CSS at-rules, I struggled a long time with getting things right with this, which is strange because it looks really simple. The solution turned out to be that you need to specify a few things in the `<head>` element:

~~~html
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
~~~

Regarding grid and flexbox, I decided to go for grid and then nest any flexbox as required inside of my grids.

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

### Syntax highlighting

I decided to use [highlight.js](https://highlightjs.org) instead of the built-in Rouge because of higher flexibility since I don't know Ruby but do know Javascript.

Highlight.js works flawlessly as Jekyll generates the same html tags as highlight.js uses.

The following markdown:

```html
~~~html
<link rel="stylesheet" type="text/css" href="{{ site.baseurl }}/assets/css/styles.css?1">
<script src="{{ site.baseurl }}/assets/js/nav-button-toggle.js?1"></script>
~~~
```

Generates the following html block:

~~~html
<pre>
    <code class="language-html hljs language-xml">

        the above html code in the markdown code block is generated here with more tags for specific parts to be highlighted ...
        
    </code>
</pre>
~~~

Highlight.js uses the above tags and the same generated tags inside of `<code>` to apply the highlights. We can also use these tags to apply any custom css later.

<br />

**How I set things up in 3 steps:**

1. Load the script and a theme of choice in the `<head>` element (**head.html**):

    ~~~html
    <head>
        <!-- highlighter -->
        <link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/highlight.js/11.7.0/styles/atom-one-dark.min.css">
        <script src="//cdnjs.cloudflare.com/ajax/libs/highlight.js/11.7.0/highlight.min.js"></script>
    </head>
    ~~~

2. Initialize the script in the `<body>` element at the bottom of all content generated (**footer-script.html** in my case):

    ~~~html
    <body>
        <script>hljs.highlightAll();</script>
    </body>
    ~~~

3. Add custom css styling:

    ~~~css
    /* Highlighting */

    code {
        background-color: #d4d4d4;
        border-radius: 3px;
    }

    .hljs {
        border-radius: 10px;
    }
    ~~~

<br />

### Escape opening curly braces in Liquid

It's not possible to escape the opening curly braces, but instead you can generate a pair of curly braces as a string: `{{ '{{' }} '{{'{{'}}' }}`

Source: https://joshtronic.com/2020/05/24/how-to-escape-curly-brackets-in-liquid-templates/

<br />

## Navigation

The page was designed to be mobile first, so the first thing I did was to lookup navigation bars that follow the convention of mobile navigation. My approach was the same as with the responsiveness, to develop the navigation from scratch without abstraction.

I implemented my navigation layout at the top part (above @media CSS at-rules) since the mobile version is prioritized.

1. Hide and display the navigation bar depending on if we are navigating the page using a mobile device or a desktop device:

    At the top part of the css for the mobile version we display the mobile menu:

    ~~~css
    /* display the mobile nav */
    #nav-button-toggle {
        display: flex;
    }

    /* hide the ipad/desktop nav */
    .menu-items {
        display: none;
    }
    ~~~

    In each @media CSS at-rule where we don't want to display the mobile navigation we hide it:

    ~~~css
    #nav-button-toggle {
        display: none;
    }
    ~~~

2. When the mobile navigation bar is displayed we need to hide or display the menu items when clicking the menu button:

    This is the javascript logic I used to toggle the menu items when clicking the menu button:

    ~~~javascript
    function myFunction() {
        var x = document.getElementById("nav-button-links");
        if (x.style.display === "block") {
        x.style.display = "none";
        } else {
        x.style.display = "block";
        }
    }
    ~~~

    The mobile menu items are hidden by default:

    ~~~css
    #nav-button-links {
        display: none;
    }
    ~~~

I referenced this w3schools tutorial for creating the mobile navbar: https://www.w3schools.com/howto/howto_js_mobile_navbar.asp

<br />

## CSS and Javascript caching

I ran into issues with CSS being cached during development and after my second deployment to Github Pages. After some google it turns out there is a neat trick to avoid this, especially when publishing and you want to make sure that anyone that visists your page will get the latest CSS and Javascript files.

Append `?<number>` to your CSS and Javascript links. This seems to not have any impact other than tricking your browser to think it's a new resource being loaded since the URL is changed when you increment the number (you could just write anything as long as it is changed since last time as far as I know).


~~~html
<link rel="stylesheet" type="text/css" href="{{ site.baseurl }}/assets/css/styles.css?1">
<script src="{{ site.baseurl }}/assets/js/nav-button-toggle.js?1"></script>
~~~

## Search engine optimization - tags and categories

After some light reading it seems that tags and categories can be of help for search engine optimization. This is very low in my priority list, however categories seems to be a nice feature as it can help page navigation in the future when more articles has been added.



Sources:

* https://jekyllrb.com/docs/posts/#tags-and-categories