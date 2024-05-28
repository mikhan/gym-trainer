import pechoImage from './images/pecho.webp'
import espaldaImage from './images/espalda.webp'
import hombroImage from './images/hombro.webp'
import bicepsImage from './images/biceps.webp'
import tricepsImage from './images/triceps.webp'
import piernasImage from './images/piernas.webp'
import abdomenImage from './images/abdomen.webp'

export type MuscleGroup = {
  id: string
  name: string
  color: { hue: string }
  image: { src: string }
}

export type Muscle = {
  id: string
  name: string
}

export function getMuscles() {
  return [
    { id: 'bicep', name: 'Bícep' },
    { id: 'tricep', name: 'Trícep' },
    { id: 'pantorrilla', name: 'Pantorrilla' },
    { id: 'cuadricep', name: 'Cuádricep' },
    { id: 'femoral', name: 'Femoral' },
    { id: 'abdomen', name: 'Abdomen' },
    { id: 'pecho', name: 'Pecho' },
    { id: 'hombro', name: 'Hombro' },
    { id: 'espalda', name: 'Espalda' },
  ]
}

export function getMuscleGroups(): MuscleGroup[] {
  return [
    {
      id: 'pecho',
      name: 'Pecho',
      color: { hue: '0' },
      image: { src: pechoImage },
    },
    {
      id: 'espalda',
      name: 'Espalda',
      color: { hue: '45' },
      image: { src: espaldaImage },
    },
    {
      id: 'hombro',
      name: 'Hombro',
      color: { hue: '90' },
      image: { src: hombroImage },
    },
    {
      id: 'bicep',
      name: 'Bícep',
      color: { hue: '135' },
      image: { src: bicepsImage },
    },
    {
      id: 'tricep',
      name: 'Trícep',
      color: { hue: '180' },
      image: { src: tricepsImage },
    },
    {
      id: 'pierna',
      name: 'Pierna',
      color: { hue: '225' },
      image: { src: piernasImage },
    },
    {
      id: 'abdomen',
      name: 'Abdomen',
      color: { hue: '270' },
      image: { src: abdomenImage },
    },
  ]
}
