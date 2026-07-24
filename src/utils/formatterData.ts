import {
  format,
  isToday,
  differenceInMinutes,
  formatDistanceToNow,
  parseISO
} from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function parseDatabaseDate(createdAt: Date | string): Date {
  if (typeof createdAt === 'string') {
    const utcString =
      createdAt.includes('Z') || /[+-]\d{2}:\d{2}$/.test(createdAt)
        ? createdAt
        : createdAt.replace(' ', 'T') + 'Z';

    return parseISO(utcString);
  }

  return createdAt;
}

/**
 * Formata a data de forma inteligente para o extrato do caixa:
 * - Menos de 1 hora: "há 5 minutos", "há menos de um minuto"
 * - Hoje (mais de 1h): "Hoje às 14:35"
 * - Outro dia: "29 Fevereiro, 12:30"
 */
export function formatProjectDate(createdAt: Date | string): string {
  const dateParam = parseDatabaseDate(createdAt);
  const now = new Date();

  // 1. Calcula a diferença em minutos entre agora e a criação da transação
  const minutesAgo = differenceInMinutes(now, dateParam);

  // 2. Se foi há menos de 60 minutos (1 hora), mostra o tempo relativo exato
  if (minutesAgo < 60) {
    return formatDistanceToNow(dateParam, { locale: ptBR, addSuffix: true });
  }

  // 3. Se passou de 1 hora, mas ainda é HOJE: "Hoje às 14:35"
  if (isToday(dateParam)) {
    return `Hoje às ${format(dateParam, 'p', { locale: ptBR })}`;
  }

  // 4. Se for outro dia: "29 Fevereiro, 12:30"
  // (Dica: Se quiser com o 'de', mude para "d 'de' MMMM, p")
  return format(dateParam, "d 'de' MMMM, p", { locale: ptBR });
}
