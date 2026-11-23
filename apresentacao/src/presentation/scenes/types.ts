export interface SceneProps {
  active: boolean;
}

/** V3: o encerramento recebe o gatilho discreto da expansão comercial. */
export interface V3SceneProps extends SceneProps {
  onOpenExpansion?: () => void;
}
