import 'react-native-gesture-handler';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useFonts } from 'expo-font';
import { LightSensor } from 'expo-sensors';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Alert,
  Appearance,
  Button,
  Image,
  ImageBackground,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { resolveThemeColors } from './colors/Colors';
import { Header } from './components/Header';
import { MessageList } from './components/MessageList';
import { SettingsPanel } from './components/SettingsPanel';
import { fontOptions, useAppSettings } from './hooks/useAppSettings';

const Stack = createNativeStackNavigator();

const initialMessages = [
  { id: 1, subject: 'Hello', from: 'adam@wsei.edu.pl', content: 'AAAA' },
  { id: 2, subject: 'Cześć', from: 'ewa@wsei.edu.pl', content: 'BBBB' },
  { id: 3, subject: 'Co słychać?', from: 'monika@wsei.edu.pl', content: 'CCCC' },
];

function HomeScreen({ navigation }) {
  return (
    <View style={screenStyles.center}>
      <Button title="Przejdź do listy wiadomości" onPress={() => navigation.navigate('Posts')} />
      <View style={screenStyles.spacer} />
      <Button title="Otwórz poprzednie ćwiczenia" onPress={() => navigation.navigate('Lab10')} />
      <View style={screenStyles.spacer} />
      <Button title="Czujnik światła" onPress={() => navigation.navigate('Sensor')} />
      <View style={screenStyles.spacer} />
      <Button title="Flex i karta" onPress={() => navigation.navigate('FlexCard')} />
    </View>
  );
}

function LightSensorScreen() {
  const [{ illuminance }, setData] = useState({ illuminance: 0 });
  const subscription = useRef(null);

  const subscribe = () => {
    if (Platform.OS !== 'android') {
      return;
    }

    if (typeof LightSensor.setUpdateInterval === 'function') {
      LightSensor.setUpdateInterval(1000);
    }

    subscription.current = LightSensor.addListener(setData);
  };

  const unsubscribe = () => {
    subscription.current?.remove();
    subscription.current = null;
  };

  const toggleSubscribtion = () => {
    if (subscription.current) {
      unsubscribe();
    } else {
      subscribe();
    }
  };

  useEffect(() => {
    toggleSubscribtion();
    return () => {
      unsubscribe();
    };
  }, []);

  const onAndroid = Platform.OS === 'android';

  return (
    <View style={sensorStyles.sensor}>
      <Text style={sensorStyles.title}>Light Sensor:</Text>
      <Text style={sensorStyles.value}>{onAndroid ? `Illuminance: ${illuminance} lx` : 'Only available on Android'}</Text>
      <View style={sensorStyles.buttonContainer}>
        <TouchableOpacity onPress={toggleSubscribtion} style={sensorStyles.button} disabled={!onAndroid}>
          <Text style={sensorStyles.buttonText}>Toggle</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function FlexCardScreen() {
  return (
    <ScrollView contentContainerStyle={flexCardStyles.container}>
      <Text style={flexCardStyles.title}>Flex i karta</Text>

      <View style={flexCardStyles.row}>
        <View style={flexCardStyles.box('tomato')} />
        <View style={flexCardStyles.box('goldenrod')} />
        <View style={flexCardStyles.box('seagreen')} />
      </View>

      <View style={flexCardStyles.wrapArea}>
        {['A', 'B', 'C', 'D', 'E', 'F'].map((label) => (
          <View key={label} style={flexCardStyles.wrapChip}>
            <Text style={flexCardStyles.wrapText}>{label}</Text>
          </View>
        ))}
      </View>

      <View style={flexCardStyles.card}>
        <Text style={flexCardStyles.cornerTop}>A ♥</Text>
        <View style={flexCardStyles.cardCenter}>
          <Text style={flexCardStyles.bigSuit}>♥</Text>
          <Text style={[flexCardStyles.bigSuit, flexCardStyles.rotatedSuit]}>♥</Text>
        </View>
        <Text style={[flexCardStyles.cornerBottom, flexCardStyles.rotatedCorner]}>A ♥</Text>
      </View>
    </ScrollView>
  );
}

function PostsScreen({ navigation, messages, onDeleteMessage, themeColors, fontFamily }) {
  const [selectedId, setSelectedId] = useState(messages[0]?.id ?? null);

  const openDetails = (id) => {
    setSelectedId(id);
    navigation.setOptions({
      title: `Wybrano wiadomość ${id}`,
      headerRight: () => (
        <View style={screenStyles.headerActions}>
          <Button
            title="Delete"
            color="red"
            onPress={() => {
              Alert.alert('Usuń wiadomość', `Czy usunąć wiadomość o id ${id}?`, [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Delete', style: 'destructive', onPress: () => onDeleteMessage(id) },
              ]);
            }}
          />
          <Button title="Details" color="brown" onPress={() => navigation.navigate('Details', { postId: id })} />
        </View>
      ),
    });
  };

  return (
    <View style={screenStyles.flex}>
      <MessageList
        data={messages}
        selectedId={selectedId}
        onPressItem={openDetails}
        themeColors={themeColors}
        fontFamily={fontFamily}
      />
    </View>
  );
}

function PostDetailsScreen({ navigation, route, messages, themeColors, fontFamily }) {
  const { postId } = route.params;
  const message = messages.find((item) => item.id === postId);

  if (!message) {
    return (
      <View style={screenStyles.detailsContainer(themeColors)}>
        <Text style={screenStyles.detailsText(themeColors, fontFamily)}>Wiadomość została usunięta.</Text>
        <Button title="Wróć do listy" onPress={() => navigation.popToTop()} />
      </View>
    );
  }

  return (
    <View style={screenStyles.detailsContainer(themeColors)}>
      <Text style={screenStyles.detailsTitle(themeColors, fontFamily)}>Szczegóły wiadomości</Text>
      <Text style={screenStyles.detailsText(themeColors, fontFamily)}>Id: {message.id}</Text>
      <Text style={screenStyles.detailsText(themeColors, fontFamily)}>Temat: {message.subject}</Text>
      <Text style={screenStyles.detailsText(themeColors, fontFamily)}>Od: {message.from}</Text>
      <Text style={screenStyles.detailsText(themeColors, fontFamily)}>Treść: {message.content}</Text>
      <Button title="Wróć do strony głównej" onPress={() => navigation.popToTop()} />
    </View>
  );
}

function Lab10Screen({ themeColors, settings, onApply, fontFamily }) {
  const [resizeModeIndex, setResizeModeIndex] = useState(0);
  const resizeModes = ['contain', 'center', 'stretch', 'cover', 'repeat'];
  const [savedTheme, setSavedTheme] = useState(false);

  const nextResizeMode = () => {
    setResizeModeIndex((state) => (state + 1) % resizeModes.length);
  };

  const handleApply = (nextSettings) => {
    onApply(nextSettings);
    setSavedTheme(true);
  };

  return (
    <ImageBackground source={require('./assets/images/wsei-logo.png')} imageStyle={lab10Styles.backgroundImage} style={lab10Styles.background}>
      <ScrollView contentContainerStyle={lab10Styles.container}>
        <Header size={34} themeColors={themeColors} fontFamily={fontFamily}>
          Index
        </Header>

        <Text style={lab10Styles.subtitle(themeColors, fontFamily)}>Lab 10: czcionki, obrazy, ikony i kolory</Text>

        <Image source={require('./assets/images/wsei-logo.png')} style={lab10Styles.staticImage(resizeModes[resizeModeIndex])} />

        <Pressable onPress={nextResizeMode} style={lab10Styles.button(themeColors)}>
          <Text style={lab10Styles.buttonText}>Zmien resizeMode: {resizeModes[resizeModeIndex]}</Text>
        </Pressable>

        <Image source={{ uri: 'https://reactjs.org/logo-og.png', cache: 'force-cache' }} style={lab10Styles.dynamicImage} />

        <Image
          style={lab10Styles.base64Image}
          source={{
            uri: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADMAAAAzCAYAAAA6oTAqAAAAEXRFWHRTb2Z0d2FyZQBwbmdjcnVzaEB1SfMAAABQSURBVGje7dSxCQBACARB+2/ab8BEeQNhFi6WSYzYLYudDQYGBgYGBgYGBgYGBgYGBgZmcvDqYGBgmhivGQYGBgYGBgYGBgYGBgYGBgbmQw+P/eMrC5UTVAAAAABJRU5ErkJggg==',
          }}
        />

        <View style={lab10Styles.themeButtons}>
          <Pressable onPress={() => Appearance.setColorScheme('light')} style={lab10Styles.themeButton(themeColors)}>
            <Text style={lab10Styles.themeButtonText}>Motyw jasny</Text>
          </Pressable>
          <Pressable onPress={() => Appearance.setColorScheme('dark')} style={lab10Styles.themeButton(themeColors)}>
            <Text style={lab10Styles.themeButtonText}>Motyw ciemny</Text>
          </Pressable>
        </View>

        <Text style={lab10Styles.note(themeColors, fontFamily)}>
          Aktualne kolory: primary {settings.primary}, secondary {settings.secondary}, tertiary {settings.tertiary}
        </Text>

        <SettingsPanel settings={settings} onApply={handleApply} fontOptions={fontOptions} themeColors={themeColors} />

        {savedTheme ? <Text style={lab10Styles.saved(themeColors, fontFamily)}>Ustawienia zapisane.</Text> : null}
      </ScrollView>
    </ImageBackground>
  );
}

export default function App() {
  const [loaded] = useFonts({
    LatoRegular: require('./assets/fonts/Lato-Regular.ttf'),
    PoppinsRegular: require('./assets/fonts/Poppins-Regular.ttf'),
    NanumGothicRegular: require('./assets/fonts/NanumGothic-Regular.ttf'),
  });

  const colorScheme = useColorScheme();
  const { settings, applySettings } = useAppSettings();
  const [messages, setMessages] = useState(initialMessages);

  const themeColors = useMemo(() => resolveThemeColors(colorScheme, settings), [colorScheme, settings]);

  const deleteMessage = (id) => {
    setMessages((prev) => prev.filter((message) => message.id !== id));
  };

  if (!loaded) {
    return (
      <View style={screenStyles.loadingContainer}>
        <Text>Ladowanie czcionek...</Text>
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={screenStyles.flex}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{
            headerStyle: { backgroundColor: themeColors.panel },
            headerTintColor: themeColors.text,
            headerTitleStyle: { fontFamily: settings.fontFamily },
          }}
        >
          <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Witaj' }} />
          <Stack.Screen name="Sensor" component={LightSensorScreen} options={{ title: 'Czujnik światła' }} />
          <Stack.Screen name="FlexCard" component={FlexCardScreen} options={{ title: 'Flex i karta' }} />
          <Stack.Screen name="Posts">
            {(props) => (
              <PostsScreen
                {...props}
                messages={messages}
                onDeleteMessage={deleteMessage}
                themeColors={themeColors}
                fontFamily={settings.fontFamily}
              />
            )}
          </Stack.Screen>
          <Stack.Screen
            name="Details"
            options={({ route }) => ({
              title: `Szczegóły wiadomości o id: ${route.params?.postId ?? ''}`,
            })}
          >
            {(props) => (
              <PostDetailsScreen {...props} messages={messages} themeColors={themeColors} fontFamily={settings.fontFamily} />
            )}
          </Stack.Screen>
          <Stack.Screen name="Lab10" options={{ title: 'Poprzednie ćwiczenia' }}>
            {() => <Lab10Screen themeColors={themeColors} settings={settings} onApply={applySettings} fontFamily={settings.fontFamily} />}
          </Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
    </GestureHandlerRootView>
  );
}

const screenStyles = StyleSheet.create({
  flex: { flex: 1 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 14, padding: 16 },
  spacer: { height: 8 },
  headerActions: { flexDirection: 'row', gap: 8 },
  detailsContainer: (themeColors) => ({ flex: 1, gap: 10, padding: 16, backgroundColor: themeColors.background }),
  detailsTitle: (themeColors, fontFamily) => ({ fontSize: 24, fontFamily, color: themeColors.text, fontWeight: '700' }),
  detailsText: (themeColors, fontFamily) => ({ fontSize: 16, fontFamily, color: themeColors.text }),
});

const lab10Styles = StyleSheet.create({
  background: { flex: 1, width: '100%' },
  backgroundImage: { opacity: 0.08, resizeMode: 'contain' },
  container: { padding: 18, gap: 14, alignItems: 'center' },
  subtitle: (themeColors, fontFamily) => ({ fontSize: 16, color: themeColors.text, fontFamily, textAlign: 'center' }),
  staticImage: (resizeMode) => ({ width: '70%', height: 160, resizeMode, borderWidth: 1, borderColor: '#C9D0D6' }),
  dynamicImage: { width: 220, height: 120, resizeMode: 'contain' },
  base64Image: { width: 51, height: 51, resizeMode: 'contain' },
  button: (themeColors) => ({ borderRadius: 8, backgroundColor: themeColors.accent, paddingHorizontal: 12, paddingVertical: 8 }),
  buttonText: { color: '#FFFFFF', fontWeight: '700' },
  themeButtons: { flexDirection: 'row', gap: 10 },
  themeButton: (themeColors) => ({ borderWidth: 1, borderColor: themeColors.tint, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 8, backgroundColor: '#FFFFFFB0' }),
  themeButtonText: { fontWeight: '600', color: '#232323' },
  note: (themeColors, fontFamily) => ({ textAlign: 'center', color: themeColors.text, fontFamily }),
  saved: (themeColors, fontFamily) => ({ color: themeColors.text, fontFamily, fontWeight: '700' }),
});

const sensorStyles = StyleSheet.create({
  sensor: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
  },
  value: {
    fontSize: 18,
  },
  buttonContainer: {
    marginTop: 8,
  },
  button: {
    backgroundColor: '#1E40AF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});

const flexCardStyles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    gap: 20,
    backgroundColor: '#F4F7FB',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  box: (color) => ({
    flex: 1,
    height: 56,
    borderRadius: 12,
    backgroundColor: color,
  }),
  wrapArea: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  wrapChip: {
    minWidth: 52,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 999,
    backgroundColor: '#DDE7F2',
    alignItems: 'center',
  },
  wrapText: {
    fontWeight: '700',
  },
  card: {
    width: 190,
    height: 270,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D9E6',
    alignSelf: 'center',
    padding: 16,
    justifyContent: 'space-between',
    shadowColor: '#000000',
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  cornerTop: {
    fontSize: 22,
    fontWeight: '700',
  },
  cornerBottom: {
    fontSize: 22,
    fontWeight: '700',
    alignSelf: 'flex-end',
  },
  rotatedCorner: {
    transform: [{ rotate: '180deg' }],
  },
  cardCenter: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bigSuit: {
    fontSize: 48,
    lineHeight: 54,
    color: '#C1121F',
  },
  rotatedSuit: {
    transform: [{ rotate: '180deg' }],
    marginTop: 8,
  },
});