// Coleção disponível para pronta-entrega (o "lote" produzido pelo ateliê).
// Para lançar uma coleção nova, edite só este arquivo: nome, peças, tamanhos e estoque.
// TODO: todos os valores abaixo são EXEMPLOS — trocar pelos dados reais da Maedicaleb.

export interface Tamanho {
  t: string; // rótulo do tamanho (ex.: "RN", "2", "G")
  estoque: number; // quantas peças ainda há nesse tamanho; 0 = esgotado
}

export interface Peca {
  id: string;
  nome: string;
  modelo: string; // ex.: "Longo", "Curto"
  faixa: 'Bebê' | 'Criança' | 'Adulto'; // usado no filtro da vitrine
  fabric: string; // estampa desenhada (até chegarem as fotos)
  foto?: string; // caminho em /public, ex.: "/lote/xadrez.jpg"
  preco?: number; // em reais; sem preço mostra "consulte"
  tamanhos: Tamanho[];
}

export const lote = {
  nome: 'Coleção de Natal',
  // "restam só X" no tamanho quando o estoque é <= poucas; selo "últimas peças" quando a estampa toda tem <= poucas * 2
  poucas: 3,
  pecas: [
    {
      id: 'xadrez-natalino',
      nome: 'Xadrez Natalino',
      modelo: 'Longo',
      faixa: 'Criança',
      fabric: 'gingham',
      tamanhos: [
        { t: '2', estoque: 6 },
        { t: '4', estoque: 2 },
        { t: '6', estoque: 0 },
      ],
    },
    {
      id: 'tartan-da-ceia',
      nome: 'Tartan da Ceia',
      modelo: 'Longo',
      faixa: 'Adulto',
      fabric: 'tartan',
      tamanhos: [
        { t: 'M', estoque: 4 },
        { t: 'G', estoque: 5 },
        { t: 'GG', estoque: 1 },
      ],
    },
    {
      id: 'noite-estrelada',
      nome: 'Noite Estrelada',
      modelo: 'Longo',
      faixa: 'Bebê',
      fabric: 'stars',
      tamanhos: [
        { t: 'RN', estoque: 3 },
        { t: 'P', estoque: 7 },
        { t: 'M', estoque: 5 },
      ],
    },
    {
      id: 'listrinha-ceu',
      nome: 'Listrinha Céu',
      modelo: 'Curto',
      faixa: 'Criança',
      fabric: 'stripes',
      tamanhos: [
        { t: '1', estoque: 4 },
        { t: '2', estoque: 0 },
        { t: '3', estoque: 6 },
      ],
    },
    {
      id: 'jardim-de-algodao',
      nome: 'Jardim de Algodão',
      modelo: 'Curto',
      faixa: 'Criança',
      fabric: 'floral',
      tamanhos: [
        { t: '4', estoque: 5 },
        { t: '6', estoque: 3 },
        { t: '8', estoque: 4 },
      ],
    },
    {
      id: 'poa-rosado',
      nome: 'Poá Rosado',
      modelo: 'Longo',
      faixa: 'Adulto',
      fabric: 'dots',
      tamanhos: [
        { t: 'P', estoque: 0 },
        { t: 'M', estoque: 2 },
        { t: 'G', estoque: 3 },
      ],
    },
  ] satisfies Peca[],
};
