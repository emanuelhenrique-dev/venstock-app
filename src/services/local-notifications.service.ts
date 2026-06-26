import * as Notifications from 'expo-notifications';
import { Alert, Platform } from 'react-native';

const DEFAULT_CHANNEL = 'default';

const NOTIFICATION_IDS = {
  CART_REMINDER: 'cart-reminder',
  LOW_STOCK: 'low-stock'
};

const DEEP_LINK = 'venstock://';

// Configura como as notificações se comportam com o app ABERTO
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldShowBanner: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowList: true
  })
});

const setupNotificationChannel = async () => {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync(DEFAULT_CHANNEL, {
      name: 'Notificações do Venstock',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C'
    });
  }
};

// permissão
const registerForPushNotifications = async () => {
  await setupNotificationChannel();

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    Alert.alert(
      'Aviso',
      'As notificações estão desativadas. Você pode ativá-las nas configurações do celular para receber alertas importantes.'
    );
    return false;
  }

  return true;
};

interface ScheduleCartReminderInterface {
  productName: string;
  quantity: number;
  delayMinutes: number;
}

const scheduleCartReminder = async ({
  productName,
  quantity,
  delayMinutes
}: ScheduleCartReminderInterface) => {
  // Cancela o lembrete anterior para não acumular
  await Notifications.cancelScheduledNotificationAsync(
    NOTIFICATION_IDS.CART_REMINDER
  );

  // Monta o texto dependendo de quantos itens adicionais existem
  let notificationBody = `"${productName}" está no carrinho. Volte para finalizar!`;

  if (quantity === 1) {
    notificationBody = `"${productName}" e mais 1 item estão no carrinho. Volte para finalizar!`;
  } else if (quantity > 1) {
    notificationBody = `"${productName}" e mais ${quantity} itens estão no carrinho. Volte para finalizar!`;
  }

  const notification = await Notifications.scheduleNotificationAsync({
    identifier: NOTIFICATION_IDS.CART_REMINDER,
    content: {
      title: '🛒 Existem items no seu carrinho!',
      body: notificationBody,
      data: {
        type: 'cart_reminder',
        deepLink: `${DEEP_LINK}cart`
      },
      sound: true
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: delayMinutes * 60,
      repeats: false
    }
  });

  return notification;
};

// Cancela o lembrete (quando ele esvaziar ou finalizar o carrinho)
const cancelCartReminder = async () => {
  await Notifications.cancelScheduledNotificationAsync(
    NOTIFICATION_IDS.CART_REMINDER
  );
};

// interface para o Alerta de Estoque Baixo
interface ScheduleLowStockInterface {
  productName: string;
  currentQuantity: number;
}

const scheduleLowStockAlert = async ({
  productName,
  currentQuantity
}: ScheduleLowStockInterface) => {
  const notification = await Notifications.scheduleNotificationAsync({
    // Não passamos 'identifier' fixo aqui para que, se 2 produtos acabarem, apareçam 2 notificações separadas
    content: {
      title: '⚠️ Atenção: Estoque Baixo!',
      body: `O produto "${productName}" atingiu o limite mínimo. Restam apenas ${currentQuantity} unidades.`,
      data: {
        type: 'low_stock_alert',
        deepLink: `${DEEP_LINK}?triggerLowStock=true` // Passa o parâmetro na URL do Deep Link
      },
      sound: true
    },
    trigger: null // Dispara imediatamente
  });

  return notification;
};

interface ScheduleLowStockReminderInterface {
  totalItems: number;
  delayHours?: number;
}

// 🌟 Função unificada para gerenciar o estado do lembrete periódico
const updateLowStockReminder = async ({
  totalItems,
  delayHours = 24
}: ScheduleLowStockReminderInterface) => {
  try {
    // Se não houver mais nenhum item com estoque baixo, cancela o lembrete automaticamente
    if (totalItems <= 0) {
      await cancelLowStockReminder();
      return;
    }

    // Se houver itens, reagenda/atualiza o lembrete periódico
    const notificationBody =
      totalItems === 1
        ? `1 produto está acabando! Reponha o estoque para não perder vendas.`
        : `${totalItems} produtos estão acabando! Reponha o estoque para não perder vendas.`;

    await Notifications.scheduleNotificationAsync({
      identifier: NOTIFICATION_IDS.LOW_STOCK,
      content: {
        title: '📦 Lembrete de Reposição',
        body: notificationBody,
        data: {
          type: 'low_stock_reminder',
          deepLink: `${DEEP_LINK}?triggerLowStock=true`
        },
        sound: true
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: delayHours * 3600, // Transforma horas em segundos
        repeats: true // Repete no intervalo definido
      }
    });
  } catch (error) {
    console.error('Erro ao atualizar o lembrete de estoque baixo:', error);
  }
};

// Cancela o lembrete (quando ele esvaziar ou finalizar o carrinho)
const cancelLowStockReminder = async () => {
  await Notifications.cancelScheduledNotificationAsync(
    NOTIFICATION_IDS.LOW_STOCK
  );
};

export const localNotificationService = {
  registerForPushNotifications,
  scheduleCartReminder,
  cancelCartReminder,
  scheduleLowStockAlert,
  updateLowStockReminder,
  cancelLowStockReminder
};
