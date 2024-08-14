// type State = { targets: NodeListOf<HTMLElement>; active: HTMLElement | undefined; index: number }

// const states = new Map<HTMLElement, State>()
// const isRtl = window.getComputedStyle(document.documentElement).direction === 'rtl'

// const KEYCODE = {
//   LEFT: 37,
//   UP: 38,
//   RIGHT: 39,
//   DOWN: 40,
// }

// // when container or children get focus
// function onFocusin(event: FocusEvent) {
//   console.log('onFocusin')
//   const rover = event.currentTarget as HTMLElement
//   if (states.get('last_rover') === rover) return
//   if (states.has(rover)) {
//     activate(rover, states.get(rover)?.active)
//     states.set('last_rover', rover)
//   }
//   console.log(Array.from(states.entries()))
// }

// function onKeydown(event: KeyboardEvent) {
//   const rover = event.currentTarget as HTMLElement

//   switch (event.keyCode) {
//     case KEYCODE[isRtl ? 'LEFT' : 'RIGHT']:
//     case KEYCODE.DOWN:
//       event.preventDefault()
//       focusNextItem(rover)
//       break
//     case KEYCODE[isRtl ? 'RIGHT' : 'LEFT']:
//     case KEYCODE.UP:
//       event.preventDefault()
//       focusPreviousItem(rover)
//       break
//   }
// }

// const mutationObserver = new MutationObserver((mutationList) => {
//   for (const mutation of mutationList) {
//     if (mutation.removedNodes.length === 0) continue

//     for (const removedEl of mutation.removedNodes) {
//       if (removedEl.nodeType !== 1) continue

//       console.log(states.entries())

//       states.forEach((state, element) => {
//         if (element === 'last_rover') return
//         if (removedEl.contains(element)) {
//           element.removeEventListener('focusin', onFocusin)
//           element.removeEventListener('keydown', onKeydown)

//           states.delete(element)
//           state.targets.forEach((a) => a.removeAttribute('tabindex'))

//           if (states.size === 0 || (states.size === 1 && states.has('last_rover'))) {
//             states.clear()
//             mutationObserver.disconnect()
//           }
//         }
//       })
//     }
//   }
// })

// export const rovingIndex = ({
//   element: rover,
//   target: selector,
// }: {
//   element: HTMLElement
//   target?: string
// }) => {
//   // this api allows empty or a query string
//   const target_query = selector || ':scope *'
//   const targets = rover.querySelectorAll<HTMLElement>(target_query)
//   const startingPoint = targets[0]

//   // take container out of the focus flow
//   rover.tabIndex = -1
//   // and all the children
//   targets.forEach((a) => (a.tabIndex = -1))
//   // except the first target, that accepts focus
//   if (startingPoint) startingPoint.tabIndex = 0

//   // with the roving container as the key
//   // save some state and handy references
//   states.set(rover, {
//     targets,
//     active: startingPoint,
//     index: 0,
//   })

//   rover.addEventListener('focusin', onFocusin)
//   // watch for arrow keys
//   rover.addEventListener('keydown', onKeydown)

//   mutationObserver.observe(document, {
//     childList: true,
//     subtree: true,
//   })
// }

// function focusNextItem(rover: HTMLElement) {
//   const state = states.get(rover)
//   if (!state) return

//   state.index += 1
//   if (state.index > state.targets.length - 1) state.index = state.targets.length - 1

//   const next = state.targets[state.index]
//   if (next) activate(rover, next)
// }

// function focusPreviousItem(rover: HTMLElement) {
//   const state = states.get(rover)
//   if (!state) return

//   state.index -= 1
//   if (state.index < 1) state.index = 0

//   const prev = state.targets[state.index]
//   if (prev) activate(rover, prev)
// }

// function activate(rover: HTMLElement, item: HTMLElement | undefined) {
//   const state = states.get(rover)
//   if (!state) return

//   if (state.active) state.active.tabIndex = -1

//   state.active = item

//   if (state.active) {
//     state.active.tabIndex = 0
//     state.active.focus()
//   }
// }
