/// <reference types="vite/client" />

declare module '*.webp' {
  const src: string;
  export default src;
}

declare module '*.png' {
  const src: string;
  export default src;
}

declare module '*.jpg' {
  const src: string;
  export default src;
}

interface ImportMetaEnv {
  readonly VITE_SITE_URL?: string;
  /** 2 ou 3. Padrão: V3 só em dev local; build/produção = V2. */
  readonly VITE_PRESENTATION_VERSION?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
