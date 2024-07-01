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
      image: { src: '/muscle-groups/pecho.webp' },
    },
    {
      id: 'espalda',
      name: 'Espalda',
      color: { hue: '45' },
      image: { src: '/muscle-groups/espalda.webp' },
    },
    {
      id: 'hombro',
      name: 'Hombro',
      color: { hue: '90' },
      image: { src: '/muscle-groups/hombro.webp' },
    },
    {
      id: 'bicep',
      name: 'Bícep',
      color: { hue: '135' },
      image: { src: '/muscle-groups/biceps.webp' },
    },
    {
      id: 'tricep',
      name: 'Trícep',
      color: { hue: '180' },
      image: { src: '/muscle-groups/triceps.webp' },
    },
    {
      id: 'pierna',
      name: 'Pierna',
      color: { hue: '225' },
      image: { src: '/muscle-groups/piernas.webp' },
    },
    {
      id: 'cuadricep',
      name: 'Cuadrícep',
      color: { hue: '225' },
      image: { src: '/muscle-groups/piernas.webp' },
    },
    {
      id: 'femoral',
      name: 'Femoral',
      color: { hue: '225' },
      image: { src: '/muscle-groups/piernas.webp' },
    },
    {
      id: 'pantorrilla',
      name: 'Pantorrilla',
      color: { hue: '225' },
      image: { src: '/muscle-groups/piernas.webp' },
    },
    {
      id: 'abdomen',
      name: 'Abdomen',
      color: { hue: '270' },
      image: { src: '/muscle-groups/abdomen.webp' },
    },
  ]
}
