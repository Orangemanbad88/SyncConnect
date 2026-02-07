import { Capacitor } from '@capacitor/core';

const DEV_SERVER = 'http://10.0.2.2:5000';

/** True when running inside a native Capacitor shell (iOS / Android) */
export function isNative(): boolean {
  return Capacitor.isNativePlatform();
}

/**
 * Prepend the server origin when running on native.
 * On web the path is returned unchanged (same-origin fetch).
 */
export function apiUrl(path: string): string {
  if (!isNative()) return path;
  return `${DEV_SERVER}${path}`;
}

/**
 * Build the correct WebSocket URL for both web and native.
 */
export function getWsUrl(): string {
  if (isNative()) {
    return `ws://10.0.2.2:5000/ws`;
  }
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  return `${protocol}//${window.location.host}/ws`;
}
