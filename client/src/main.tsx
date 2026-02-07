import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { isNative } from "./lib/capacitor";

async function initNativePlugins() {
  if (!isNative()) return;
  try {
    const { StatusBar, Style } = await import('@capacitor/status-bar');
    const { SplashScreen } = await import('@capacitor/splash-screen');
    await StatusBar.setStyle({ style: Style.Dark });
    await StatusBar.setBackgroundColor({ color: '#0D0F12' });
    await SplashScreen.hide();
  } catch (e) {
    console.warn('Native plugin init failed:', e);
  }
}

initNativePlugins().then(() => {
  createRoot(document.getElementById("root")!).render(
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  );
});
