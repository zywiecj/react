import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import { useMemo, useState } from 'react';
import {
  Appearance,
  Image,
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import { Header } from './components/Header';
import { SettingsPanel } from './components/SettingsPanel';
import { resolveThemeColors } from './colors/Colors';
import { fontOptions, useAppSettings } from './hooks/useAppSettings';

export default function App() {
  const [loaded] = useFonts({
    LatoRegular: require('./assets/fonts/Lato-Regular.ttf'),
    PoppinsRegular: require('./assets/fonts/Poppins-Regular.ttf'),
    NanumGothicRegular: require('./assets/fonts/NanumGothic-Regular.ttf'),
  });
  const [resizeModeIndex, setResizeModeIndex] = useState(0);
  const resizeModes = ['contain', 'center', 'stretch', 'cover', 'repeat'];
  const colorScheme = useColorScheme();
  const { settings, applySettings } = useAppSettings();

  const themeColors = useMemo(
    () => resolveThemeColors(colorScheme, settings),
    [colorScheme, settings]
  );

  if (!loaded) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Ladowanie czcionek...</Text>
      </View>
    );
  }

  const nextResizeMode = () => {
    setResizeModeIndex((state) => (state + 1) % resizeModes.length);
  };

  return (
    <ImageBackground
      source={require('./assets/images/wsei-logo.png')}
      imageStyle={styles.backgroundImage}
      style={styles.background}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Header
          size={34}
          themeColors={themeColors}
          fontFamily={settings.fontFamily}
        >
          Index
        </Header>

        <Text style={styles.subtitle(themeColors, settings.fontFamily)}>
          Lab 10: czcionki, obrazy, ikony i kolory
        </Text>

        <Image
          source={require('./assets/images/wsei-logo.png')}
          style={styles.staticImage(resizeModes[resizeModeIndex])}
        />

        <Pressable onPress={nextResizeMode} style={styles.button(themeColors)}>
          <Text style={styles.buttonText}>Zmien resizeMode: {resizeModes[resizeModeIndex]}</Text>
        </Pressable>

        <Image
          source={{ uri: 'https://reactjs.org/logo-og.png', cache: 'force-cache' }}
          style={styles.dynamicImage}
        />

        <Image
          style={styles.base64Image}
          source={{
            uri: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADMAAAAzCAYAAAA6oTAqAAAAEXRFWHRTb2Z0d2FyZQBwbmdjcnVzaEB1SfMAAABQSURBVGje7dSxCQBACARB+2/ab8BEeQNhFi6WSYzYLYudDQYGBgYGBgYGBgYGBgYGBgZmcvDqYGBgmhivGQYGBgYGBgYGBgYGBgYGBgbmQw+P/eMrC5UTVAAAAABJRU5ErkJggg==',
          }}
        />

        <View style={styles.themeButtons}>
          <Pressable
            onPress={() => Appearance.setColorScheme('light')}
            style={styles.themeButton(themeColors)}
          >
            <Text style={styles.themeButtonText}>Motyw jasny</Text>
          </Pressable>
          <Pressable
            onPress={() => Appearance.setColorScheme('dark')}
            style={styles.themeButton(themeColors)}
          >
            <Text style={styles.themeButtonText}>Motyw ciemny</Text>
          </Pressable>
        </View>

        <SettingsPanel
          settings={settings}
          onApply={applySettings}
          fontOptions={fontOptions}
          themeColors={themeColors}
        />

        <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  background: {
    flex: 1,
    width: '100%',
  },
  backgroundImage: {
    opacity: 0.08,
    resizeMode: 'contain',
  },
  container: {
    padding: 18,
    gap: 14,
    alignItems: 'center',
  },
  subtitle: (themeColors, fontFamily) => ({
    fontSize: 16,
    color: themeColors.text,
    fontFamily,
    textAlign: 'center',
  }),
  staticImage: (resizeMode) => ({
    width: '70%',
    height: 160,
    resizeMode,
    borderWidth: 1,
    borderColor: '#C9D0D6',
  }),
  dynamicImage: {
    width: 220,
    height: 120,
    resizeMode: 'contain',
  },
  base64Image: {
    width: 51,
    height: 51,
    resizeMode: 'contain',
  },
  button: (themeColors) => ({
    borderRadius: 8,
    backgroundColor: themeColors.accent,
    paddingHorizontal: 12,
    paddingVertical: 8,
  }),
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  themeButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  themeButton: (themeColors) => ({
    borderWidth: 1,
    borderColor: themeColors.tint,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: '#FFFFFFB0',
  }),
  themeButtonText: {
    fontWeight: '600',
    color: '#232323',
  },
  panel: {
    width: '100%',
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#AAB4BE',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
});
