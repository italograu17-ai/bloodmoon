# Fases da Lua Interativo

Projeto educativo desenvolvido em HTML, CSS e JavaScript para apresentar as fases da Lua, simular o ciclo lunar e testar conhecimentos por meio de um quiz.

## Integrantes e responsabilidades

- **João:** Especificação 1 (visualização das fases) e Especificação 3 (quiz lunar).
- **Ítalo:** Especificação 2 (simulação do ciclo lunar).

As responsabilidades indicam a divisão inicial do trabalho. Alterações compartilhadas devem ser alinhadas pela equipe antes de integrar.

## Estrutura

```text
.
├── .gitignore
├── README.md
├── app.js
├── index.html
└── styles.css
```

O HTML contém os pontos de integração `#visualizacao-fases`, `#simulacao-lunar` e `#quiz-lunar`.

## Executar localmente

Abra `index.html` em um navegador moderno. Alternativamente, com Python instalado, execute na pasta do projeto:

```bash
python -m http.server 8000
```

Depois, acesse `http://localhost:8000`.

## Fluxo de trabalho Git

### Branches

- `main`: versão estável e integrada. Não faça commits diretamente nesta branch.
- `feature/especificacao-1-3-joao`: trabalho de João nas especificações 1 e 3.
- `feature/especificacao-2-italo`: trabalho de Ítalo na especificação 2.

Atualize a branch principal e crie ou retome sua branch de trabalho:

```bash
git switch main
git pull origin main
git switch -c feature/especificacao-1-3-joao
```

Para Ítalo, use `feature/especificacao-2-italo` no último comando. Se a branch já existir localmente, use `git switch nome-da-branch` em vez de `-c`.

Antes de abrir um PR, atualize a branch com `main`, resolva conflitos nela, teste as alterações e envie a branch:

```bash
git fetch origin
git merge origin/main
git push -u origin nome-da-branch
```

### Padrão de commits

Use mensagens curtas no padrão **Conventional Commits**:

```text
tipo(escopo): descrição no imperativo
```

Tipos comuns: `feat` (funcionalidade), `fix` (correção), `docs` (documentação), `style` (formatação sem mudança de lógica), `refactor` (reestruturação) e `test` (testes).

Exemplos:

```text
feat(fases): adiciona seleção das fases lunares
feat(simulacao): implementa controle de velocidade
fix(quiz): impede respostas duplicadas
docs(readme): descreve fluxo de pull request
```

Faça commits pequenos e relacionados a uma única mudança. Não inclua arquivos temporários, credenciais ou alterações alheias à tarefa.

### Revisão via Pull Request

1. Abra um PR da branch de funcionalidade para `main`; não integre trabalho por push direto em `main`.
2. No título, use o padrão de commit. Na descrição, resuma o que mudou, a especificação atendida e como testar.
3. Peça revisão ao outro integrante. O autor deve responder aos comentários e atualizar o PR.
4. Antes de aprovar, o revisor verifica escopo, funcionamento, responsividade, acessibilidade básica e ausência de erros no console.
5. Integre somente após aprovação e validação. Prefira **Squash and merge** para manter o histórico de `main` conciso; apague a branch após a integração.
6. Depois do merge, atualize `main` localmente antes de iniciar outra tarefa.

## Integração das seções

- João implementa `#visualizacao-fases` e `#quiz-lunar` em sua branch.
- Ítalo implementa `#simulacao-lunar` em sua branch.
- Cada integrante evita editar a seção que pertence ao outro; mudanças comuns no cabeçalho, navegação ou estilos devem ser combinadas para reduzir conflitos.