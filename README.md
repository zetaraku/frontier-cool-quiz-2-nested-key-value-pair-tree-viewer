# Nested Key-Value Pair Tree Viewer

## How to run this project

### Install Dependencies

Run `npm install` to install the dependencies.

### Starting Dev Server

Run `npm run dev` to start the dev server.

### Building App

Run `npm run build` to build the app.

By default, the build output will be placed at `dist`.
You can deploy this `dist` folder to any of your preferred platforms.

### Testing App Locally

After the app is built, you can test it locally by running `npm run preview`.

The `vite preview` command will boot up a local static web server that serves the files from `dist` at `http://localhost:4173`.

## Problem and Challenges

### Primitive leaves

Consider this input:

- `common.feature.experience` = `Try It Now!`
- `common.feature.chooseFabric` = `Choose Fabric`

Now, if another `common.feature` is added afterward, it would replace all `common.feature.*` entries added before, which is bad because some kv-pair just silently disappears.

On the other hand, if a `common.feature` is already added, subsequent `common.feature.*` would walk through a node that is not an object, throwing an error, which is even worse.

My solution is to treat the tree view as a real "tree" with a value stored on each node. Each leaf is now just a node with no children instead of a primitive value, so it's no problem to walk through it and create more nested children.

This solution solves both problems and keeps the code clean and easy to implement.

### Prototype Pollution

Having `__proto__` in a key would cause the write to the shared `Object.prototype` object instead and cause undesired behaviors.

I fixed this by using an object with no prototype so you can't accidentally write it.
