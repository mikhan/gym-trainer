import type { Action } from 'svelte/action'

export interface SortEvent extends CustomEvent {
  detail: {
    elements: HTMLElement[]
  }
}

type ActionAttributes = {
  onsortstart: (event: SortEvent) => void
  onsortend: (event: SortEvent) => void
}

export const sortlist: Action<HTMLElement, string, ActionAttributes> = (element, sortlistName) => {
  element.addEventListener('dragstart', ondragstart)
  element.dataset.sortlist = sortlistName

  // Create indicator
  const indicator = createIndicator()

  return {
    destroy() {
      element.removeEventListener('dragstart', ondragstart)
    },
  }

  function ondragstart(event: DragEvent) {
    const handler = event.target as HTMLElement
    const closestDraggedElement = handler.closest<HTMLElement>(
      `[data-sortlist="${sortlistName}"] > *`,
    )

    if (!closestDraggedElement) return

    const draggedElement = closestDraggedElement
    const originalParent = element as HTMLElement
    let currentParent: HTMLElement = originalParent
    let dragCompleted = false
    let relation: ItemRelation<HTMLElement> | null = null

    // Configure dataTransfer
    if (event.dataTransfer) configureDataTransfer(event.dataTransfer)

    draggedElement.toggleAttribute('data-dragging', true)

    const elements = [...getDraggableElements(currentParent, sortlistName)]
    const sortstartEvent: SortEvent = new CustomEvent('sortstart', { detail: { elements } })
    element.dispatchEvent(sortstartEvent)

    // Attach events
    const controller = new AbortController()
    document.addEventListener('dragover', documentDragover, { signal: controller.signal })
    document.addEventListener('drop', documentDrop, { signal: controller.signal })
    document.addEventListener('dragend', documentDragend, { signal: controller.signal })
    const dragLists = document.querySelectorAll<HTMLElement>(`[data-sortlist="${sortlistName}"]`)
    dragLists.forEach((element) => {
      element.addEventListener('dragover', ondragover, { signal: controller.signal })
    })

    return

    function ondragover(event: DragEvent) {
      event.preventDefault()
      currentParent = event.currentTarget as HTMLElement
    }

    function documentDragover(event: DragEvent) {
      relation = null

      if (event.defaultPrevented) {
        relation = getElementRelation(currentParent, event.clientY)
      }

      if (relation) {
        if (indicator.parentElement !== currentParent) {
          currentParent.append(indicator)
          indicator.showPopover()
        }

        indicator.style.setProperty('visibility', 'visible')
        updateIndicator(indicator, relation)
      } else {
        indicator.style.setProperty('visibility', 'hidden')
      }
    }

    function documentDrop() {
      dragCompleted = true
    }

    function documentDragend() {
      draggedElement.toggleAttribute('data-dragging', false)
      controller.abort()
      indicator.remove()

      if (!dragCompleted || !relation || relation.item === draggedElement) return

      let currentElements: HTMLElement[] = []
      let originalElements: HTMLElement[] = []

      const elements = getDraggableElements(currentParent, sortlistName)
      currentElements = applyRelation(elements, draggedElement, relation)

      if (originalParent !== currentParent) {
        const elements = getDraggableElements(originalParent, sortlistName)
        originalElements = applyRelation(elements, draggedElement, null)
      }

      if (currentElements.length) emitEvent(currentParent, currentElements)
      if (originalElements.length) emitEvent(originalParent, originalElements)
    }
  }
}

export const sortitem: Action<HTMLElement, string, ActionAttributes> = (element, name) => {
  element.dataset.sortitem = name
}

function emitEvent(parent: HTMLElement, elements: HTMLElement[]) {
  const sortendEvent: SortEvent = new CustomEvent('sortend', { detail: { elements } })
  parent.dispatchEvent(sortendEvent)
}

function getDraggableElements(container: HTMLElement, sortlistName: string): HTMLElement[] {
  return [...container.querySelectorAll<HTMLElement>(`:scope > [data-sortitem="${sortlistName}"]`)]
}

function configureDataTransfer(dataTransfer: DataTransfer) {
  const emptyImage = new Image()
  emptyImage.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs='
  dataTransfer.setDragImage(emptyImage, 0, 0)
  dataTransfer.dropEffect = 'move'
  dataTransfer.effectAllowed = 'move'
}

function createIndicator(): HTMLElement {
  let stylesheet = document.getElementById('ui-user-insertion-stylesheet')
  if (!stylesheet) {
    stylesheet = document.createElement('style')
    stylesheet.id = 'ui-user-insertion-stylesheet'
    stylesheet.textContent = `
      :where(ui-user-insertion) {
        display: block;
        height: 4px;
        border: 1px solid CanvasText;
        outline: 1px solid Canvas;
      }`
    document.head.append(stylesheet)
  }

  const indicator = document.createElement('div')
  indicator.style.setProperty('position', 'fixed')
  indicator.style.setProperty('translate', '0 -50%')
  indicator.style.setProperty('background', 'none')
  indicator.style.setProperty('margin', '0')
  indicator.style.setProperty('padding', '0')
  indicator.style.setProperty('overflow', 'visible')
  indicator.style.setProperty('pointer-events', 'none')
  indicator.setAttribute('popover', 'manual')

  const insertion = document.createElement('ui-user-insertion')
  indicator.append(insertion)

  return indicator
}

function updateIndicator(indicator: HTMLElement, relation: ItemRelation<HTMLElement>) {
  const box = relation.item.getBoundingClientRect()
  const top = relation.type === 'before' ? box.top : box.bottom
  indicator.style.setProperty('top', `${top}px`)
  indicator.style.setProperty('left', `${box.left}px`)
  indicator.style.setProperty('width', `${box.width}px`)
}

function getElementRelation(container: HTMLElement, y: number): ItemRelation<HTMLElement> | null {
  const sortlistName = container.dataset.sortlist

  if (!sortlistName) return null

  const elements = getDraggableElements(container, sortlistName)

  if (elements.length === 0) {
    return { type: 'end', item: container }
  }

  for (const element of elements) {
    const box = element.getBoundingClientRect()
    const middle = box.top + box.height / 2

    if (y >= box.top && y < middle) {
      return { type: 'before', item: element }
    } else if (y >= middle && y <= box.bottom) {
      return { type: 'after', item: element }
    }
  }

  return null
}

type ItemRelation<T = unknown> =
  | { type: 'before'; item: T }
  | { type: 'after'; item: T }
  | { type: 'start'; item: T }
  | { type: 'end'; item: T }

function applyRelation<T>(list: T[], item: T, relation: ItemRelation<T> | null): T[] {
  const newList = [...list]

  if (newList.includes(item)) {
    newList.splice(newList.indexOf(item), 1)
  }

  if (relation) {
    const index = getIndexFromRelation(newList, relation)
    newList.splice(index, 0, item)
  }

  return newList
}

function getIndexFromRelation<T>(list: T[], relation: ItemRelation<T>): number {
  switch (relation.type) {
    case 'before':
      return list.indexOf(relation.item)
    case 'after':
      return list.indexOf(relation.item) + 1
    case 'start':
      return 0
    case 'end':
      return list.length
    default:
      return exhaustiveMatchingGuard(relation, 'Invalid relation type')
  }
}

const exhaustiveMatchingGuard = (_: never, error: string): never => {
  throw new Error(error)
}
