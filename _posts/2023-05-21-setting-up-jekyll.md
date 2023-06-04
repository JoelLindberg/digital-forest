---
layout: post
title: Setting up Jekyll
subtitle: A collection of commands to get going
date: 2023-05-21 20:45:00 +0200
thumbnail-img: /assets/img/jekyll-logo-icon.png
tags: [jekyll, setup, ruby, ubuntu]
---

A compact collection of commands and hints to get going with Jekyll (published on Github Pages), a static site generator built in Ruby. No Ruby programming experience required, you only need to manage the package manager parts.

This guide assumes you are on Ubuntu.

<br />

## Ruby and Jekyll

Install Ruby:
~~~bash
sudo apt install ruby-full
~~~

Initialize a Ruby package ([Gem](https://rubygems.org/)) - Generate a Gemfile:
~~~bash
bundle init
~~~

Open the `Gemfile` and insert:
~~~
gem "jekyll"
~~~

Now we need to prepare for installing the Jekyll gem.

In this step we set dependencies to a local path because otherwise we are required to sudo install the packages which is not a good practice. Set local path for dependencies to be installed, and then run install:
~~~bash
bundle config set --local path 'vendor/bundle'
bundle install
~~~

Start the development server:
~~~bash
bundle exec jekyll serve
~~~

You can now browse to `http://localhost:4000` to verify that everything is working.

You can also start the development server with the browser forced to auto reload:
~~~bash
bundle exec jekyll serve --livereload
~~~

<br />
<br />

### Jekyll initial configuration

Notes for minimal amount of configuration to get up and running on [Github Pages](https://pages.github.com/).

This configuration is important if you, like me, plan on deploying to a Github Page as a **project site** but don't want to publish it as the orginzation site for your account.

You need to add at least the base path in the configuration file as well as making sure that your links are referencing this value. This way the paths will be correct both in the local development environment and when published.

In this lab I created a repository named `jekyll-test`, which means the full project site url will be `https://joellindberg.github.io/jekyll-test`. When adding the below configuration it will inform your local development server to serve using the baseurl: `http://localhost/jekyll-test/`

Open `_config.yml` and add the following:
~~~
domain: joellindberg.github.io
url: https://joellindberg.github.io
baseurl: /jekyll-test
~~~

There are some files we can decide on already that we want to exclude to avoid them from being published:

Open `_config.yml` and add the following:
~~~
exclude:
  - Gemfile
  - Gemfile.lock
  - README.md
~~~

Start the local development server to verify that everything is working so far. Since we added a baseurl this must be appended.
~~~bash
bundle exec jekyll serve
~~~

Verify by opening this url in the browser: `http://localhost:4000/jekyll-test/`

<br />
<br />

## Deploy to Github Pages

1. Create a gitignore file if not already done as we don't want to push things to our repo such as locally installed dependencies.

    Open `.gitignore` and add:
    ~~~
    .bundle/
    .jekyll-cache
    .jekyll-metadata
    _site
    vendor/
    ~~~

2. Create a token in your repository: Settings -> [Tokens](https://github.com/settings/tokens)

    I used the new (beta) function Fine-grained tokens -> Select `Only select repositories` and then select `jekyll-test`.
    
    Add the Repository permissions: <br />
    Actions: `Read and Write` <br />
    Contents: `Read and Write`

3. Setup Github Actions Workflow to publish all files in the `_site` directory (created when running jekyll build).

    Create: `.github`/`workflows`/`build-website.yml`
    ~~~
    name: Build and publish

    on:
      workflow_dispatch:
      push:
        branches: [ main ]

    # Make sure jobs cannot overlap (e.g. one from push and one from schedule).
    concurrency:
      group: published-ci
      cancel-in-progress: true

    jobs:
      build:
        name: Build and deploy to the published branch
        runs-on: ubuntu-latest

        steps:
        - uses: actions/checkout@v3
          with:
            ref: 'main'

        # Configure the build environment.

        - name: Install Ruby 3.1
          uses: ruby/setup-ruby@v1
          with:
            ruby-version: '3.1'
            # Runs 'bundle install' and caches installed gems automatically
            bundler-cache: true

        # Build the website.

        - name: Build the static website
          run: bundle exec jekyll build

        # Publish the build results

        - name: Deploy to the published branch 🚀
          uses: JamesIves/github-pages-deploy-action@v4
          with:
            branch: published
            folder: _site
            # Configure the commit author.
            git-config-name: 'Joel Lindberg'
            git-config-email: '<>'
            token: ${{ '{{' }} secrets.JEKYLL_BUILD }}
            # Remove outdated files from the target directory.
            clean: true
    ~~~

<br />
<br />
