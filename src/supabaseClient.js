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