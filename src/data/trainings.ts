import { z } from 'zod'

const routineStepSchema = z.object({
  type: z.enum(['repetitions', 'failure']),
  value: z.string(),
  delay: z.number().default(30),
  weight: z.number().default(0),
})

const routineSerieSchema = z.object({
  id: z.string(),
  name: z.string(),
  group: z.string(),
  muscle: z.string(),
  steps: z.array(routineStepSchema),
})

const routineSchema = z.object({
  id: z.string(),
  name: z.string(),
  series: z.array(routineSerieSchema),
})

const trainingSchema = z.object({
  id: z.string(),
  name: z.string(),
  routines: z.array(routineSchema),
})

export async function getTrainings(supabase: App.Locals['supabase']): Promise<Types.Training[]> {
  const result = await supabase.from('training').select(`id, name, routines`)

  if (result.error) throw result.error

  const data = z.array(trainingSchema).parse(result.data)

  return data
}

export async function getTraining(
  supabase: App.Locals['supabase'],
  trainingId: string,
): Promise<Types.Training> {
  const result = await supabase.from('training').select(`id, name, routines`).eq('id', trainingId)

  if (result.error) throw result.error

  const item = trainingSchema.parse(result.data[0])

  if (!item) throw new Error('Not found')

  return item
}

export async function updateTraining(
  supabase: App.Locals['supabase'],
  training: Types.Training,
): Promise<void> {
  const result = await supabase.from('training').update(training)

  if (result.error) throw result.error
}
