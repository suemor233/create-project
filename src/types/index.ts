export interface GithubConfig {
  username: string
  repo: string[]
}

export const defineConfig = (config: GithubConfig): GithubConfig => config
