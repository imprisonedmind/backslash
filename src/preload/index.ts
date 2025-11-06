import { contextBridge, ipcRenderer } from 'electron'
import { ElectronAPI, electronAPI } from '@electron-toolkit/preload'

const api = {}

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', {
      ...electronAPI,
      getCommands: () => {
        return ipcRenderer.invoke('get-commands')
      },
      runCommand: (pluginName, commandName, params) => {
        return ipcRenderer.invoke('run-command', pluginName, commandName, params)
      },
      getPluginActions: (pluginName, commandName) => {
        return ipcRenderer.invoke('get-plugin-actions', pluginName, commandName)
      },
      runPluginAction: (pluginName, commandName, actionName, result) => {
        return ipcRenderer.invoke('run-plugin-action', pluginName, commandName, actionName, result)
      },
      listInstalledApplications: () => {
        return ipcRenderer.invoke('list-installed-applications')
      },
      openApplication: (command) => {
        return ipcRenderer.invoke('open-application', command)
      },
      openExternal: (url) => {
        return ipcRenderer.invoke('open-external', url)
      },
      choosePluginsDir: () => {
        return ipcRenderer.invoke('choose-plugins-dir')
      },
      getPluginsDir: () => {
        return ipcRenderer.invoke('get-plugins-dir')
      },
      getPlugins: () => {
        return ipcRenderer.invoke('get-plugins')
      },
      getHotkeys: () => {
        return ipcRenderer.invoke('get-hotkeys')
      },
      setHotkey: (type, hotkey) => {
        return ipcRenderer.invoke('set-hotkey', type, hotkey)
      },
      setDisabledPlugins: (pluginName, isDisabled) => {
        return ipcRenderer.invoke('set-disabled-plugins', pluginName, isDisabled)
      },
      getDisabledPlugins: () => {
        return ipcRenderer.invoke('get-disabled-plugins')
      },
      onPluginSearch: (callback) => {
        const channel = 'plugin-search'
        const subscription = (_event, payload) => callback(payload)
        ipcRenderer.on(channel, subscription)
        return () => {
          ipcRenderer.removeListener(channel, subscription)
        }
      },
      showMainWindow: () => {
        return ipcRenderer.send('show-main-window')
      },
      hideMainWindow: () => {
        return ipcRenderer.send('hide-main-window')
      },
      reloadApp: () => {
        return ipcRenderer.send('reload-app')
      }
    } as ElectronAPI & ApiT)

    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
