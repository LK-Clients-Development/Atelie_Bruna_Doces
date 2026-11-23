import { useMemo } from 'react';
import type { SceneProps } from '../types';
import RevealScene from '../RevealScene';
import { PUBLISHED_SITE_URL } from '../../content';
import { SITE_DEMO, resolveDemoSite } from '../../content-v3';

/** Slide 02: reaproveita a cena de revelação (aparelhos com capturas reais) e liga o botão ao site local, quando houver. */
export default function DemoScene({ active }: SceneProps) {
  const { url, isLocal } = useMemo(() => resolveDemoSite(PUBLISHED_SITE_URL, import.meta.env.VITE_SITE_URL), []);
  return (
    <RevealScene
      active={active}
      kicker={SITE_DEMO.kicker}
      title={SITE_DEMO.title}
      siteUrl={url}
      buttonLabel={SITE_DEMO.buttonLabel}
      highlights={SITE_DEMO.highlights}
      note={isLocal ? SITE_DEMO.localNote : SITE_DEMO.remoteNote}
    />
  );
}
