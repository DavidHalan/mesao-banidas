# Cartas banidas — Mesão

Site estático que mostra as cartas banidas da nossa mesa de Commander e a regra da casa. As cartas são puxadas do [Scryfall](https://scryfall.com/docs/api) a partir de uma lista de nomes, então não guardamos imagem nenhuma no repositório.

- **HTML/CSS/JS puro**, sem build, sem dependências.
- Hospedado no **GitHub Pages**.
- Imagens e dados resolvidos ao vivo pelo Scryfall (`/cards/collection`), com cache de 24h no navegador.

## Como adicionar uma carta banida

1. Abra `dados.json`.
2. Na lista `"cartas"`, acrescente o **nome exato em inglês** (copie do Moxfield/Archidekt ou do Scryfall), entre aspas, com vírgula no fim da linha anterior:

   ```json
   "cartas": [
     "Sol Ring",
     "Mana Crypt"
   ]
   ```

3. Salve e faça commit. O GitHub Pages republica sozinho em ~1 minuto.

Se um nome estiver errado, a carta **não some calada**: aparece um aviso no topo do site listando os nomes que o Scryfall não encontrou. É só corrigir.

### Carta com arte específica (opcional)

O Scryfall escolhe uma edição padrão da carta. Se quiser uma arte específica, troque a string pelo objeto:

```json
{ "nome": "Sol Ring", "set": "c21", "cn": "263" }
```

## Como adicionar/editar uma regra

Em `dados.json`, edite a lista `"regras"`. Cada regra tem `titulo` e `texto`:

```json
"regras": [
  { "titulo": "Regra Geral", "texto": "Se usar carta banida ou tiver no deck, perde 1/3 da vida por acontecimento." }
]
```

O nome da mesa exibido no topo vem do campo `"mesa"`.

## Rodar localmente

Precisa de um servidor HTTP (o navegador bloqueia `fetch` de arquivo via `file://`):

```bash
npx serve .
```

Depois abra o endereço que aparecer.

---

Conteúdo de fã, não afiliado à Wizards of the Coast. Dados e imagens via Scryfall.
