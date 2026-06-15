import { useSQLiteContext } from 'expo-sqlite';

// O que o seu formulário de cadastro vai enviar
export type ProductCreate = {
  name: string;
  price: number;
  qtdEstoque: number;
  minEstoque: number;
  codBar?: string;
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
  minEstoque: number;
  qtdVendidos: number;
  codBar?: string;
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
        (name, price, quantity, min_stock, barcode, color, image_url, category_id)
      VALUES
        ($name, $price, $quantity, $min_stock, $barcode, $color, $image_url, $category_id)
    `);

    try {
      const result = await statement.executeAsync({
        $name: data.name,
        $price: data.price,
        $quantity: data.qtdEstoque,
        $min_stock: data.minEstoque,
        $barcode: data.codBar || null,
        $color: data.color,
        $image_url: data.imageUrl || null,
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
        p.min_stock AS minEstoque,
        0 AS qtdVendidos,
        p.barcode AS codBar,       
        p.color,
        p.image_url AS imageUrl,
        p.category_id,
        c.name AS category_name,
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
          p.id, 
          p.name,
          p.price,
          p.quantity AS qtdEstoque,
          p.min_stock AS minEstoque,
          COALESCE(
            (SELECT SUM(ti.quantity)
             FROM transaction_items ti
             INNER JOIN transactions t ON t.id = ti.transaction_id
             WHERE ti.product_id = p.id AND t.type = 'sale'),
            0
          ) AS qtdVendidos,
          p.barcode AS codBar,       
          p.color,
          p.image_url AS imageUrl,
          p.category_id,
          c.name AS category_name,   
          p.created_at
        FROM products p
        INNER JOIN categories c ON c.id = p.category_id -- <-- Adicionado para dar suporte ao category_name
        WHERE p.category_id = ?
        ORDER BY p.created_at ASC
      `;

      const response = await database.getAllAsync<ProductResponse>(query, [
        categoryID
      ]);

      return response;
    } catch (error) {
      console.log('Erro ao buscar lista de produtos por categoria:', error);
      throw error;
    }
  }

  // Listar um Produto Específico pelo ID
  async function show(id: number) {
    try {
      const query = `
        SELECT 
          p.id,
          p.name,
          p.price,
          p.quantity AS qtdEstoque,
          p.min_stock AS minEstoque,
          0 AS qtdVendidos,          -- Fixado em 0 por enquanto
          p.barcode AS codBar,
          p.color,
          p.image_url AS imageUrl,
          p.category_id,
          c.name AS category_name,   -- Traz o nome da categoria associada
          p.created_at
        FROM products p
        INNER JOIN categories c ON c.id = p.category_id
        WHERE p.id = ?
      `;

      const response = await database.getFirstAsync<ProductResponse>(query, [
        id
      ]);
      return response; // Retorna o objeto do produto encontrado ou null se não existir
    } catch (error) {
      console.log(`Erro ao buscar o produto com ID ${id}:`, error);
      throw error;
    }
  }

  // buscar Todos os Produtos com ou sem filtro
  async function searchAll(text: string) {
    try {
      const query = `
        SELECT 
          p.id,
          p.name,
          p.price,
          p.quantity AS qtdEstoque,
          p.min_stock AS minEstoque,
          COALESCE(
            (SELECT SUM(ti.quantity)
             FROM transaction_items ti
             INNER JOIN transactions t ON t.id = ti.transaction_id
             WHERE ti.product_id = p.id AND t.type = 'sale'),
            0
          ) AS qtdVendidos,
          p.barcode AS codBar,       
          p.color,
          p.image_url AS imageUrl,
          p.category_id,
          c.name AS category_name,
          p.created_at
        FROM products p
        INNER JOIN categories c ON c.id = p.category_id

        -- O Filtro : Procura por nome ou código de barras
        WHERE P.name LIKE ? OR p.barcode LIKE ?

        ORDER BY c.name ASC, p.name ASC
      `;

      // O '%' serve para o SQL entender que o texto pode estar em qualquer parte da palavra
      const searchTerm = `%${text}%`;

      const response = await database.getAllAsync<ProductResponse>(query, [
        searchTerm,
        searchTerm
      ]);

      return response;
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
          min_stock = ?, 
          barcode = ?, 
          color = ?, 
          image_url = ?, 
          category_id = ?
        WHERE id = ?
      `,
        [
          data.name,
          data.price,
          data.qtdEstoque,
          data.minEstoque,
          data.codBar || null,
          data.color,
          data.imageUrl || null,
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
      return result.changes;
    } catch (error) {
      console.log('Erro ao deletar produto:', error);
      throw error;
    }
  }

  return {
    getAll,
    getByCategory,
    show,
    create,
    searchAll,
    updateProduct,
    removeProduct
  };
}
