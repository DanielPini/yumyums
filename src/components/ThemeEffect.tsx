import { useEffect } from 'react';
import { useThemeStore } from '../store/useThemeStore';

/** Syncs the theme store onto <html> as a `.dark` class + `data-contrast`/`data-color-theme` attributes, which index.css keys off of. Renders nothing. */
export default function ThemeEffect() {
  const colorMode = useThemeStore((s) => s.colorMode);
  const highContrast = useThemeStore((s) => s.highContrast);
  const colorTheme = useThemeStore((s) => s.colorTheme);

  useEffect(() => {
    const root = document.documentElement;

    function applyDark(isDark: boolean) {
      root.classList.toggle('dark', isDark);
    }

    if (colorMode === 'system') {
      const media = window.matchMedia('(prefers-color-scheme: dark)');
      applyDark(media.matches);
      const onChange = (e: MediaQueryListEvent) => applyDark(e.matches);
      media.addEventListener('change', onChange);
      return () => media.removeEventListener('change', onChange);
    }

    applyDark(colorMode === 'dark');
  }, [colorMode]);

  useEffect(() => {
    document.documentElement.dataset.contrast = highContrast ? 'high' : 'normal';
  }, [highContrast]);

  useEffect(() => {
    document.documentElement.dataset.colorTheme = colorTheme;
  }, [colorTheme]);

  return null;
}
