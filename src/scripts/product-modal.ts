/**
 * Modal de produto de /produtos: galeria + informações, com foco preso, ESC, retorno de foco,
 * fundo inerte, teclado e swipe, sem biblioteca.
 *
 * - Os dados vêm de <script type="application/json" id="portfolio-data"> (embutido no build).
 * - As fotos só são criadas aqui, quando o modal abre: os cards carregam apenas a principal.
 * - URL `?produto=slug`: abrir faz push (o botão Voltar fecha o modal) e o link abre o produto
 *   direto. Se o slug não existir, o parâmetro é ignorado.
 * - Produto com 1 foto mostra 1 foto (sem setas, sem miniaturas, sem duplicar); sem foto, o painel da marca.
 */
interface ModalImage {
  src: string;
  width: number | null;
  height: number | null;
  alt: string;
}
interface ModalProduct {
  slug: string;
  name: string;
  category: string;
  description: string | null;
  images: ModalImage[];
  whatsapp: string | null;
  yooga: string | null;
}

const modal = document.querySelector<HTMLElement>('[data-modal]');
const dataEl = document.getElementById('portfolio-data');

if (modal && dataEl) {
  const products = new Map((JSON.parse(dataEl.textContent ?? '[]') as ModalProduct[]).map((p) => [p.slug, p]));
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const q = <T extends HTMLElement>(sel: string) => modal.querySelector<T>(sel)!;

  const dialog = q<HTMLElement>('[data-dialog]');
  const stage = q<HTMLElement>('[data-stage]');
  const thumbs = q<HTMLElement>('[data-thumbs]');
  const prev = q<HTMLButtonElement>('[data-prev]');
  const next = q<HTMLButtonElement>('[data-next]');
  const counter = q<HTMLElement>('[data-count]');
  const cat = q<HTMLElement>('[data-m-cat]');
  const title = q<HTMLElement>('[data-m-title]');
  const desc = q<HTMLElement>('[data-m-desc]');
  const wa = q<HTMLAnchorElement>('[data-m-wa]');
  const yooga = q<HTMLAnchorElement>('[data-m-yooga]');

  let current: ModalProduct | null = null;
  let index = 0;
  let opener: HTMLElement | null = null;
  let pushed = false;
  let stageImg: HTMLImageElement | null = null;
  const inerted: HTMLElement[] = [];

  // ----- galeria -----
  const render = () => {
    if (!current || !stageImg) return;
    const image = current.images[index];
    const total = current.images.length;
    stageImg.alt = `${current.name}: foto ${index + 1} de ${total}`;
    stageImg.src = image.src;
    counter.textContent = `${index + 1} / ${total}`;
    [...thumbs.children].forEach((li, i) => {
      const btn = li.firstElementChild as HTMLButtonElement;
      if (i === index) btn.setAttribute('aria-current', 'true');
      else btn.removeAttribute('aria-current');
    });
  };

  const show = (to: number) => {
    if (!current || current.images.length < 2) return;
    const total = current.images.length;
    index = (to + total) % total;
    if (reduced.matches || !stageImg) return render();
    const img = stageImg;
    img.classList.add('is-swapping');
    window.setTimeout(() => {
      render();
      const done = () => img.classList.remove('is-swapping');
      img.addEventListener('load', done, { once: true });
      window.setTimeout(done, 500); // imagem em cache pode não disparar `load`
    }, 180);
  };

  const build = (product: ModalProduct) => {
    stage.querySelectorAll('img, .pmodal__empty').forEach((el) => el.remove());
    thumbs.replaceChildren();
    stageImg = null;
    const total = product.images.length;
    if (total === 0) {
      const empty = document.createElement('div');
      empty.className = 'pmodal__empty';
      empty.textContent = product.name;
      stage.prepend(empty);
    } else {
      stageImg = document.createElement('img');
      const first = product.images[0];
      if (first.width && first.height) {
        stageImg.width = first.width;
        stageImg.height = first.height;
      }
      stageImg.decoding = 'async';
      stage.prepend(stageImg);
      product.images.forEach((image, i) => {
        if (total < 2) return;
        const li = document.createElement('li');
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'pmodal__thumb';
        btn.setAttribute('aria-label', `Ver foto ${i + 1} de ${total}`);
        const img = document.createElement('img');
        img.src = image.src;
        img.alt = '';
        img.loading = 'lazy';
        img.decoding = 'async';
        btn.append(img);
        btn.addEventListener('click', () => show(i));
        li.append(btn);
        thumbs.append(li);
      });
    }
    const many = total > 1;
    prev.hidden = next.hidden = counter.hidden = thumbs.hidden = !many;
  };

  // ----- abrir / fechar -----
  const setInert = () => {
    [...document.body.children].forEach((el) => {
      if (el === modal || el.tagName === 'SCRIPT' || !(el instanceof HTMLElement) || el.hasAttribute('inert')) return;
      el.setAttribute('inert', '');
      inerted.push(el);
    });
  };
  const clearInert = () => {
    inerted.splice(0).forEach((el) => el.removeAttribute('inert'));
  };

  const fill = (product: ModalProduct) => {
    current = product;
    index = 0;
    cat.textContent = product.category;
    title.textContent = product.name;
    desc.textContent = product.description ?? '';
    desc.hidden = !product.description;
    wa.hidden = !product.whatsapp;
    if (product.whatsapp) wa.href = product.whatsapp;
    yooga.hidden = !product.yooga;
    if (product.yooga) yooga.href = product.yooga;
    build(product);
    render();
  };

  const urlFor = (slug: string | null) => {
    const url = new URL(location.href);
    if (slug) url.searchParams.set('produto', slug);
    else url.searchParams.delete('produto');
    return url.pathname + url.search + url.hash;
  };

  const openProduct = (slug: string, from: HTMLElement | null, push: boolean) => {
    const product = products.get(slug);
    if (!product) return;
    const wasOpen = !modal.hidden;
    if (!wasOpen) opener = from ?? (document.activeElement as HTMLElement | null);
    fill(product);
    if (push) {
      history.pushState({ produto: slug }, '', urlFor(slug));
      pushed = true;
    }
    if (wasOpen) return;
    modal.hidden = false;
    document.documentElement.classList.add('is-modal-open');
    setInert();
    dialog.focus({ preventScroll: true });
    document.addEventListener('keydown', onKey);
  };

  const closeNow = () => {
    if (modal.hidden) return;
    modal.hidden = true;
    document.documentElement.classList.remove('is-modal-open');
    document.removeEventListener('keydown', onKey);
    clearInert();
    const back = opener && document.contains(opener) ? opener : document.querySelector<HTMLElement>(`[data-open="${current?.slug}"]`);
    back?.focus({ preventScroll: true });
    opener = null;
    current = null;
    pushed = false;
    stage.querySelectorAll('img').forEach((el) => el.remove()); // libera as fotos
    thumbs.replaceChildren();
  };

  /** Fecha pela interface: se o modal foi aberto com push, o Voltar do navegador faz o resto. */
  const requestClose = () => {
    if (pushed) {
      pushed = false;
      history.back(); // popstate → closeNow
    } else {
      closeNow();
      if (new URL(location.href).searchParams.has('produto')) history.replaceState(null, '', urlFor(null));
    }
  };

  const focusables = () =>
    [...dialog.querySelectorAll<HTMLElement>('button, a[href], [tabindex]:not([tabindex="-1"])')].filter(
      (el) => !el.hasAttribute('disabled') && !el.hidden && el.getClientRects().length > 0,
    );

  function onKey(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      event.preventDefault();
      requestClose();
    } else if (event.key === 'ArrowLeft') {
      show(index - 1);
    } else if (event.key === 'ArrowRight') {
      show(index + 1);
    } else if (event.key === 'Tab') {
      const items = focusables();
      if (!items.length) return event.preventDefault();
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;
      if (event.shiftKey && (active === first || active === dialog)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      } else if (!dialog.contains(active)) {
        event.preventDefault();
        first.focus();
      }
    }
  }

  // ----- eventos -----
  modal.querySelectorAll('[data-modal-close]').forEach((el) => el.addEventListener('click', requestClose));
  prev.addEventListener('click', () => show(index - 1));
  next.addEventListener('click', () => show(index + 1));

  // swipe (toque): o teclado e as setas continuam sendo o caminho principal
  let startX: number | null = null;
  stage.addEventListener('pointerdown', (event) => {
    if ((event.target as HTMLElement).closest('button')) return;
    startX = event.clientX;
  });
  stage.addEventListener('pointerup', (event) => {
    if (startX === null) return;
    const dx = event.clientX - startX;
    startX = null;
    if (Math.abs(dx) > 40) show(dx < 0 ? index + 1 : index - 1);
  });
  stage.addEventListener('pointercancel', () => (startX = null));

  document.querySelectorAll<HTMLElement>('[data-open]').forEach((el) => el.setAttribute('aria-haspopup', 'dialog'));
  document.addEventListener('click', (event) => {
    const link = (event.target as HTMLElement).closest<HTMLElement>('[data-open]');
    if (!link || event.defaultPrevented) return;
    const e = event as MouseEvent;
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return; // abrir em nova aba continua funcionando
    event.preventDefault();
    openProduct(link.dataset.open!, link, true);
  });

  window.addEventListener('popstate', () => {
    const slug = new URL(location.href).searchParams.get('produto');
    if (slug && products.has(slug)) openProduct(slug, null, false);
    else closeNow();
  });

  // link compartilhado: ?produto=slug abre direto (sem push; fechar limpa o parâmetro)
  const initial = new URL(location.href).searchParams.get('produto');
  if (initial && products.has(initial)) openProduct(initial, null, false);
}
