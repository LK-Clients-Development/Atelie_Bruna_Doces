import PresentationShell from './presentation/PresentationShell';
import PresentationShellV3 from './presentation/PresentationShellV3';
import { resolvePresentationVersion } from './presentation/version';

/**
 * V2 (oito cenas) e V3 (6 slides + expansão) coexistem. Ver version.ts:
 * ?v=2 / ?v=3 na URL, ou VITE_PRESENTATION_VERSION; padrão = V3 só no dev local, V2 no build.
 */
export default function App() {
  return resolvePresentationVersion() === 3 ? <PresentationShellV3 /> : <PresentationShell />;
}
