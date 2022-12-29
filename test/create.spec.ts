import fs from 'fs-extra'
import { dirname } from 'path'
import { fileURLToPath } from 'url'
import { describe, expect, it } from 'vitest'

import defineConfig from '../config'
import { fetchGitRepo } from '../src/core/create'

const __dirname = dirname(fileURLToPath(import.meta.url))

describe('create project', () => {
  it('repo available', async () => {
    const dir = `${__dirname}/../app2`
    const fetchRepo = () => {
      // eslint-disable-next-line no-async-promise-executor
      return new Promise(async (resolve, _) => {
        for (const repo of defineConfig.repo) {
          if (fs.existsSync(dir)) {
            fs.removeSync(dir)
          }
          await fetchGitRepo(repo, dir)
          fs.removeSync(dir)
        }

        resolve(true)
      })
    }

    await expect(fetchRepo()).resolves.toBe(true)
  })
})
