import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ColorMode = 'light' | 'dark' | 'system';
export type ColorTheme = 'green' | 'ocean' | 'sunset' | 'berry' | 'violet' | 'slate';

export interface ColorThemeOption {
  id: ColorTheme;
  label: string;
  swatch: string;
}

export const COLOR_THEMES: ColorThemeOption[] = [
  { id: 'green', label: 'Green', swatch: '#4c9a37' },
  { id: 'ocean', label: 'Ocean', swatch: '#3b82f6' },
  { id: 'sunset', label: 'Sunset', swatch: '#f59e0b' },
  { id: 'berry', label: 'Berry', swatch: '#f43f5e' },
  { id: 'violet', label: 'Violet', swatch: '#8b5cf6' },
  { id: 'slate', label: 'Slate', swatch: '#64748b' },
];

interface ThemeState {
  colorMode: ColorMode;
  highContrast: boolean;
  colorTheme: ColorTheme;
  setColorMode: (mode: ColorMode) => void;
  setHighContrast: (on: boolean) => void;
  setColorTheme: (theme: ColorTheme) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      colorMode: 'system',
      highContrast: false,
      colorTheme: 'green',
      setColorMode: (mode) => set({ colorMode: mode }),
      setHighContrast: (on) => set({ highContrast: on }),
      setColorTheme: (theme) => set({ colorTheme: theme }),
    }),
    { name: 'yumyums-theme' }
  )
);
