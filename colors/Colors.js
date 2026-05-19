const primaryDefault = '#7FC241';
const secondaryDefault = '#464F5A';
const tertiaryDefault = '#F39200';
const white = '#FFFFFF';

export const Colors = {
  light: {
    text: secondaryDefault,
    background: white,
    tint: tertiaryDefault,
    accent: primaryDefault,
    panel: '#F4F6F8',
  },
  dark: {
    text: white,
    background: secondaryDefault,
    tint: tertiaryDefault,
    accent: primaryDefault,
    panel: '#2F3741',
  },
};

export const defaultAppSettings = {
  primary: primaryDefault,
  secondary: secondaryDefault,
  tertiary: tertiaryDefault,
  fontFamily: 'LatoRegular',
};

export function resolveThemeColors(colorScheme, settings) {
  const scheme = colorScheme === 'dark' ? 'dark' : 'light';
  const base = Colors[scheme];

  return {
    ...base,
    text: settings.secondary,
    accent: settings.primary,
    tint: settings.tertiary,
    primary: settings.primary,
    secondary: settings.secondary,
    tertiary: settings.tertiary,
  };
}
