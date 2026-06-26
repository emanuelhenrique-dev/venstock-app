import { CartItemDetailed } from '@/app/(dashboard)/cart';
import { localNotificationService } from './local-notifications.service';
import { ProductResponse } from '@/database/useProductDatabase';

async function checkAndTriggerStockAlerts(
  cartWithDetails: CartItemDetailed[],
  productsAfterTransaction: ProductResponse[]
) {
  try {
    for (const cartItem of cartWithDetails) {
      const updatedProduct = productsAfterTransaction.find(
        (p) => String(p.id) === String(cartItem.product.id)
      );

      if (updatedProduct) {
        const currentQty = updatedProduct.qtdEstoque;
        const minStock = updatedProduct.minEstoque;
        const previousQty = cartItem.product.qtdEstoque;

        // Regra: Só avisa se ele estava ACIMA do mínimo e AGORA caiu para igual ou abaixo
        if (previousQty > minStock && currentQty <= minStock) {
          await localNotificationService.scheduleLowStockAlert({
            productName: updatedProduct.name,
            currentQuantity: currentQty
          });
        }
      }
    }

    // Calcula o total geral de produtos em baixa para atualizar o lembrete periódico
    const lowStockCount = productsAfterTransaction.filter(
      (p) => p.qtdEstoque <= p.minEstoque
    ).length;

    if (lowStockCount > 0) {
      await localNotificationService.updateLowStockReminder({
        totalItems: lowStockCount
      });
    }
  } catch (error) {
    console.error('Erro ao processar notificações de estoque:', error);
  }
}

export const stockAlertsService = {
  checkAndTriggerStockAlerts
};
