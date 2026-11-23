import type { SceneProps } from '../types';
import { LK_INTRO } from '../../content-v3';
import { AGENCY } from '../../content';
import SplitText from '../../components/SplitText';
import Reveal from '../../components/Reveal';
import Particles from '../../components/Particles';
import { LK_LOGO_SRC, LK_PORTRAITS, LK_TEAM_PHOTO_SRC } from '../../../assets/lkAssets';
import atelieLogo from '../../../assets/brand/atelie-doces-bruna-logo.png';

/** Slide 01: a LK se apresenta sem apagar a identidade da Bruna. Assets oficiais da LK pendentes viram placeholders identificados. */
export default function LkIntroScene({ active }: SceneProps) {
  return (
    <div className="scene scene--lk">
      <Particles active={active} count={6} />
      <div className="scene__inner lk">
        <div className="lk__text">
          <Reveal active={active} order={0} className="lk__marks">
            <div className="lk__mark lk__mark--lk">
              {LK_LOGO_SRC ? (
                <img src={LK_LOGO_SRC} alt={AGENCY.name} />
              ) : (
                <span className="placeholder placeholder--logo" role="img" aria-label="Logomarca oficial da LK Technologies Brasil (a ser fornecida)">
                  <b>LK</b>
                  <i>Logomarca oficial pendente</i>
                </span>
              )}
            </div>
            <span className="lk__cross" aria-hidden="true">
              ×
            </span>
            <div className="lk__mark lk__mark--atelie">
              <p className="lk__for">{LK_INTRO.forLabel}</p>
              <img src={atelieLogo} alt="Ateliê Doces Bruna" />
            </div>
          </Reveal>

          <p className="kicker">{LK_INTRO.kicker}</p>
          <SplitText as="h1" className="display display--xl lk__title" lines={[...LK_INTRO.title]} active={active} delay={0.3} />
          <Reveal active={active} order={3}>
            <p className="lead">{LK_INTRO.description}</p>
          </Reveal>
        </div>

        <Reveal active={active} order={2} className="lk__who">
          <figure className="lk__photo">
            {LK_TEAM_PHOTO_SRC ? (
              <img src={LK_TEAM_PHOTO_SRC} alt={LK_INTRO.photoAlt} />
            ) : LK_PORTRAITS.length > 0 ? (
              <div className="lk__portraits" role="img" aria-label={LK_INTRO.photoAlt}>
                {LK_PORTRAITS.map(({ name, src }) => (
                  <div key={name} className="lk__portrait">
                    <img src={src} alt="" />
                    <span>{name}</span>
                  </div>
                ))}
              </div>
            ) : (
              <span className="placeholder placeholder--photo" role="img" aria-label={`${LK_INTRO.photoAlt} (fotografia oficial a ser fornecida)`}>
                <i>Fotografia oficial de Lukas e Leonardo pendente</i>
              </span>
            )}
          </figure>
          <div className="lk__box">
            <h2 className="lk__box-title">{LK_INTRO.boxTitle}</h2>
            <ul className="lk__people" role="list">
              {LK_INTRO.people.map((name) => (
                <li key={name}>{name}</li>
              ))}
            </ul>
            <p className="lk__box-line">{AGENCY.name}</p>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
