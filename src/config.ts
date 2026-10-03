// Dados da marca usados em toda a página. Troque aqui e tudo se atualiza.
export const site = {
  name: 'Maedicaleb',
  tagline: 'Ateliê infantil',
  city: 'Curitiba, PR',
  instagram: 'https://instagram.com/maedicaleb',
  instagramHandle: '@maedicaleb',
  whatsapp: '5541998993722',
};

export function wa(message = 'Oi! Vim pelo site e quero montar meu pijama 💚') {
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(message)}`;
}

/** Caminho de arquivos da pasta public respeitando o base path do deploy. */
export function asset(path: string) {
  return `${import.meta.env.BASE_URL.replace(/\/$/, '')}${path}`;
}
