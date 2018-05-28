#!/usr/bin/env node

function fatalErrorHandler (err) {
  console.log('Error: ' + err.stderr)
  process.exit(1)
}

(async function () {
  const util = require('util')
  const exec = util.promisify(require('child_process').exec)

  const {stdout: local} = await exec('git rev-parse @').catch(fatalErrorHandler)
  const {stdout: remote} = await exec('git rev-parse @{u}').catch(fatalErrorHandler)
  const {stdout: base} = await exec('git merge-base @ @{u}').catch(fatalErrorHandler)

  let exitCode = 0

  if (local === remote) {
    console.log('Up to date')
  } else if (local === base) {
    console.log('Need to pull')
    exitCode = 1
  } else if (remote === base) {
    console.log('Need to push')
    exitCode = 1
  } else {
    console.log('Diverged')
    exitCode = 1
  }

  const {stdout: gitStatus} = await exec('git status --porcelain').catch(fatalErrorHandler)

  if (gitStatus === '') {
    console.log('Nothing to commit')
  } else {
    console.log('Unstaged/uncommited changes')
    exitCode = 1
  }

  process.exit(exitCode)
})()