# Fluxo de Git do Projeto

Este arquivo explica como vamos usar o GitHub no projeto.

O objetivo é manter o fluxo simples, sem mexer direto na versão final.

## Branches

Vamos usar estas branches:

```txt
main -> versão final do projeto
dev  -> versão em desenvolvimento
```

A regra é:

```txt
Não trabalhar direto na main.
```

A `main` fica para a entrega final. A `dev` fica para juntar o que cada pessoa fez.

## Primeiro acesso ao projeto

Clone o repositório:

```bash
git clone git@github.com:danielharrison-l/delivery.git
cd delivery
```

Entre na `dev`:

```bash
git switch dev
```

Atualize o código:

```bash
git pull origin dev
```

Instale as dependências:

```bash
pnpm install
```

## Antes de começar qualquer tarefa

Sempre atualize a `dev`:

```bash
git switch dev
git pull origin dev
```

Depois crie uma branch para sua tarefa:

```bash
git switch -c feature/nome-da-tarefa
```

Exemplos:

```txt
feature/cardapio
feature/reservas
feature/delivery
feature/login
feature/home
```

## Depois de terminar uma tarefa

Veja o que foi alterado:

```bash
git status
```

Adicione os arquivos:

```bash
git add .
```

Crie o commit:

```bash
git commit -m "feat: add menu page"
```

Envie para o GitHub:

```bash
git push -u origin feature/nome-da-tarefa
```

Depois disso, essa branch deve ser juntada na `dev`.

## Como juntar na dev

O jeito mais tranquilo é pelo GitHub:

1. Abrir o repositório.
2. Criar um Pull Request da sua branch para a `dev`.
3. Conferir os arquivos alterados.
4. Fazer o merge.

Também dá para fazer pelo terminal:

```bash
git switch dev
git pull origin dev
git merge feature/nome-da-tarefa
git push origin dev
```

## Se quiser simplificar

Se criar branch por tarefa ficar confuso, todos podem trabalhar direto na `dev`.

Nesse caso, antes de mexer:

```bash
git switch dev
git pull origin dev
```

Depois de terminar:

```bash
git status
git add .
git commit -m "feat: add reservation page"
git push origin dev
```

Nesse modelo, combinem quem vai mexer em cada parte para evitar conflito.

## Atualizando sua branch

Se você está em uma branch própria e a `dev` foi atualizada, faça:

```bash
git switch dev
git pull origin dev
git switch feature/nome-da-tarefa
git merge dev
```

Se aparecer conflito, resolva antes de continuar.

## Conflitos

Conflito acontece quando duas pessoas mexem na mesma parte de um arquivo.

O Git vai marcar o trecho assim:

```txt
<<<<<<<
código de uma branch
=======
código da outra branch
>>>>>>>
```

Para resolver:

1. Abra o arquivo.
2. Escolha o código que deve ficar.
3. Apague as marcações `<<<<<<<`, `=======` e `>>>>>>>`.
4. Salve o arquivo.
5. Rode o projeto ou o build.
6. Finalize:

```bash
git add .
git commit
```

Se não souber qual código manter, chame alguém do grupo.

## Mensagens de commit

Use mensagens curtas em inglês.

Exemplos:

```txt
feat: add menu page
feat: add delivery page
feat: add reservation form
fix: adjust mobile layout
fix: handle login error
docs: update workflow
chore: update config
```

Prefixos mais usados:

```txt
feat  -> funcionalidade nova
fix   -> correção
docs  -> documentação
chore -> configuração ou ajuste interno
style -> ajuste visual
```

## Antes de subir código

Rode o build:

```bash
pnpm build
```

Se falhar, corrija antes de fazer push.

Também confira:

```bash
git status
```

## Entrega final

Quando tudo estiver pronto e testado na `dev`, juntamos a `dev` na `main`:

```bash
git switch main
git pull origin main
git merge dev
git push origin main
```

A `main` deve representar a versão final do projeto.

## Resumo

Fluxo recomendado:

```txt
dev atualizada
-> criar feature
-> fazer a tarefa
-> commit
-> push
-> merge na dev
-> testar
-> dev para main no final
```

Fluxo mais simples:

```txt
todo mundo trabalha na dev
-> sempre dar pull antes
-> fazer commits pequenos
-> testar antes do push
-> main só na entrega final
```
