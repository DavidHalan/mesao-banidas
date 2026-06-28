# DESIGN.md

## Theme

Escuro. Cena: jogador olhando o celular sob luz baixa, à noite, entre turnos; a imagem clara da carta precisa saltar do fundo. Escuro reduz brilho na mão e faz a arte dominar, alinhado ao ecossistema de Magic (Scryfall, Moxfield).

## Color

Estratégia: restrained. Neutros escuros tintados para o vermelho (hue ~30 OKLCH), um único acento vermelho para identidade "banido" e estados interativos. Sem `#000`/`#fff`.

- bg `oklch(0.165 0.008 30)`
- surface-1 `oklch(0.205 0.009 30)` · surface-2 `oklch(0.245 0.011 32)`
- border `oklch(0.32 0.013 32)` · border-strong `oklch(0.43 0.017 32)`
- text `oklch(0.93 0.006 60)` · text-2 `oklch(0.74 0.010 50)` · text-3 `oklch(0.58 0.012 45)`
- accent `oklch(0.62 0.17 28)` · accent-bright `oklch(0.71 0.17 30)` · accent-bg `oklch(0.30 0.072 28)`

## Typography

Família única, sistema (`ui-sans-serif, system-ui, "Segoe UI"`). Escala rem fixa, contraste por peso e tamanho. Sem fonte display em rótulos.

## Layout and components

- Top bar (marca + contador), painel de regras, barra de controles fixa (busca + agrupar + ordenar), galeria em grid por tipo.
- Cartas em grid `auto-fill minmax(140px)`, proporção 488/680, hover sobe e ganha borda vermelha.
- Detalhe da carta em `<dialog>` nativo (acessível, Esc fecha): arte à esquerda, infos à direita; botão "Virar" para cartas de duas faces.
- Estados: skeleton no carregamento, aviso de nomes não encontrados, erro de rede, vazio na busca.
- Símbolos de mana oficiais via Scryfall `/symbology`.

## Motion

Transições 150–200 ms, ease-out. Sem bounce, sem sequência de entrada na página. Respeita `prefers-reduced-motion`.
