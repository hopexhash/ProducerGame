import type { Plugin } from '../types'

export const PLUGINS: Plugin[] = [
  { id: 'quantumEq', name: 'Quantum EQ', cost: 149, bonuses: { mixing: 3 }, desc: 'Surgical frequency control. +3 Mixing' },
  { id: 'infinityComp', name: 'Infinity Compressor', cost: 199, bonuses: { mixing: 2, mastering: 2 }, desc: 'Glue for days. +2 Mixing, +2 Mastering' },
  { id: 'novaReverb', name: 'Nova Reverb', cost: 179, bonuses: { creativity: 4 }, desc: 'Spaces that inspire. +4 Creativity' },
  { id: 'titanSynth', name: 'Titan Synth', cost: 299, bonuses: { production: 4, songwriting: 2 }, desc: 'A wall of sound. +4 Production, +2 Songwriting' },
  { id: 'pulseDrums', name: 'Pulse Drums', cost: 129, bonuses: { production: 3 }, desc: 'Drums that knock. +3 Production' },
  { id: 'crystalLimiter', name: 'Crystal Limiter', cost: 249, bonuses: { mastering: 5 }, desc: 'Loud and transparent. +5 Mastering' },
  { id: 'vocalLab', name: 'VocalLab', cost: 349, bonuses: { production: 3, songwriting: 3 }, desc: 'Radio-ready vocal chains. +3 Production, +3 Songwriting' },
  { id: 'bassForge', name: 'BassForge', cost: 219, bonuses: { production: 4 }, desc: 'Low-end that translates. +4 Production' },
  { id: 'analogDreams', name: 'Analog Dreams', cost: 399, bonuses: { creativity: 5, mixing: 2 }, desc: 'Vintage warmth suite. +5 Creativity, +2 Mixing' },
  { id: 'auroraDelay', name: 'Aurora Delay', cost: 159, bonuses: { creativity: 3, songwriting: 1 }, desc: 'Rhythmic echo engine. +3 Creativity, +1 Songwriting' },
  { id: 'gravitySat', name: 'Gravity Saturator', cost: 189, bonuses: { mixing: 2, mastering: 3 }, desc: 'Harmonic weight. +2 Mixing, +3 Mastering' },
  { id: 'prismStereo', name: 'Prism Imager', cost: 139, bonuses: { mastering: 3 }, desc: 'Width without phase issues. +3 Mastering' },
]
