import { AuthContext } from '@/context/AuthContext';
import { useContext } from 'react';

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context || Object.keys(context).length === 0) {
    throw new Error('useAuth deve ser utilizado dentro de um AuthProvider');
  }

  return context;
}
