import type { Weather } from '@/lib/types'

export const WEATHER: Record<'morning' | 'evening', Weather> = {
  morning: { temp: '11°C', condition: 'Overcast', note: 'Rain expected this afternoon' },
  evening: { temp: '13°C', condition: 'Clearing up', note: 'Rain earlier has cleared' },
}
