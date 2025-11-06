import { BrowserWindow } from 'electron'

import { registerToastEmitter } from './pluginToast'
import { registerSearchEmitter } from './pluginSearch'

type PluginEmitterRegistration<Payload> = {
  channel: string
  register: (emit: (payload: Payload) => void) => void
}

const registry: PluginEmitterRegistration<unknown>[] = [
  { channel: 'plugin-toast', register: registerToastEmitter },
  { channel: 'plugin-search', register: registerSearchEmitter }
]

/**
 * Installs all plugin-to-renderer emitters using a shared window lookup.
 *
 * Each registration function receives an emitter that proxies payloads to the renderer
 * through the appropriate IPC channel once the BrowserWindow is ready.
 *
 * @param getWindow - Lazy getter returning the current BrowserWindow or null when unavailable.
 */
export const registerPluginEmitters = (getWindow: () => BrowserWindow | null) => {
  registry.forEach(({ channel, register }) => {
    register((payload) => {
      const window = getWindow()
      if (!window) {
        console.warn(`Renderer window is not ready for channel "${channel}". Dropping event.`)
        return
      }

      window.webContents.send(channel, payload)
    })
  })
}
