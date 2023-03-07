import { BrowserView, BrowserWindow, ipcMain, Rectangle } from 'electron';

interface WebviewInfo {
  view: BrowserView;
  hidden: boolean;
}

const webviewMap = new Map<string, WebviewInfo>();

/**
 * fix rect into correct size
 */
function fixRect(rect: Rectangle): Rectangle {
  return {
    x: Math.round(rect.x) + 1,
    y: Math.round(rect.y) + 28,
    width: Math.round(rect.width) - 1,
    height: Math.round(rect.height),
  };
}

export function initWebviewManager(win: BrowserWindow) {
  ipcMain.on('mount-webview', (e, info) => {
    console.log('[mount-webview] info:', info);

    const key = info.key;
    const url = info.url;
    if (!url) {
      return;
    }

    if (webviewMap.has(key)) {
      const webview = webviewMap.get(key)!;
      win.setTopBrowserView(webview.view);
      webview.view.setBounds(fixRect(info.rect));
      return;
    }

    const view = new BrowserView({
      webPreferences: {
        nodeIntegration: false,
      },
    });
    win.addBrowserView(view);
    view.setBounds(fixRect(info.rect));
    view.webContents.loadURL(url);
    webviewMap.set(key, { view, hidden: false });
  });

  ipcMain.on('update-webview-rect', (e, info) => {
    console.log('[update-webview-rect] info:', info);

    Array.from(webviewMap.values()).forEach(({ view }) => {
      view.setBounds(fixRect(info.rect));
    });
  });

  ipcMain.on('hide-all-webview', (e) => {
    console.log('[hide-all-webview]');

    Array.from(webviewMap.values()).forEach((webview) => {
      hideWebView(webview);
    });
  });

  ipcMain.on('clear-all-webview', (e) => {
    console.log('[clear-all-webview]');

    win.getBrowserViews().forEach((view) => {
      win.removeBrowserView(view);
    });

    webviewMap.clear();
  });
}

const HIDDEN_OFFSET = 3000;

/**
 * Show webview with remove offset in y
 */
function showWebView(webview: WebviewInfo) {
  if (webview.hidden === false) {
    return;
  }

  webview.hidden = false;
  const oldBounds = webview.view.getBounds();
  webview.view.setBounds({
    ...oldBounds,
    y: oldBounds.y - HIDDEN_OFFSET,
  });
}

/**
 * Hide webview with append offset in y
 */
function hideWebView(webview: WebviewInfo) {
  if (webview.hidden === true) {
    return;
  }

  webview.hidden = true;
  const oldBounds = webview.view.getBounds();
  webview.view.setBounds({
    ...oldBounds,
    y: oldBounds.y + HIDDEN_OFFSET,
  });
}
