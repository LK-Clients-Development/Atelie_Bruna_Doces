/**
 * Imagens GERADAS e APROVADAS do portfólio (nunca `REAL`): `APPROVED_GENERATED` + `GENERATED_APPROVED`.
 *
 * Cada entrada aponta para um arquivo local em src/assets/portfolio/<slug>/<slot>.webp e registra a
 * proveniência obrigatória (produto-base, foto real de referência, data, tipo, aprovação). Só entra aqui
 * imagem já aprovada: o que ainda não foi aprovado não existe no código.
 * Chave = `sourceProductId` do Yooga. As entradas são concatenadas à galeria na ordem dos slots.
 */
import type { ImageSlot } from './portfolio';
import chocolatudaDetail from '../assets/portfolio/fatia-chocolatuda/02-detail.webp';
import chocolatudaAngle from '../assets/portfolio/fatia-chocolatuda/03-angle.webp';
import chocolatudaContext from '../assets/portfolio/fatia-chocolatuda/04-context.webp';
import cenouraDetail from '../assets/portfolio/bolo-de-cenoura/02-detail.webp';
import cenouraAngle from '../assets/portfolio/bolo-de-cenoura/03-angle.webp';
import cenouraContext from '../assets/portfolio/bolo-de-cenoura/04-context.webp';

export interface GeneratedEntry {
  slot: Exclude<ImageSlot, '01-source'>;
  kind: 'DETAIL' | 'ANGLE' | 'CONTEXT';
  /** Importação do arquivo (o Astro devolve src/width/height já otimizados). */
  file: { src: string; width: number; height: number };
  alt: string;
  generatedAt: string;
  approvedBy: string;
  approvedAt: string;
}

const APPROVER = 'dono do projeto (aprovação em chat)';

export const GENERATED_IMAGES: Record<number, GeneratedEntry[]> = {
  // Fatia Chocolatuda: galeria completa (01-source é a foto real do Yooga; as 3 abaixo são geradas e aprovadas).
  4672088: [
    {
      slot: '02-detail',
      kind: 'DETAIL',
      file: chocolatudaDetail,
      alt: 'Close da Fatia Chocolatuda: massa de cacau molhadinha em camadas com brigadeiro cremoso e granulado no topo',
      generatedAt: '2026-10-13',
      approvedBy: APPROVER,
      approvedAt: '2026-10-13',
    },
    {
      slot: '03-angle',
      kind: 'ANGLE',
      file: chocolatudaAngle,
      alt: 'Fatia Chocolatuda em prato de cerâmica, vista em três quartos, mostrando as três camadas de massa e as duas de brigadeiro',
      generatedAt: '2026-10-13',
      approvedBy: APPROVER,
      approvedAt: '2026-10-13',
    },
    {
      slot: '04-context',
      kind: 'CONTEXT',
      file: chocolatudaContext,
      alt: 'Fatia Chocolatuda servida em prato de cerâmica sobre mesa de madeira, com garfo dourado e guardanapo',
      generatedAt: '2026-10-13',
      approvedBy: APPROVER,
      approvedAt: '2026-10-13',
    },
  ],
  // Bolo de cenoura tamanho família: galeria completa (01-source = foto real do Yooga).
  7986915: [
    {
      slot: '02-detail',
      kind: 'DETAIL',
      file: cenouraDetail,
      alt: 'Close da cobertura de brigadeiro com granulado escorrendo pelo bolo de cenoura',
      generatedAt: '2026-10-13',
      approvedBy: APPROVER,
      approvedAt: '2026-10-13',
    },
    {
      slot: '03-angle',
      kind: 'ANGLE',
      file: cenouraAngle,
      alt: 'Bolo de cenoura tamanho família inteiro em prato branco, com cobertura de brigadeiro e granulado, em fundo claro',
      generatedAt: '2026-10-13',
      approvedBy: APPROVER,
      approvedAt: '2026-10-13',
    },
    {
      slot: '04-context',
      kind: 'CONTEXT',
      file: cenouraContext,
      alt: 'Bolo de cenoura tamanho família servido em prato sobre pano e mesa de madeira, com espátula ao lado',
      generatedAt: '2026-10-13',
      approvedBy: APPROVER,
      approvedAt: '2026-10-13',
    },
  ],
};
