# react-router-routes-loader

A loader for generating route config array for use with [React Router DOM]([https://github.com/ReactTraining/react-router](https://github.com/remix-run/react-router)) and [Webpack](https://github.com/webpack/webpack)

Inspired in [react-router-routes-loader](https://github.com/jonstuebe/react-router-routes-loader) by [jonstuebe](https://github.com/jonstuebe)

## Purpose

The purpose of this loader is to give you a similar experience to [Next.js](https://nextjs.org/) of file-based routing. However, instead of having to use a completely different router like Next.js, you can use [React Router](https://github.com/ReactTraining/react-router).

## Usage

This assumes you have a Webpack project with React Router set up.

1. Install:

   download and copy to `utils/router` and config require('./loader!path-to-pages')

2. In your main `index.tsx` file (or something similar) add import to `utils/router` in order to retrieve the routing information that you will want to pass to `react-router-dom`:

   ```typescript
   import React from 'react'
   import { createRoot } from 'react-dom/client'
   import {
     BrowserRouter,
     Routes,
     Route
   } from 'react-router-dom'
   import { routes } from 'utils/router'

   import App from './App'

   const rootElement = document.getElementById('root')
   const root = createRoot(rootElement)

   console.log({ routes })

   root.render(
     <React.StrictMode>
       <BrowserRouter>
         <Routes>
           <Route path="/" element={<App />}>
             {routes.map((route, i) => (
               <Route key={i} {...route} />
             ))}
           </Route>
         </Routes>
       </BrowserRouter>
     </React.StrictMode>
   )
   ```

## Folder Structure

Here is a basic React project. All of the project code lives in `src` with a top level `index.tsx` and `App.tsx`. For this example, `App.tsx` is the file that will contain our reference to `react-router-routes-loader`. Let's say also we passed `react-router-routes-loader!./pages`:

```
└── src
    ├── App.tsx
    ├── utils
    │   └── routes
    │       ├── index.tsx
    │       └── loader.js
    ├── index.tsx
    └── pages
        ├── users
        |   ├── index.tsx
        │   └── [user_id].tsx
        ├── about.tsx
        └── index.tsx
```

- `http://app.dev/` -> `./src/pages/index.tsx`
- `http://app.dev/about` -> `./src/pages/about.tsx`
- `http://app.dev/users` -> `./src/pages/users/index.tsx`
- `http://app.dev/users/1` -> `./src/pages/users/[user_id].tsx`

## License

MIT
