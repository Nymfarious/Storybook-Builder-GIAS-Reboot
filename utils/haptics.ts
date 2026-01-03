/**
 * Triggers a short vibration on supported devices.
 * Used for UI feedback like snapping to grid.
 */
export const triggerHaptic = (type: 'tap' | 'light' | 'heavy' = 'tap') => {
  if (typeof navigator !== 'undefined' && navigator.vibrate) {
    switch (type) {
      case 'tap':
        navigator.vibrate(10);
        break;
      case 'light':
        navigator.vibrate(5);
        break;
      case 'heavy':
        navigator.vibrate(20);
        break;
    }
  }
};