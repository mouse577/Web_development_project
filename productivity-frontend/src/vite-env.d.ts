/// <reference types="vite/client" />

interface ImportMetaEnv {
  // List all environment variables here
  readonly VITE_BACKEND_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
