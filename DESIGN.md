# DESIGN.md

## Theme

Escuro. Cena: jogador olhando o celular sob luz baixa, à noite, entre turnos; a imagem clara da carta precisa saltar do fundo. Escuro reduz brilho e faz a arte dominar, alinhado ao ecossistema de Magic (Scryfall, Moxfield).

## Color

Estratégia: restrained. Neutros escuros tintados para o vermelho (hue ~25-28 OKLCH), um único acento vermelho carregando a identidade "banido/lista negra" e os estados interativos. Sem `#000`/`#fff`.

- bg `oklch(0.155 0.012 25)`
- surface-1 `oklch(0.205 0.013 26)` · surface-2 `oklch(0.245 0.016 27)`
- border `oklch(0.33 0.016 28)` · border-strong `oklch(0.45 0.02 28)`
- text `oklch(0.95 0.008 60)` · text-2 `oklch(0.77 0.013 50)` · text-3 `oklch(0.6 0.015 45)`
- accent `oklch(0.62 0.2 27)` · accent-bright `oklch(0.72 0.18 30)` · accent-bg `oklch(0.32 0.09 27)`

Identidade: faixa vermelha de 3px no topo da página (cue "alerta/proibido").

## Typography

Duas famílias. Display: **Bricolage Grotesque** (Google Fonts) no wordmark, títulos de seção e nome da carta no modal. Corpo/UI: stack de sistema (`ui-sans-serif, system-ui, "Segoe UI"`). Escala rem fixa, contraste por peso e tamanho.

## Layout and components

- Top bar (marca em display + subtítulo "Lista negra da mesa" + contador em pílula), painel de regras, barra de controles fixa (busca + agrupar + ordenar), galeria em grid por tipo.
- Cartas em grid `auto-fill minmax(150px)`, proporção 488/680, hover sobe com leve `scale(1.025)` e borda vermelha.
- Cabeçalho de seção: marcador em barra vermelha (4x18) + nome em display + contador em pílula.
- Detalhe da carta em `<dialog>` nativo (acessível, Esc fecha): arte à esquerda, infos à direita; botão "Virar" só em cartas de duas faces (`.flip[hidden]{display:none}`).
- Estados: skeleton no carregamento, aviso de nomes não encontrados, erro de rede, vazio na busca.
- Símbolos de mana oficiais via Scryfall `/symbology`.

## Motion

Transições 150-220 ms, ease-out (`cubic-bezier(0.22,1,0.36,1)`). Sem bounce, sem sequência de entrada na página, sem texturas pesadas (grão foi testado e removido por custo de rasterização). Respeita `prefers-reduced-motion`.

## Rejected (anti-slop log)

- Neon/synthwave/CRT (sugestão do ui-ux-pro-max): reflexo de categoria "gaming". Rejeitado.
- Arquitetura de landing AIDA/GSAP/bento/picsum (gpt-taste): não cabe em ferramenta utilitária (register product).
