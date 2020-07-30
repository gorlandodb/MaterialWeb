# How to play around with the MWC Playground

Simply edit `unbundled.html` or `index.js`, rollup should be watching for changes on `index.js`,
and it will compile the JS it into a single file called `index.bundled.js` which is hidden by
`.gitignore` and also perform a small transform to `unbundled.html` to `index.html` which simply
loads that `index.bundled.js` file.

**NOTE:** In order to make your changes to `unbundled.html` to appear in `index.html`, you must make
a change in `index.js`. This can simply be adding an
extra space, waiting, and then removing it.

This is because Glitch has a limit to the number of requests to non-[boosted](https://glitch.com/pricing)
applications. If your app is boosted, or you are downloading this locally, then you can simply
load and edit `unbundled.html` for bundler-free development ^.^

# Learn more

Learn more about Material Web Components [here](https://github.com/material-components/material-components-web-components/tree/master/)!