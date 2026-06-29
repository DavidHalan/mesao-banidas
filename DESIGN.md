# DESIGN.md

Direção: **galeria de carvão com pegada MTG**. Canvas escuro carvão, os cards (a arte) dominam, tipografia gravada dá o sabor MTG, e as cinco cores (WUBRG) aparecem só onde codificam dado. Moderno e minimalista, equilibrado.

## Theme

Escuro carvão. Cena: jogador olhando o celular sob luz baixa, à noite, entre turnos; a imagem clara da carta precisa saltar do fundo. Escuro reduz brilho e faz a arte dominar.

## Color

Estratégia: neutros de carvão quase-neutros (hue ~40, chroma ~0.008-0.015), bem escuros. Um vermelho como marca da casa / "proibido" / foco. As cinco cores de Magic existem como sistema, mas **presas a significado** (nunca decorativas): pips do filtro e pontinho das seções ao agrupar por cor. Sem `#000`/`#fff`. Sem neon/glow.

- bg `oklch(0.135 0.008 40)`
- surface-1 `oklch(0.18 0.010 40)` · surface-2 `oklch(0.23 0.012 40)`
- border `oklch(0.30 0.012 40)` · border-strong `oklch(0.42 0.015 40)`
- text `oklch(0.95 0.006 60)` · text-2 `oklch(0.73 0.008 55)` · text-3 `oklch(0.56 0.010 50)`
- accent `oklch(0.64 0.20 27)` (vermelho da casa)
- WUBRG: `--c-w 0.90 0.035 95` · `--c-u 0.66 0.13 245` · `--c-b 0.60 0.06 300` · `--c-r` = accent · `--c-g 0.66 0.12 150` · `--c-c 0.66 0.015 70` (incolor, prata)

## Typography

Dupla: **Cinzel** (capitais gravadas, via Google Fonts) no título do hero, labels de seção, tag da regra e nome da carta no modal — dá o registro de "título de carta MTG", moderno por contraste. Corpo em stack de sistema (`ui-sans-serif, system-ui, "Segoe UI"`). `--font-display: "Cinzel", Georgia, serif`.

## Layout and components

- **Hero**: kicker "MESÃO · COMMANDER" (marca pequena + wordmark) + título gravado grande "PROIBIDAS" (clamp 46-88px) + sub com contador.
- **Selo (decree)**: regra num banner com selo de proibição vermelho à esquerda (círculo + ⊘, 2px border, sem stripe lateral) + tag "REGRA GERAL" + texto. Renderiza de `dados.regras`.
- **Workspace**: no desktop, grid `248px · galeria`; trilho lateral sticky com busca, agrupar, ordenar, filtro de cor. No mobile (≤900px) o trilho vira barra sticky horizontal no topo.
- **Galeria** em grid `auto-fill minmax(155px)`, gap 28px. Card: `.card-frame` arredondado 10px + anel hairline + `overflow:hidden`; hover sobe 7px + anel mais forte; **hover revela o custo de mana** em pips reais (desktop). Proporção 488/680. Legenda = nome da face frontal, clamp 2 linhas com altura reservada.
- **Agrupar por cor**: seções Branco/Azul/Preto/Vermelho/Verde/Multicolor/Incolor, cada pontinho aceso na própria cor (multicolor = gradiente WUBRG, incolor = prata). O nome da seção já carrega a cor em texto (a11y).
- **Filtro de cor** (completo, estilo Scryfall): 5 pips WUBRG (símbolos oficiais Scryfall) + dropdown de modo: **Exatamente / Incluindo / No máximo** estas cores. Opera sobre `color_identity` (`c.ci`). Default: Incluindo.
- Detalhe em `<dialog>` nativo, grande no desktop (860px, arte 300px), empilha no mobile; `max-height: 92vh`. Botão "Virar" só em cartas de duas faces (`.flip[hidden]{display:none}`).
- Estados: skeleton, aviso de não encontrados, erro de rede, vazio nos filtros.
- Símbolos de mana oficiais via Scryfall `/symbology`.
- Cache de cartas versionado (`mesao:cards:vN`) — bumpar a versão ao mudar o shape do viewModel, senão visitantes antigos veem dado velho. `c.ci` (color_identity) já faz parte do viewModel.

## Motion

Transições 150-250 ms, ease-out (`cubic-bezier(0.22,1,0.36,1)`). Sem bounce, sem sequência de entrada, sem texturas pesadas. Respeita `prefers-reduced-motion`.

## Rejected (anti-slop log)

- Faixa de identidade de cor na base do card: testada e removida. A curva dos cantos do frame afunilava a barra fina (antisimetria) e gerava desconforto. A cor da carta já se lê no agrupar-por-cor e no modal.
- Oxblood drenched (fundo preto-sangue): testado, escurecido para carvão quase-neutro a pedido (menos drama, mais sóbrio).
- Galeria silenciosa (versão anterior): neutros sem croma + sem fonte display. Substituída por carvão + Cinzel + WUBRG a pedido de "moderno com pegada MTG".
- Neon/synthwave/CRT, landing AIDA/bento, grão de filme: reflexos de categoria, fora.
