# PRODUCT.md

register: product

## Product purpose

Página única que lista as cartas banidas da nossa mesa caseira de Magic (Commander) e mostra a regra da casa para quem usar uma carta banida. Referência rápida, consultada no celular durante o jogo.

## Users

Os jogadores da mesa (4 a 8 amigos). Conhecem Magic, usam Moxfield/Archidekt, leem nomes de carta em inglês. Acessam o site no celular, à noite, entre turnos, para conferir se uma carta é proibida.

## Brand and tone

- Nome da mesa: "Mesão" (provisório, trocável em `dados.json`).
- Tom: direto e sem cerimônia, como a galera fala. Português do Brasil.
- Identidade visual: lista negra. O vermelho marca "proibido"; o resto é escuro e sóbrio para a imagem da carta dominar.

## Strategic principles

- A imagem da carta é a estrela. A interface some atrás dela.
- Manutenção por qualquer um da mesa: editar uma lista de nomes em JSON, sem build.
- Fonte única de verdade é o Scryfall. Não duplicamos dados de carta.

## Anti-references

- Visual "gamer" genérico: neon sobre preto, dramaticidade RGB.
- Ferramenta de deckbuilding cheia de estatística (preço, EDHREC rank, inclusão). Aqui é só banlist + regra.
