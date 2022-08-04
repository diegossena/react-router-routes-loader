import React from 'react'

interface Route {
  Component: React.FC
  path: string
}

const react_router_routes: Route[] = require('./loader!../../pages')

export const routes = react_router_routes
  .map(({ Component, path }) => ({
    element: <Component />,
    path,
    exact: true
  }))
