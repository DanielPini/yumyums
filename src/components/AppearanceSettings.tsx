import { Check, Monitor, Moon, Sun } from 'lucide-react';
import { COLOR_THEMES, useThemeStore, type ColorMode } from '../store/useThemeStore';
import Modal from './Modal';

const modeOptions: { id: ColorMode; label: string; icon: typeof Sun }[] = [
  { id: 'light', label: 'Light', icon: Sun },
  { id: 'dark', label: 'Dark', icon: Moon },
  { id: 'system', label: 'System', icon: Monitor },
];

export default function AppearanceSettings({ onClose }: { onClose: () => void }) {
  const colorMode = useThemeStore((s) => s.colorMode);
  const highContrast = useThemeStore((s) => s.highContrast);
  const colorTheme = useThemeStore((s) => s.colorTheme);
  const setColorMode = useThemeStore((s) => s.setColorMode);
  const setHighContrast = useThemeStore((s) => s.setHighContrast);
  const setColorTheme = useThemeStore((s) => s.setColorTheme);

  return (
    <Modal title="Appearance" onClose={onClose}>
      <div className="space-y-5">
        <div>
          <p className="mb-1.5 text-xs font-medium text-muted">Color mode</p>
          <div className="flex gap-2">
            {modeOptions.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => setColorMode(id)}
                className={`flex flex-1 items-center justify-center gap-1.5 rounded-md border px-3 py-2 text-sm font-medium transition-colors ${
                  colorMode === id
                    ? 'border-brand-400 bg-brand-50 text-brand-700 dark:border-brand-600 dark:bg-brand-900/40 dark:text-brand-200'
                    : 'border-border text-muted hover:border-border-strong'
                }`}
              >
                <Icon size={15} />
                {label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="flex items-start gap-2.5 rounded-md border border-border p-3 text-sm">
            <input
              type="checkbox"
              checked={highContrast}
              onChange={(e) => setHighContrast(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded accent-brand-600"
            />
            <span>
              <span className="font-medium">Increased contrast</span>
              <span className="block text-xs text-subtle">
                Strengthens borders and secondary text for better readability.
              </span>
            </span>
          </label>
        </div>

        <div>
          <p className="mb-1.5 text-xs font-medium text-muted">Color theme</p>
          <div className="grid grid-cols-3 gap-2">
            {COLOR_THEMES.map((theme) => (
              <button
                key={theme.id}
                type="button"
                onClick={() => setColorTheme(theme.id)}
                className={`flex items-center gap-2 rounded-md border px-2.5 py-2 text-sm font-medium transition-colors ${
                  colorTheme === theme.id
                    ? 'border-brand-400 bg-brand-50 text-brand-700 dark:border-brand-600 dark:bg-brand-900/40 dark:text-brand-200'
                    : 'border-border text-muted hover:border-border-strong'
                }`}
              >
                <span
                  className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full"
                  style={{ backgroundColor: theme.swatch }}
                >
                  {colorTheme === theme.id && <Check size={11} className="text-white" strokeWidth={3} />}
                </span>
                {theme.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
}
