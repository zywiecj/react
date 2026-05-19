import 'react-native-gesture-handler';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useFonts } from 'expo-font';
import { StatusBar } from 'expo-status-bar';
import { useMemo, useState } from 'react';
import {
  Alert,
  Appearance,
  Button,
  Image,
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
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
    </View>
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