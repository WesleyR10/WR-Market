import {
  addDays,
  addHours,
  addMinutes,
  differenceInDays,
  differenceInMinutes,
  endOfDay,
  formatISO,
  getDay,
  isAfter,
  isBefore,
  isPast,
  isToday,
  parseISO,
  startOfDay,
} from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { formatInTimeZone, fromZonedTime, toZonedTime } from 'date-fns-tz'

const TIMEZONE = 'America/Sao_Paulo'

export const dateUtils = {
  // Funções básicas de conversão
  toDate(date: Date | string | number): Date {
    return date instanceof Date ? date : parseISO(String(date))
  },

  // Formatação com timezone
  format(date: Date | string | number, pattern: string): string {
    return formatInTimeZone(this.toDate(date), TIMEZONE, pattern, {
      locale: ptBR,
    })
  },

  // Formatação para display padrão
  formatDisplay(date: Date | string | number): string {
    return this.format(date, "dd/MM/yyyy 'às' HH:mm")
  },

  // Conversão para ISO com timezone
  toISO(date: Date | string | number): string {
    const zonedDate = fromZonedTime(this.toDate(date), TIMEZONE)
    return formatISO(zonedDate)
  },

  // Funções de adição
  addDays(date: Date | string | number, amount: number): Date {
    return addDays(this.toDate(date), amount)
  },

  addHours(date: Date | string | number, amount: number): Date {
    return addHours(this.toDate(date), amount)
  },

  addMinutes(date: Date | string | number, amount: number): Date {
    return addMinutes(this.toDate(date), amount)
  },

  // Funções de verificação
  isPast(date: Date | string | number): boolean {
    return isPast(this.toDate(date))
  },

  isAfter(
    date: Date | string | number,
    dateToCompare: Date | string | number,
  ): boolean {
    return isAfter(this.toDate(date), this.toDate(dateToCompare))
  },

  isBefore(
    date: Date | string | number,
    dateToCompare: Date | string | number,
  ): boolean {
    return isBefore(this.toDate(date), this.toDate(dateToCompare))
  },

  isToday(date: Date | string | number): boolean {
    return isToday(this.toDate(date))
  },

  // Funções de início/fim do dia
  startOfDay(date: Date | string | number): Date {
    return startOfDay(this.toDate(date))
  },

  endOfDay(date: Date | string | number): Date {
    return endOfDay(this.toDate(date))
  },

  // Funções de diferença
  differenceInDays(
    dateLeft: Date | string | number,
    dateRight: Date | string | number,
  ): number {
    return differenceInDays(this.toDate(dateLeft), this.toDate(dateRight))
  },

  differenceInMinutes(
    dateLeft: Date | string | number,
    dateRight: Date | string | number,
  ): number {
    return differenceInMinutes(this.toDate(dateLeft), this.toDate(dateRight))
  },

  // Funções de dia da semana
  getDayOfWeek(date: Date | string | number): string {
    const days = [
      'domingo',
      'segunda',
      'terça',
      'quarta',
      'quinta',
      'sexta',
      'sábado',
    ]
    return days[getDay(this.toDate(date))]
  },

  // Funções de ajuste de timezone
  adjustToTimezone(date: Date | string | number): Date {
    return fromZonedTime(this.toDate(date), TIMEZONE)
  },

  fromTimezone(date: Date | string | number): Date {
    return toZonedTime(this.toDate(date), TIMEZONE)
  },
}
