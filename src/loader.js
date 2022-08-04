'use strict'
const fs = require('fs/promises')
const path = require('path')
const { stringifyRequest } = require('loader-utils')
// Types
/**
 * @typedef Route
 * @type {object}
 * @property {string} path
 * @property {string} component_path
 */
//
/**
 * @param {string} directory_path
 * @return {Promise<Route[]>}
 */
async function recursiveReadDirectory(directory_path, baseUrl = '') {
  const files_names = await fs.readdir(directory_path, { withFileTypes: true })
  return Promise.all(
    files_names.map(dirent => {
      const file_path = path.join(directory_path, dirent.name)
      const file_url = dirent.name
        .replace(/^\[[a-z0-9_-]+]/gi, replaceValue => (
          ':' + replaceValue.slice(1, -1)
        ))
      if (dirent.isFile() && dirent.name.endsWith(".tsx")) {
        const file_endPoint = file_url.replace(/(index)?(\.tsx)$/, '')
        return [{
          path: baseUrl
            + '/'
            + (file_endPoint === '_404' ? '*' : file_endPoint),
          component_path: file_path
        }]
      }
      return recursiveReadDirectory(file_path, `${baseUrl}/${file_url}`)
    })
  ).then(elements => elements.flatMap(element => element))
}

/**
 * @param {Route[]} routes
 */
function getAsModule(context, routes) {
  return 'module.exports=['
    + routes.map(route => (
      '{path:"' + route.path + '",'
      + 'Component:require('
      + stringifyRequest(context, route.component_path)
      + ').default}'
    )).join(",")
    + ']'
}

function loader() {
  const callback = this.async()

  const finalCallback = callback || this.callback
  /**
   * @type {string}
   */
  const basePath = this.context

  recursiveReadDirectory(basePath)
    .then(routes => {
      for (const route of routes)
        this.addDependency(route.component_path)
      finalCallback(null, getAsModule(this, routes))
    })
    .catch(error => callback(error))
}

exports.default = loader
