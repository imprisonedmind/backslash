type ToastType = 'success' | 'info' | 'warning' | 'error'

type ToastPayload = {
  type?: ToastType
  title: string
  description?: string
  duration?: number
}

export type PluginToastEvent = {
  type: ToastType
  title: string
  description?: string
  duration?: number
}

type ToastOptions = {
  description?: string
  duration?: number
}

type ToastEmitter = (payload: PluginToastEvent) => void

let toastEmitter: ToastEmitter | null = null

/**
 * Registers the renderer callback responsible for showing toast notifications.
 * @param emitter - Function invoked with toast payloads.
 */
export const registerToastEmitter = (emitter: ToastEmitter) => {
  toastEmitter = emitter
}

const emitToast = (payload: ToastPayload) => {
  if (!toastEmitter) {
    console.warn('Toast emitter not registered. Ignoring toast request.')
    return
  }

  if (!payload.title) {
    console.warn('Toast payload requires a title. Ignoring toast request.')
    return
  }

  toastEmitter({
    type: payload.type ?? 'info',
    title: payload.title,
    description: payload.description,
    duration: payload.duration
  })
}

const createToastMethod =
  (type: ToastType) =>
  (title: string, options: ToastOptions = {}) => {
    emitToast({ type, title, ...options })
  }

/**
 * Helpers exposed to plugins for triggering toast notifications.
 */
export const toast = {
  show: emitToast,
  info: createToastMethod('info'),
  success: createToastMethod('success'),
  warning: createToastMethod('warning'),
  error: createToastMethod('error')
}
