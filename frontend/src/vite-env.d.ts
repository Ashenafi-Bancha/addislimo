/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Base URL of the Addis Limo API, e.g. `http://localhost:4000/api`. */
  readonly VITE_API_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
