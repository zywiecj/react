import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

export function SettingsPanel({ settings, onApply, fontOptions, themeColors }) {
  const [primary, setPrimary] = useState(settings.primary);
  const [secondary, setSecondary] = useState(settings.secondary);
  const [tertiary, setTertiary] = useState(settings.tertiary);
  const [fontFamily, setFontFamily] = useState(settings.fontFamily);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setPrimary(settings.primary);
    setSecondary(settings.secondary);
    setTertiary(settings.tertiary);
    setFontFamily(settings.fontFamily);
  }, [settings]);

  const handleApply = () => {
    onApply({ primary, secondary, tertiary, fontFamily });
    setSaved(true);
  };

  return (
    <View style={styles.panel(themeColors)}>
      <Text style={styles.title(themeColors)}>Ustawienia aplikacji</Text>

      <Text style={styles.label(themeColors)}>primary (np. #7FC241)</Text>
      <TextInput value={primary} onChangeText={setPrimary} style={styles.input(themeColors)} autoCapitalize="none" />

      <Text style={styles.label(themeColors)}>secondary (np. #464F5A)</Text>
      <TextInput value={secondary} onChangeText={setSecondary} style={styles.input(themeColors)} autoCapitalize="none" />

      <Text style={styles.label(themeColors)}>tertiary (np. #F39200)</Text>
      <TextInput value={tertiary} onChangeText={setTertiary} style={styles.input(themeColors)} autoCapitalize="none" />

      <Text style={styles.label(themeColors)}>Czcionka</Text>
      <View style={styles.fontRow}>
        {fontOptions.map((item) => {
          const active = item.value === fontFamily;
          return (
            <Pressable
              key={item.value}
              onPress={() => setFontFamily(item.value)}
              style={styles.fontButton(active, themeColors)}
            >
              <Text style={styles.fontButtonText(active, themeColors)}>{item.label}</Text>
            </Pressable>
          );
        })}
      </View>

      <Pressable onPress={handleApply} style={styles.applyButton(themeColors)}>
        <Text style={styles.applyButtonText}>Zatwierdz ustawienia</Text>
      </Pressable>

      {saved ? <Text style={styles.saved(themeColors)}>Ustawienia zapisane.</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  panel: (themeColors) => ({
    width: '100%',
    backgroundColor: themeColors.panel,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: themeColors.tint,
    padding: 14,
    gap: 8,
  }),
  title: (themeColors) => ({
    fontSize: 18,
    fontWeight: '700',
    color: themeColors.text,
  }),
  label: (themeColors) => ({
    fontSize: 13,
    color: themeColors.text,
  }),
  input: (themeColors) => ({
    borderWidth: 1,
    borderColor: themeColors.tint,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    color: themeColors.text,
    backgroundColor: '#FFFFFF',
  }),
  fontRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  fontButton: (active, themeColors) => ({
    borderWidth: 1,
    borderColor: themeColors.tint,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: active ? themeColors.tint : 'transparent',
  }),
  fontButtonText: (active, themeColors) => ({
    color: active ? '#FFFFFF' : themeColors.text,
    fontWeight: '600',
  }),
  applyButton: (themeColors) => ({
    marginTop: 8,
    alignSelf: 'flex-start',
    borderRadius: 8,
    backgroundColor: themeColors.accent,
    paddingHorizontal: 12,
    paddingVertical: 8,
  }),
  applyButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  saved: (themeColors) => ({
    color: themeColors.text,
    fontWeight: '600',
  }),
});
