type SearchEvent = {
  action: 'clear'
}

type SearchEmitter = (event: SearchEvent) => void

let searchEmitter: SearchEmitter | null = null

/**
 * Registers the renderer callback responsible for handling search-related events.
 * @param emitter - Function invoked with search event payloads.
 */
export const registerSearchEmitter = (emitter: SearchEmitter) => {
  searchEmitter = emitter
}

const emitSearchEvent = (event: SearchEvent) => {
  if (!searchEmitter) {
    console.warn('Search emitter not registered. Ignoring search event request.')
    return
  }

  searchEmitter(event)
}

/**
 * Helpers exposed to plugins for interacting with the search input.
 */
export const search = {
  clear: () => emitSearchEvent({ action: 'clear' })
}
