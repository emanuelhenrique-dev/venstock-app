import { useSQLiteContext } from 'expo-sqlite';

export type CategoryCreate = {
  name: string;
  color: string;
  imageUrl?: string;
};

export type CategoryUpdate = CategoryCreate & {
  id: number;
};

export type CategoryResponse = {
  id: number;
  name: string;
  qtdEstoque: number;
  qtdProdutosUnicos: number;
  qtdVendidos: number;
  imageUrl?: string | null;
  color: string;
  created_at: string;
};

export function useCategoryDatabase() {
  const database = useSQLiteContext();

  // Função para Cadastrar uma Categoria
  async function create(data: CategoryCreate) {
    const statement = await database.prepareAsync(
      `INSERT INTO categories (name, color, image_url) VALUES ($name, $color, $image_url)`
    );

    try {
      const result = await statement.executeAsync({
        $name: data.name,
        $color: data.color,
        $image_url: data.imageUrl ?? null
      });

      // Retorna o ID que o banco gerou automaticamente
      return { insertId: result.lastInsertRowId };
    } catch (error) {
      throw error;
    } finally {
      await statement.finalizeAsync();
    }
  }

  // Função para Listar todas as Categorias
  async function getAll() {
    try {
      const query = `
        SELECT 
          c.id,
          c.name,
          COALESCE(SUM(p.quantity), 0) AS qtdEstoque,
          COALESCE(COUNT(p.id), 0) AS qtdProdutosUnicos,
          COALESCE(
            (SELECT SUM(ti.quantity)
             FROM transaction_items ti
             INNER JOIN products prod ON prod.id = ti.product_id
             INNER JOIN transactions t ON t.id = ti.transaction_id
             WHERE prod.category_id = c.id AND t.type = 'sale'),
             0
          ) AS qtdVendidos,
          c.image_url AS imageUrl,
          c.color,
          c.created_at
        FROM categories c
        LEFT JOIN products p ON p.category_id = c.id
        GROUP BY c.id
        ORDER BY c.name ASC
      `;

      const response = await database.getAllAsync<CategoryResponse>(query);

      return response;
    } catch (error) {
      console.log('Erro ao buscar categorias:', error);
      throw error;
    }
  }

  // Buscar uma Categoria Específica pelo ID
  async function show(id: number) {
    try {
      const query = `
      SELECT 
        c.id,
        c.name,
        COALESCE(SUM(p.quantity), 0) AS qtdEstoque,
        0 AS qtdVendidos,
        c.image_url AS imageUrl,
        c.color,
        c.created_at
      FROM categories c
      LEFT JOIN products p ON p.category_id = c.id
      WHERE c.id = ?
      GROUP BY c.id
    `;

      const response = await database.getFirstAsync<CategoryResponse>(query, [
        id
      ]);
      return response; // Retorna o objeto da categoria encontrada ou null se não existir
    } catch (error) {
      console.log(`Erro ao buscar a categoria com ID ${id}:`, error);
      throw error;
    }
  }

  // Função para Atualizar uma Categoria
  async function updateCategory(data: CategoryUpdate) {
    try {
      // O runAsync já prepara, executa e limpa a memória sozinho em uma linha!
      const result = await database.runAsync(
        'UPDATE categories SET name = ?, color = ?, image_url = ? WHERE id = ?',
        [data.name, data.color, data.imageUrl ?? null, data.id] // Os valores na ordem exata dos '?'
      );

      return result.changes; // Retorna o número de linhas alteradas (deve ser 1)
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async function removeCategory(id: number) {
    try {
      const result = await database.runAsync(
        `DELETE FROM categories WHERE id = ?`,
        [id]
      );
      return result.changes; // Útil para saber se realmente apagou algo
    } catch (error) {
      console.log('Erro ao deletar categoria:', error);
      throw error; // Repassa o erro para a tela tratar com um Alert amigável
    }
  }

  return { getAll, create, show, updateCategory, removeCategory };
}
