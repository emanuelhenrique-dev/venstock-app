import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  PropsWithChildren
} from 'react';
import { userStorage } from '@/database/userStorage';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { localNotificationService } from '@/services/local-notifications.service';

type UserData = {
  name: string;
  image: string | null;
  color: string | null;
};

type AuthState = {
  user: UserData | null;
  isLoggedIn: boolean;
  loading: boolean;
  notificationsEnabled: boolean;
  updateUser: (
    name: string,
    image: string | null,
    color: string
  ) => Promise<void>;
  loggedIn: (
    name: string,
    image: string | null,
    color: string
  ) => Promise<void>;
  loggedOut: () => Promise<void>;
  toggleNotifications: (enabled: boolean) => Promise<void>;
};

export const AuthContext = createContext<AuthState>({} as AuthState);

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const router = useRouter();
  const { saveUserData, getUserData, clearUserData } = userStorage();

  useEffect(() => {
    async function loadStoredData() {
      try {
        const storedUser = await getUserData();

        //Carrega a preferência de notificação salva (padrão 'true' se não existir)
        const storedNotifications = await AsyncStorage.getItem(
          '@venstock:notifications'
        );
        setNotificationsEnabled(storedNotifications !== 'false');

        if (storedUser && storedUser.name) {
          setUser({
            name: storedUser.name ?? 'Usuário desconhecido',
            image: storedUser.image ?? null,
            color: storedUser.color ?? null
          });
          setIsLoggedIn(true);
        }
      } catch (error) {
        console.log('Erro ao carregar dados de autenticação:', error);
      } finally {
        setLoading(false); // Libera o app após checar
      }
    }
    loadStoredData();
  }, []);

  async function updateUser(name: string, image: string | null, color: string) {
    // Atualiza no banco local físico do aparelho
    await saveUserData(name, image, color);

    setUser({ name, image, color });
  }

  async function toggleNotifications(enabled: boolean) {
    setNotificationsEnabled(enabled);
    await AsyncStorage.setItem('@venstock:notifications', String(enabled));

    console.log(`Notificações ${enabled ? 'ativadas' : 'desativadas'}`);
    // Se o usuário desativou, você já pode cancelar os agendamentos imediatamente!
    if (!enabled) {
      await localNotificationService.cancelAllNotifications();
    }
  }

  async function loggedIn(name: string, image: string | null, color: string) {
    await saveUserData(name, image, color);
    setUser({ name, image, color });
    setIsLoggedIn(true);

    router.replace('/(dashboard)');
  }

  async function loggedOut() {
    await clearUserData();
    setUser(null);
    setIsLoggedIn(false);

    router.replace('/logIn');
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn,
        loading,
        notificationsEnabled,
        toggleNotifications,
        updateUser,
        loggedIn,
        loggedOut
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
