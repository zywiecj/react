import { useState } from 'react';
import { defaultAppSettings } from '../colors/Colors';

export const fontOptions = [
  { label: 'Lato', value: 'LatoRegular' },
  { label: 'Poppins', value: 'PoppinsRegular' },
  { label: 'Nanum Gothic', value: 'NanumGothicRegular' },
];

const BASIC_COLOR_MAP = {
  black: '#000000',
  white: '#FFFFFF',
  red: '#FF0000',
  green: '#008000',
  blue: '#0000FF',
  yellow: '#FFFF00',
  orange: '#FFA500',
  purple: '#800080',
  pink: '#FFC0CB',
  gray: '#808080',
  grey: '#808080',
  brown: '#A52A2A',
};

function normalizeHex(value, fallback) {
  const trimmed = (value ?? '').trim();

  if (!trimmed) {
    return fallback;
  }

  const lower = trimmed.toLowerCase();
  if (BASIC_COLOR_MAP[lower]) {
    return BASIC_COLOR_MAP[lower];
  }

  const withHash = trimmed.startsWith('#') ? trimmed : `#${trimmed}`;
  const isShortHex = /^#([0-9a-fA-F]{3})$/.test(withHash);
  const isLongHex = /^#([0-9a-fA-F]{6})$/.test(withHash);

  if (isShortHex) {
    const r = withHash[1];
    const g = withHash[2];
    const b = withHash[3];
    return `#${r}${r}${g}${g}${b}${b}`.toUpperCase();
  }

  if (isLongHex) {
    return withHash.toUpperCase();
  }

  // Allow named colors and rgb()/rgba() values supported by React Native.
  return trimmed;
}

export function useAppSettings() {
  const [settings, setSettings] = useState(defaultAppSettings);

  const applySettings = (next) => {
    setSettings((prev) => ({
      ...prev,
      primary: normalizeHex(next.primary ?? prev.primary, prev.primary),
      secondary: normalizeHex(next.secondary ?? prev.secondary, prev.secondary),
      tertiary: normalizeHex(next.tertiary ?? prev.tertiary, prev.tertiary),
      fontFamily: next.fontFamily ?? prev.fontFamily,
    }));
  };

  return { settings, applySettings };
}
