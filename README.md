### Architecture
The website is following the basic principles of a [static website](https://en.wikipedia.org/wiki/Static_web_page).

On top of that, it's build with using freemium services as much as possible, to reduce the operational costs.

#### Costs
- domain name ([gandi.net](https://www.gandi.net/) - one of the best registars globally)
- Shopify

#### A note on performance, security, stability
Because the website is hosted by Github pages, this comes with some "invisible" benefits that are free and zero-maintenance:
- DNS failover
- SSL certificate (https)
- global CDN
- proper browser caching
- near-instant redeployments with Jekyll builds, on every git push
- zero security concerns, since it's a static page
- Shopify offers a 99.99% uptime, and has never been a problem

### Stack
- Jekyll for HTML templating and SCSS compiling
  - Jekyll was introduced recently, and only specific parts of the website have been refactored to it.
  - The introduction/refactoring is seamless, since an existing file can be changed as-is
    to a Jekyll file just by adding these 2 lines at the top of the file (e.g. look at `en/stores.html`)
    ```
    ---
    ---
    ```
- slapform.com for the `contact us` page
- Shopify for the `eshop` page (using only the Javascript API)
- Hosted by Github Pages
  - Github will build the page with Jekyll automatically, on every push to master
- Forestry for offering editing of website resources to 3rd parties (with its own permission system)
  - This is currently used for the `_data` directory, for editing the store locations
  - In the future, this can be used for blog posts
  - Forestry also supports Jekyll, which means that they can render previews of the blog posts (if configured)

### Local Development
```shell
host$ ./docker/run.sh
container# jekyll build # or
container# jekyll serve
```

### Working with 2 repositories

_Note: This was implemented with an early version of Github Pages, maybe there's a better approach now_

The Nutree website exists in 2 repositories, for 2 domains:
- demo.nutree.gr (demo instance) - `git@github-demo.nutree.gr:demo-nutree-gr/demo-nutree-gr.github.io.git`
- nutree.gr (production/live instance) `git@github-live.nutree.gr:live-nutree-gr/live-nutree-gr.github.io.git`

#### CNAME
There is only 1 difference in the files of the two repositories, the `CNAME` file.
This is crucial, because it's where the domain name is configured for Github Pages.

The contents of this file, per repository:
- for `demo-nutree-gr`: `demo.nutree.gr`
- for `live-nutree-gr`: `nutree.gr`

#### Workflow
To avoid accidental mistakes, it's recommended to:
- work in 1 local clone for both repositories, by adding both as git `remotes`.
- always make changes on a branch that is pointing to the `demo` remote
- only merge/push changes to the `live` remote

Setup:
```
$ git remote -v
demo    git@github-demo.nutree.gr:demo-nutree-gr/demo-nutree-gr.github.io.git (fetch)
demo    git@github-demo.nutree.gr:demo-nutree-gr/demo-nutree-gr.github.io.git (push)
live    git@github-live.nutree.gr:live-nutree-gr/live-nutree-gr.github.io.git (fetch)
live    git@github-live.nutree.gr:live-nutree-gr/live-nutree-gr.github.io.git (push)

$ git branch -vv
  live-master          56cf476 [live/master] Merge branch 'master' into live-master
* master               2cb57fd [demo/master] update README with up to date information
```

Step 1: push changes to demo - preview changes in https://demo.nutree.gr/
```
$ git checkout master

# make changes

$ git commit -m 'commit message'

$ git push
```

Step 2: push changes to live - changes applied to https://nutree.gr/
```
$ git checkout live-master

# grab changes from demo:
$ git merge master

$ git push live HEAD:master
```

### Useful Links
- demo.nutree.gr -> https://github.com/demo-nutree-gr/demo-nutree-gr.github.io
- nutree.gr -> https://github.com/live-nutree-gr/live-nutree-gr.github.io
- https://shopify.github.io/liquid/
- https://jekyllrb.com/docs/configuration/options/
- https://forestry.io/docs/settings/collaborators/#site-access-levels
- https://forestry.io/docs/editing/front-matter/
