/* eslint-disable no-new-func */
import fs from 'fs'
import path from 'path'
import {ClientFunction, Selector} from 'testcafe'
import {queries} from 'dom-testing-library'

const LIBRARY_UMD_PATH = path.join(
  './node_modules',
  'dom-testing-library/dist/dom-testing-library.umd.js',
)
const LIBRARY_UMD_CONTENT = fs.readFileSync(LIBRARY_UMD_PATH).toString()

export const addTestcafeTestingLibrary = async t => {
  // eslint-disable-next-line
  const inject = ClientFunction(() => window.eval(script), {
    dependencies: {script: LIBRARY_UMD_CONTENT},
  })

  await inject.with({boundTestRun: t})()
}

Object.keys(queries).forEach(queryName => {
  module.exports[queryName] = Selector(
    new Function(
      `
      return DomTestingLibrary.${queryName}(document.body, ...arguments);
      `,
    ),
  )
})

export const within = sel => {
  const s = {}

  Object.keys(queries).forEach(queryName => {
    s[queryName] = Selector(
      new Function(
        `return DomTestingLibrary.within(document.querySelector("${sel}")).${queryName}(...arguments)`,
      ),
    )
  })

  return s
}
