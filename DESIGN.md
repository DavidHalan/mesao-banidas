# DESIGN.md

Direção: **galeria silenciosa**. Canvas escuro quieto, os cards (a arte) dominam, cromo reduzido, vermelho só como sussurro, muito negative space.

## Theme

Escuro. Cena: jogador olhando o celular sob luz baixa, à noite, entre turnos; a imagem clara da carta precisa saltar do fundo. Escuro reduz brilho e faz a arte dominar.

## Color

Estratégia: restrained ao extremo. Neutros escuros quase sem croma (hue ~30, chroma ~0.006-0.009), um vermelho usado em doses mínimas: marca da casa, tag da regra, pontinho de seção, foco. Sem `#000`/`#fff`.

- bg `oklch(0.16 0.006 30)`
- surface-1 `oklch(0.205 0.007 30)` · surface-2 `oklch(0.245 0.009 30)`
- border `oklch(0.295 0.008 30)` · border-strong `oklch(0.42 0.011 30)`
- text `oklch(0.96 0.004 60)` · text-2 `oklch(0.72 0.006 55)` · text-3 `oklch(0.55 0.009 50)`
- accent `oklch(0.63 0.19 27)` (sussurro)

## Typography

Família única, stack de sistema (`ui-sans-serif, system-ui, "Segoe UI"`), bem tratada com espaçamento e peso. Labels de seção em maiúsculas com tracking (museu). Sem fonte display (testei Bricolage Grotesque e removi: quirky demais para "silenciosa").

## Layout and components

- Masthead quieto: marca pequena + wordmark system + subtítulo + contador como texto simples (sem pílula). Sem faixa no topo. Respiro generoso.
- Regras: bloco discreto com tag "REGRA GERAL" em vermelho (texto, sem fundo).
- Galeria em grid `auto-fill minmax(155px)`, gap generoso (28px). Card hover: sobe + anel hairline (neutro, não vermelho). Proporção 488/680.
- Legenda do card: **nome da face frontal** (cartas de duas faces mostram só a frente) com clamp de 2 linhas e altura reservada → todas as células iguais, sem desalinhamento.
- Cabeçalho de seção: pontinho vermelho 5px + label maiúscula tracked + contador.
- Detalhe em `<dialog>` nativo, **grande no desktop** (860px, arte 300px), empilha no mobile; `max-height: 92vh` com scroll. Botão "Virar" só em cartas de duas faces (`.flip[hidden]{display:none}`).
- Estados: skeleton, aviso de não encontrados, erro de rede, vazio na busca.
- Símbolos de mana oficiais via Scryfall `/symbology`.
- Cache de cartas versionado (`mesao:cards:vN`) — bumpar a versão ao mudar o shape do viewModel, senão visitantes antigos veem dado velho.

## Motion

Transições 150-250 ms, ease-out (`cubic-bezier(0.22,1,0.36,1)`). Sem bounce, sem sequência de entrada, sem texturas pesadas. Respeita `prefers-reduced-motion`.

## Rejected (anti-slop log)

- Neon/synthwave/CRT (ui-ux-pro-max, keywords "gaming"): reflexo de categoria. Rejeitado.
- Landing AIDA/GSAP/bento/picsum (gpt-taste): não cabe em ferramenta utilitária.
- Grão de filme (`feTurbulence`): travava a rasterização e contraria o "flat". Removido.
