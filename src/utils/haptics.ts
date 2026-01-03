type HapticPattern = 'tap' | 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error';

const patterns: Record<HapticPattern, number | number[]> = {
  tap: 10,
  light: 5,
  medium: 15,
  heavy: 25,
  success: [10, 50, 10],
  warning: [20, 30, 20],
  error: [30, 50, 30, 50, 30],
};

export const triggerHaptic = (pattern: HapticPattern = 'tap'): void => {
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    try {
      navigator.vibrate(patterns[pattern]);
    } catch (e) {
      // Vibration not supported or blocked
      console.debug('[Haptics] Vibration not available');
    }
  }
};

export const isHapticSupported = (): boolean => {
  return typeof navigator !== 'undefined' && 'vibrate' in navigator;
};
