/**
 * Imagens GERADAS e APROVADAS do portfólio (nunca `REAL`): `APPROVED_GENERATED` + `GENERATED_APPROVED`.
 *
 * Cada entrada aponta para um arquivo local em src/assets/portfolio/<slug>/<slot>.webp e registra a
 * proveniência obrigatória (produto-base, foto real de referência, data, tipo, aprovação). Só entra aqui
 * imagem já aprovada: o que ainda não foi aprovado não existe no código.
 * Chave = `sourceProductId` do Yooga. As entradas são concatenadas à galeria na ordem dos slots.
 */
import type { ImageSlot } from './portfolio';
import chocolatudaAngle from '../assets/portfolio/fatia-chocolatuda/03-angle.webp';
import chocolatudaContext from '../assets/portfolio/fatia-chocolatuda/04-context.webp';

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
  // Fatia Chocolatuda: aprovadas 03-angle e 04-context; 02-detail ainda NÃO existe.
  4672088: [
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
};
