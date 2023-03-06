import { BrowserView, BrowserWindow, ipcMain, Rectangle } from 'electron';

const webviewMap = new Map<string, BrowserView>();

/**
 * fix rect into correct size
 */
function fixRect(rect: Rectangle): Rectangle {
  return {
    x: Math.round(rect.x),
    y: Math.round(rect.y) + 28,
    width: Math.round(rect.width),
    height: Math.round(rect.height),
  };
}

export function initWebviewManager(win: BrowserWindow) {
  ipcMain.on('mount-webview', (e, info) => {
    const key = info.key;
    const url = info.url;
    if (!url) {
      return;
    }

    if (webviewMap.has(key)) {
      win.setTopBrowserView(webviewMap.get(key)!);
      return;
    }

    console.log('[mount-webview] info:', info);

    const view = new BrowserView({
      webPreferences: {
        nodeIntegration: false,
      },
    });
    win.addBrowserView(view);
    view.setBounds(fixRect(info.rect));
    view.webContents.loadURL(url);
    webviewMap.set(key, view);
  });

  ipcMain.on('update-webview-rect', (e, info) => {
    console.log('[update-webview-rect] info:', info);

    Array.from(webviewMap.values()).forEach((view) => {
      view.setBounds(fixRect(info.rect));
    });
  });
}
