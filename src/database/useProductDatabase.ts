import { useSQLiteContext } from 'expo-sqlite';

// O que o seu formulário de cadastro vai enviar
export type ProductCreate = {
  name: string;
  price: number;
  qtdEstoque: number;
  color: string; // Obrigatório para o produto agora
  imageUrl?: string; // Opcional
  category_id: number;
};

export type ProductUpdate = ProductCreate & {
  id: number;
};

export type ProductResponse = {
  id: number;
  name: string;
  price: number;
  qtdEstoque: number;
  qtdVendidos: number;
  color: string;
  imageUrl?: string | null; // Pode vir nulo do banco se não tiver foto
  category_id: number;
  category_name: string;
  created_at: string;
};

export function useProductDatabase() {
  const database = useSQLiteContext();

  // Função para cadastrar um Produto
  async function create(data: ProductCreate) {
    const statement = await database.prepareAsync(`
      INSERT INTO products 
        (name, price, quantity, color, image_url, category_id)
      VALUES
        ($name, $price, $quantity, $color, $image_url, $category_id)
    `);

    try {
      const result = await statement.executeAsync({
        $name: data.name,
        $price: data.price,
        $quantity: data.qtdEstoque,
        $color: data.color,
        $image_url: data.imageUrl ?? null,
        $category_id: data.category_id
      });

      return { insertId: result.lastInsertRowId };
    } catch (error) {
      console.log('Erro ao criar produto:', error);
      throw error;
    } finally {
      await statement.finalizeAsync();
    }
  }

  // Listar Todos os Produtos
  async function getAll() {
    try {
      const query = `
      SELECT 
        p.id,
        p.name,
        p.price,
        p.quantity AS qtdEstoque,
        0 AS qtdVendidos,
        p.color,
        p.image_url AS imageUrl,
        p.category_id,
        c.name AS category_name, -- <-- Pega o nome da categoria!
        p.created_at
      FROM products p
      INNER JOIN categories c ON c.id = p.category_id
      ORDER BY c.name ASC, p.name ASC
    `;
      const response = await database.getAllAsync<ProductResponse>(query);
      return response;
    } catch (error) {
      console.log('Erro ao buscar lista de produtos:', error);
      throw error;
    }
  }

  // Listar Produtos de uma Categoria Específica
  async function getByCategory(categoryID: number) {
    try {
      const query = `
      SELECT
        id, 
        name,
        price,
        quantity AS qtdEstoque,
        0 AS qtdVendidos,
        color,
        image_url AS imageUrl,
        category_id,
        created_at
      FROM products
      WHERE category_id = ?
      ORDER BY created_at ASC
      `;

      const response = await database.getAllAsync<ProductResponse>(query, [
        categoryID
      ]);
    } catch (error) {
      console.log('Erro ao buscar lista de produtos:', error);
      throw error;
    }
  }

  // Atualizar Produto
  async function updateProduct(data: ProductUpdate) {
    try {
      const result = await database.runAsync(
        `
        UPDATE products SET
          name = ?,
          price = ?,
          quantity = ?,
          color = ?,
          image_url = ?,
          category_id = ?
        WHERE id = ?
      `,
        [
          data.name,
          data.price,
          data.qtdEstoque,
          data.color,
          data.imageUrl ?? null,
          data.category_id,
          data.id
        ]
      );

      return result.changes;
    } catch (error) {
      console.log('Erro ao atualizar produto:', error);
      throw error;
    }
  }

  // Remover Produto
  async function removeProduct(id: number) {
    try {
      const result = await database.runAsync(
        `
        DELETE FROM products
        WHERE id = ?
      `,
        [id]
      );
    } catch (error) {
      console.log('Erro ao deletar produto:', error);
      throw error;
    }
  }

  return { getAll, getByCategory, create, updateProduct, removeProduct };
}
