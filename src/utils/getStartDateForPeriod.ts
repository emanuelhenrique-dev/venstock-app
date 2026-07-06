import { PeriodType } from '@/app/statistics-view';

// Calcula a data de início do filtro para usar no banco de dados
export function getStartDateForPeriod(period: PeriodType): Date | null {
  const now = new Date();
  switch (period) {
    case '7days':
      return new Date(now.setDate(now.getDate() - 7));
    case '14days':
      return new Date(now.setDate(now.getDate() - 14));
    case '30days':
      return new Date(now.setDate(now.getDate() - 30));
    case '2months':
      return new Date(now.setMonth(now.getMonth() - 2));
    case '6months':
      return new Date(now.setMonth(now.getMonth() - 6));
    case '1year':
      return new Date(now.setFullYear(now.getFullYear() - 1));
    case 'all':
      return null;
    default:
      return new Date(now.setDate(now.getDate() - 30));
  }
}
