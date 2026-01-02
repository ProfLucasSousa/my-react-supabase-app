# Projeto React Vite + Supabase com Tailwind

## Passo 1: Configurar o Projeto React com Vite + Tailwind

Primeiro, crie um novo projeto React usando o Vite. Abra seu terminal e execute o seguinte comando:

```bash
npm create vite@latest my-react-supabase-app
```

Navegue até o diretório do projeto e instale as dependências:

```bash
cd my-react-supabase-app
npm install
```

Agora configure o Tailwind CSS. Abra seu terminal na raiz do projeto e instale as dependências:

```bash
npm install tailwindcss @tailwindcss/vite
```

Configure os Arquivos do Tailwind. Edite `vite.config.js`:

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
})
```

No `src/index.css` (ou `App.css`):

```css
@import "tailwindcss";
```

## Passo 2: Configurar o Supabase

1. **Crie um novo projeto:** No painel do Supabase, clique em **"New project"**. Dê um nome ao seu projeto e anote as **Credenciais de Acesso** (Project URL e Project API keys).

2. **Crie uma tabela:** Vá para **"Table Editor"** no menu lateral e clique em **"Create a new table"**. Crie uma tabela de exemplo, por exemplo, `items`, com as seguintes colunas:

- `id` (tipo `int8`, Primary Key)
- `name` (tipo `text`)
- `description` (tipo `text`)

3. **Insira alguns dados de teste:** Na mesma interface, clique em **"Insert"** para adicionar alguns registros à sua tabela `items`.

## Passo 3: Conectar o React ao Supabase

1. **Instale a biblioteca do Supabase:** No terminal, no diretório do seu projeto, instale o SDK do Supabase para JavaScript:

```bash
npm install @supabase/supabase-js
```

2. **Crie as variáveis de ambiente:** Para manter suas chaves seguras, crie um arquivo chamado `.env` na raiz do seu projeto. Adicione suas chaves do Supabase, que você copiou no Passo 2:

```bash
VITE_SUPABASE_URL=SUA_URL_DO_PROJETO
VITE_SUPABASE_ANON_KEY=SUA_CHAVE_ANON
```

- Lembre-se de substituir `SUA_URL_DO_PROJETO` e `SUA_CHAVE_ANON` pelos seus valores reais.
- O prefixo `VITE_` é necessário para que o Vite exponha a variável ao código do lado do cliente.

3. **Crie a instância do cliente Supabase:** Na pasta `src`, crie um novo arquivo chamado `supabaseClient.js`. Este arquivo conterá a lógica de conexão com o Supabase.

```js
// src/supabaseClient.js
// Importa a função `createClient` da biblioteca oficial do Supabase.
// Essa função é usada para criar uma instância do cliente Supabase que permitirá
// interagir com o banco de dados e serviços do Supabase.
import { createClient } from '@supabase/supabase-js';

// Recupera a URL do Supabase a partir das variáveis de ambiente.
// `import.meta.env.VITE_SUPABASE_URL` é a forma de acessar variáveis definidas no Vite.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;

// Recupera a chave anônima do Supabase a partir das variáveis de ambiente.
// Essa chave é usada para autenticar operações de leitura/escrita permitidas no lado do cliente.
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Cria e exporta o cliente Supabase usando a URL e a chave anônima.
// Com isso, podemos importar `supabase` em qualquer parte da aplicação para interagir com o Supabase.
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

```

## Passo 4: Implementar a Lógica de Fetch no Componente React

Agora, modifique o arquivo principal do seu aplicativo para buscar e exibir os dados do Supabase.
Substitua o conteúdo de `src/App.jsx` pelo código a seguir:

```js
// src/App.jsx
// Importa os hooks useState e useEffect do React para gerenciar o estado e os efeitos colaterais.
import { useState, useEffect } from 'react';
// Importa o cliente Supabase para interagir com o banco de dados.
import { supabase } from './supabaseClient';
import './App.css';

function App() {
  // Estado para armazenar a lista de itens buscados do Supabase.
  const [items, setItems] = useState([]);
  // Estado para controlar o estado de carregamento da aplicação.
  const [loading, setLoading] = useState(true);
  // Estado para armazenar mensagens de erro, se houver.
  const [error, setError] = useState(null);
  // Estado para o valor do campo de input 'nome'.
  const [newItemName, setNewItemName] = useState('');
  // Estado para o valor do campo de input 'descrição'.
  const [newItemDescription, setNewItemDescription] = useState('');
  // Estado para controlar o botão de envio durante a gravação no banco de dados.
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Hook useEffect que executa a função getItems uma vez quando o componente é montado.
  useEffect(() => {
    getItems();
  }, []); // O array vazio [] garante que o efeito seja executado apenas uma vez.

  // Função assíncrona para buscar os itens do banco de dados Supabase.
  async function getItems() {
    try {
      setLoading(true); // Define o estado de carregamento como verdadeiro antes da requisição.
      // Realiza a consulta ao Supabase: seleciona todos os dados da tabela 'items'.
      const { data, error } = await supabase
        .from('items')
        .select('*');
      // Se houver um erro na requisição, lança-o para ser capturado pelo bloco catch.
      if (error) {
        throw error;
      }
      // Se a requisição for bem-sucedida, atualiza o estado com os dados recebidos.
      setItems(data);
    } catch (error) {
      // Em caso de erro, atualiza o estado de erro com a mensagem do erro.
      setError(error.message);
    } finally {
      // Define o estado de carregamento como falso após a requisição, independentemente do resultado.
      setLoading(false);
    }
  }
  // Função assíncrona para adicionar um novo item ao banco de dados.
  async function handleAddItem(event) {
    event.preventDefault(); // Previne o comportamento padrão de recarregar a página ao enviar o formulário.
    // Validação simples: verifica se os campos de nome e descrição estão preenchidos.
    if (!newItemName.trim() || !newItemDescription.trim()) {
      alert('Por favor, preencha todos os campos.');
      return;
    }
    try {
      setIsSubmitting(true); // Ativa o estado de envio para desativar o botão.
      // Insere um novo registro na tabela 'items' com os valores dos inputs.
      const { error } = await supabase
        .from('items')
        .insert([{ name: newItemName, description: newItemDescription }]);
      // Lança um erro se a inserção falhar.
      if (error) {
        throw error;
      }
      // Limpa os campos do formulário após a inserção bem-sucedida.
      setNewItemName('');
      setNewItemDescription('');
      // Chama getItems para recarregar a lista e exibir o novo item.
      getItems();
    } catch (error) {
      setError(error.message); // Em caso de erro, exibe a mensagem de erro.
    } finally {
      setIsSubmitting(false); // Desativa o estado de envio, reabilitando o botão.
    }
  }
  // Lógica de renderização condicional: exibe o estado de carregamento.
  if (loading) {
    // Estilos Tailwind: centraliza o conteúdo verticalmente e horizontalmente na tela.
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl font-semibold text-gray-400">Carregando itens...</div>
      </div>
    );
  }
  // Lógica de renderização condicional: exibe a mensagem de erro.
  if (error) {
    // Estilos Tailwind: centraliza a mensagem de erro com cor vermelha.
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl font-semibold text-red-500">Ocorreu um erro: {error}</div>
      </div>
    );
  }
  // Renderização principal do componente quando não está carregando e não há erros.
  return (
    // Estilos Tailwind: contêiner principal com fundo escuro e centralização.
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-gray-900">
      {/* Seção de cabeçalho da página */}
      <header className="text-center mb-10">
        <h1 className="text-4xl font-extrabold text-white mb-2">
          Gerenciador de Itens
        </h1>
        <p className="text-gray-400">Adicione e visualize itens com React e Supabase</p>
      </header>
      {/* Formulário para Adicionar Novo Item */}
      {/* Estilos Tailwind: fundo cinza escuro, padding, bordas arredondadas e sombra. */}
      <form onSubmit={handleAddItem} className="bg-gray-800 p-8 rounded-xl shadow-lg w-full max-w-md">
        {/* Campo de input para o nome */}
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-300 text-sm font-bold mb-2">
            Nome do Item
          </label>
          <input
            id="name"
            type="text"
            placeholder="Ex: Tênis de corrida"
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            disabled={isSubmitting} // Desativa o input enquanto o envio está em andamento.
            // Estilos Tailwind: input moderno sem bordas, com bordas arredondadas e foco com anel azul.
            className="shadow appearance-none border-0 rounded w-full py-2 px-3 text-gray-400 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
          />
        </div>
        {/* Campo de textarea para a descrição */}
        <div className="mb-6">
          <label htmlFor="description" className="block text-gray-300 text-sm font-bold mb-2">
            Descrição
          </label>
          <textarea
            id="description"
            placeholder="Ex: Confortável e leve para longas distâncias."
            value={newItemDescription}
            onChange={(e) => setNewItemDescription(e.target.value)}
            disabled={isSubmitting} // Desativa o textarea enquanto o envio está em andamento.
            // Estilos Tailwind: textarea com os mesmos estilos do input para consistência.
            className="shadow appearance-none border-0 rounded w-full py-2 px-3 text-gray-400 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
          />
        </div>
        {/* Botão de envio */}
        <div className="flex items-center justify-between">
          <button
            type="submit"
            disabled={isSubmitting} // Desativa o botão enquanto o envio está em andamento.
            // Estilos Tailwind: botão com fundo azul, efeito hover e opacidade para o estado desativado.
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300 disabled:opacity-50"
          >
            {isSubmitting ? 'Adicionando...' : 'Adicionar Item'}
          </button>
        </div>
      </form>
      {/* Seção para exibir a lista de itens */}
      <div className="mt-10 w-full max-w-md">
        {/* Renderização condicional: se houver itens, exibe a lista, caso contrário, uma mensagem. */}
        {items.length > 0 ? (
          // Estilos Tailwind: lista com espaço entre os itens.
          <ul className="space-y-4">
            {/* Mapeia o array de itens para renderizar cada item como um <li> */}
            {items.map((item) => (
              // Estilos Tailwind para o item da lista: card com fundo cinza, padding, bordas arredondadas e efeito de escala no hover.
              <li key={item.id} className="bg-gray-800 p-6 rounded-xl shadow-md transition-transform transform hover:scale-105 duration-300">
                <h2 className="text-xl font-semibold text-white">{item.name}</h2>
                <p className="mt-2 text-gray-400">{item.description}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-400 text-center">Nenhum item encontrado. Adicione um novo!</p>
        )}
      </div>
    </div>
  );
}

export default App;
```
