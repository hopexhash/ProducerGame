import type { Equipment } from '../types'

export const EQUIPMENT: Equipment[] = [
  // starting gear is free-owned; upgrades below
  { id: 'laptop2', name: 'Better Laptop', category: 'Computer', cost: 900, tier: 1, bonuses: { production: 3 }, desc: 'No more crashes mid-session. +3 Production' },
  { id: 'interface1', name: 'Audio Interface', category: 'Interface', cost: 350, tier: 1, bonuses: { production: 2, mixing: 1 }, desc: 'Clean signal in and out. +2 Production, +1 Mixing' },
  { id: 'headphones2', name: 'Professional Headphones', category: 'Monitoring', cost: 450, tier: 1, bonuses: { mixing: 3 }, desc: 'Hear every detail. +3 Mixing' },
  { id: 'midi1', name: 'MIDI Keyboard', category: 'Instrument', cost: 300, tier: 1, bonuses: { songwriting: 3, creativity: 2 }, desc: 'Play your ideas. +3 Songwriting, +2 Creativity' },
  { id: 'monitors1', name: 'Studio Monitors', category: 'Monitoring', cost: 1200, tier: 2, bonuses: { mixing: 4 }, desc: 'Honest sound at last. +4 Mixing' },
  { id: 'acoustic1', name: 'Acoustic Treatment', category: 'Room', cost: 1800, tier: 2, bonuses: { mixing: 3, mastering: 3 }, desc: 'Tame the room. +3 Mixing, +3 Mastering' },
  { id: 'plugins1', name: 'Premium Plugin Bundle', category: 'Software', cost: 2200, tier: 2, bonuses: { production: 4, mastering: 2 }, desc: 'Industry-standard tools. +4 Production, +2 Mastering' },
  { id: 'monitors2', name: 'Professional Studio Monitors', category: 'Monitoring', cost: 3500, tier: 3, bonuses: { mixing: 5 }, desc: 'Reference-grade playback. +5 Mixing' },
  { id: 'mic1', name: 'Vocal Microphone', category: 'Recording', cost: 2800, tier: 3, bonuses: { production: 3, songwriting: 2 }, desc: 'Record world-class vocals. +3 Production, +2 Songwriting' },
  { id: 'synth1', name: 'Analog Synthesizer', category: 'Instrument', cost: 4500, tier: 3, bonuses: { songwriting: 4, creativity: 5 }, desc: 'Warm, living sound. +4 Songwriting, +5 Creativity' },
  { id: 'laptop3', name: 'Workstation Computer', category: 'Computer', cost: 6000, tier: 3, bonuses: { production: 5 }, desc: 'Unlimited track counts. +5 Production' },
  { id: 'desk1', name: 'Producer Desk Setup', category: 'Room', cost: 3200, tier: 3, bonuses: { production: 2, energyMax: 10 }, desc: 'Ergonomic flow. +2 Production, +10 Max Energy' },
  { id: 'outboard1', name: 'Analog Outboard Rack', category: 'Hardware', cost: 12000, tier: 4, bonuses: { mixing: 5, mastering: 5 }, desc: 'Hardware compression & EQ. +5 Mixing, +5 Mastering' },
  { id: 'monitors3', name: 'Main Monitor System', category: 'Monitoring', cost: 25000, tier: 4, bonuses: { mixing: 6, mastering: 4 }, desc: 'Full-range mains. +6 Mixing, +4 Mastering' },
  { id: 'studio1', name: 'Commercial Studio Space', category: 'Studio', cost: 80000, tier: 5, bonuses: { production: 6, mixing: 4, energyMax: 15, quality: 3 }, desc: 'A real studio with your name on it. +6 Production, +4 Mixing, +15 Max Energy, +3 Song Quality' },
  { id: 'studio2', name: 'Luxury Producer Studio', category: 'Studio', cost: 450000, tier: 6, bonuses: { production: 8, mixing: 6, mastering: 6, creativity: 10, energyMax: 25, quality: 6 }, desc: 'The studio legends record in. Massive bonuses to everything.' },
]

export const STUDIO_TIERS = [
  { name: 'Bedroom Studio', minSpent: 0 },
  { name: 'Home Studio', minSpent: 2000 },
  { name: 'Professional Home Studio', minSpent: 10000 },
  { name: 'Commercial Studio', minSpent: 80000 },
  { name: 'Luxury Producer Studio', minSpent: 450000 },
]
