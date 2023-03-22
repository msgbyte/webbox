import { BrowserWindow, HandlerDetails } from 'electron';
import { MenuBuilder } from './menu';

export function subWindowOpenHandler(details: HandlerDetails) {
  createSubWindow(details.url);

  return {
    action: 'deny' as const,
  };
}

let subWinSize: { width: number; height: number } | null = null;

/**
 * For the handling of opening sub-windows via url in the webview
 */
function createSubWindow(url: string) {
  const win = new BrowserWindow({
    width: subWinSize?.width ?? 1024,
    height: subWinSize?.height ?? 728,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      devTools: false,
      nodeIntegration: false,
    },
  });
  win.webContents.setWindowOpenHandler(subWindowOpenHandler);
  win.loadURL(url);
  win.on('resize', () => {
    const { width, height } = win.getBounds();
    subWinSize = {
      width,
      height,
    };
  });
}
