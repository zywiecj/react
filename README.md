# Lab 09-10 React Native (Expo)

Projekt przygotowany w Expo na Windows + Android Emulator.

## Co jest zrobione

- Lab 9: podstawowe komponenty, stan, styl parametryczny, `Pressable`, zmiana promienia kola i losowy kolor.
- Lab 10:
  - katalogi `components`, `colors`, `hooks`
  - czcionki ladowane przez `useFonts` (`LatoRegular`, `PoppinsRegular`, `NanumGothicRegular`)
  - komponent naglowka z ikona `Ionicons`
  - obrazy statyczne i dynamiczne (`uri`, base64)
  - `ImageBackground` jako tlo
  - motywy kolorystyczne (`light`, `dark`) i centralny plik kolorow
  - panel ustawien (3 kolory + wybor czcionki) z globalnym zastosowaniem po zatwierdzeniu

## Uruchomienie

```powershell
npm install
npm start
```

Android:

```powershell
npm run android
```

## Struktura

- `App.js` - ekran glowny i integracja Lab 10
- `components/Header.js` - naglowek z ikona i fontem
- `components/SettingsPanel.js` - panel ustawien aplikacji
- `colors/Colors.js` - motywy i domyslne ustawienia
- `hooks/useAppSettings.js` - hook do zarzadzania ustawieniami
- `assets/fonts` - czcionki TTF
- `assets/images/wsei-logo.png` - obraz statyczny
