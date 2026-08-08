import type { Genre } from '../types'

export const GENRES: Genre[] = [
  'Afro House', 'Tech House', 'Deep House', 'Melodic Techno',
  'Hip-Hop', 'Trap', 'Drum & Bass', 'Pop',
  'Amapiano', 'Phonk', 'R&B', 'EDM',
]

/** Baseline audience size per genre (relative). */
export const GENRE_BASE: Record<Genre, number> = {
  'Afro House': 1.15,
  'Tech House': 1.0,
  'Deep House': 0.9,
  'Melodic Techno': 1.05,
  'Hip-Hop': 1.3,
  'Trap': 1.1,
  'Drum & Bass': 0.85,
  'Pop': 1.35,
  'Amapiano': 0.95,
  'Phonk': 1.0,
  'R&B': 1.05,
  'EDM': 1.2,
}

export const KEYS = [
  'C Maj', 'G Maj', 'D Maj', 'A Maj', 'E Maj', 'F Maj', 'Bb Maj',
  'A Min', 'E Min', 'B Min', 'F# Min', 'C# Min', 'D Min', 'G Min', 'C Min',
]

export const BPM_RANGES: Record<Genre, [number, number]> = {
  'Afro House': [118, 126],
  'Tech House': [124, 130],
  'Deep House': [118, 124],
  'Melodic Techno': [120, 128],
  'Hip-Hop': [80, 100],
  'Trap': [130, 160],
  'Drum & Bass': [170, 178],
  'Pop': [95, 125],
  'Amapiano': [110, 118],
  'Phonk': [130, 150],
  'R&B': [70, 95],
  'EDM': [126, 132],
}

export const COUNTRIES = [
  'United States', 'Netherlands', 'Germany', 'United Kingdom', 'France',
  'Turkey', 'Brazil', 'Spain', 'Australia', 'Italy',
]
