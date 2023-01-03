export interface GithubConfig {
  username?: string
  repo?: string[]
  eslint?:string[]
  prettier?:string[]
}



export const defineConfig = (config: GithubConfig): GithubConfig => config
