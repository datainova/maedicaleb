// Dados da marca usados em toda a página. Troque aqui e tudo se atualiza.
export const site = {
  name: 'Maedicaleb',
  tagline: 'Ateliê infantil',
  city: 'Curitiba, PR',
  instagram: 'https://instagram.com/maedicaleb',
  instagramHandle: '@maedicaleb',
  // TODO: número real do WhatsApp, só dígitos com DDI + DDD (ex.: 5541999999999)
  whatsapp: '5541900000000',
};

export function wa(message = 'Oi! Vim pelo site e quero montar meu pijama 💚') {
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(message)}`;
}
