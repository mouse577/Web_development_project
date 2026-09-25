# Getting Started with the Frontend Repository

## Prerequisite Installations

### Git

The project obviously uses Git, but to be a bit more specific, it would likely be easiest to have a local installation of Git on your machine that is authenticated with your GitHub account so that you can clone the repository and then spin up the local development server on localhost (explained below).

### Node.js

Node.js is a runtime environment for executing JavaScript outside of a web browser. When you install it, it comes with various tools such as `npm` (Node Package Manager). Here is the [download page](https://nodejs.org/en/download) for Node.js. In terms of the version, any v22 should be fine and is likely already selected if you don't change anything. v23 or something lower than v22 might also be fine, but I'm currently on v22. 

While not a strict requirement, I recommend installing Node.js via a version manager. I'm on Mac and use [nvm](https://github.com/nvm-sh/nvm) (Node Version Manager). The best Windows equivalent might be [fnm](https://github.com/Schniz/fnm) (Fast Node Manager) or [nvm-windows](https://github.com/coreybutler/nvm-windows). There are various other installation methods listed on the Node.js download page. 

### TypeScript & React *are not prerequisite installations*

You do not need a global installation of TypeScript or React. The project uses specific versions which are stored in your `node_modules` subdirectory after you run `npm install` (explained below).

## Getting Into the Project Itself

### Setting up

```sh
git clone <whatever you normally put here, depends on how you authenticate with GitHub>
cd productivity-frontend
npm install 
```

`npm install` creates a `node_modules` subdirectory that stores your local copies of all the dependencies. This subdirectory is large and `.gitignore`d. You can think of it kind of like a venv in Python, but you don’t use the `source` command to access it. Instead, npm accesses it when you run `npm <some command>`.

### Running

```sh
npm run dev
```

`npm run dev` is one of the scripts defined in `package.json`. It spins up the development server on your local machine using Vite. The default port is 5173. It should display something like `http://localhost:5173/` in the terminal. When you go to that URL in a browser, you should be able to see the default page rendered. Like anything else in the terminal, use control C to stop this process, after which the page should be gone if you refresh it in your browser.
