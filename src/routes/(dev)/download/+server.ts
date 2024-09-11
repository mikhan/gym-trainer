import { json } from '@sveltejs/kit'
import type { RequestHandler } from './$types'
import ejercicios from './ejercicios.json'

// import musculos from './musculos.json'
// import http from 'https'
// import fs from 'fs'

// function save(url: string) {
//   return new Promise<void>((resolve) => {
//     const filename = `static/images/exercises/${url.match(/[^/]+$/)?.[0] ?? ''}`
//     const file = fs.createWriteStream(filename)
//     console.log(`Save to ${filename}`)
//     http.get(url, (response) => {
//       response.pipe(file)
//       file.on('finish', () => {
//         console.log('Completed!')
//         file.close()
//         resolve()
//       })
//     })
//   })
// }

// export const GET: RequestHandler = async () => {
//   for (const [index, ejercicio] of Object.entries(ejercicios)) {
//     console.log(`>> ${parseInt(index) + 1} of ${ejercicios.length}`)
//     await save(ejercicio.url_img)
//   }
// }

export const GET: RequestHandler = async () => {
  // for (const [index, ejercicio] of Object.entries(ejercicios)) {
  //   console.log(`Insert id: ${index}`)
  //   const { error } = await locals.supabase.from('exercise').insert(ejercicio)

  //   if (error) {
  //     console.log(error)
  //     break
  //   }
  // }

  return json(ejercicios)
}

// export const GET: RequestHandler = async ({ locals }) => {
//   for (const muscle of musculos) {
//     console.log(`Insert id: ${muscle.id}`)
//     const { error } = await locals.supabase.from('muscle').insert(muscle)
//     if (error) {
//       console.log(error)
//       break
//     }
//   }

//   return json(musculos)
// }
