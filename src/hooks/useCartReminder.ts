import { useEffect, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { useCartStore } from '@/store/useCartStore';
import { useProductDatabase } from '@/database/useProductDatabase';
import { localNotificationService } from '@/services/local-notifications.service';

export function useCartReminder() {
  const appState = useRef(AppState.currentState);
  const productDatabase = useProductDatabase();

  //funciona como uma "caixa" onde guardamos um valor que não pode ser perdido quando o ecrã muda de estado (re-renderiza).
  const handleAppStateChangeRef =
    useRef<(nextAppState: AppStateStatus) => Promise<void>>(null);

  // Atualiza a lógica do Ref a cada renderização
  handleAppStateChangeRef.current = async (nextAppState: AppStateStatus) => {
    // 🚪 USUÁRIO MINIMIZOU O APP
    if (appState.current.match(/active/) && nextAppState === 'background') {
      const cartItems = useCartStore.getState().items;

      if (cartItems.length > 0) {
        try {
          const firstItem = cartItems[0];
          const allProducts = await productDatabase.getAll();
          const productData = allProducts.find(
            (p) => String(p.id) === String(firstItem.productId)
          );

          const productName = productData ? productData.name : 'Produto';
          const extraItemsCount = cartItems.length - 1;

          await localNotificationService.scheduleCartReminder({
            productName,
            quantity: extraItemsCount,
            delayMinutes: 15
          });

          console.log('⏰ Lembrete de carrinho agendado!');
        } catch (error) {
          console.log('Erro ao agendar notificação:', error);
        }
      }
    }

    // 🏡 USUÁRIO VOLTOU PARA O APP
    if (
      appState.current.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      await localNotificationService.cancelCartReminder();
      console.log('❌ Lembrete antigo cancelado porque o usuário voltou.');
    }

    appState.current = nextAppState;
  };

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (handleAppStateChangeRef.current) {
        handleAppStateChangeRef.current(nextAppState);
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);
}
