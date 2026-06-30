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

type UserData = {
  name: string;
  image: string | null;
  color: string | null;
};

type AuthState = {
  user: UserData | null;
  isLoggedIn: boolean;
  loading: boolean;
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
};

export const AuthContext = createContext<AuthState>({} as AuthState);

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const router = useRouter();
  const { saveUserData, getUserData, clearUserData } = userStorage();

  useEffect(() => {
    async function loadStoredData() {
      try {
        const storedUser = await getUserData();
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
      value={{ user, isLoggedIn, loading, updateUser, loggedIn, loggedOut }}
    >
      {children}
    </AuthContext.Provider>
  );
}
