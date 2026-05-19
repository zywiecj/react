import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import {
  Button,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';

export default function App() {
  const [on, setOn] = useState(false);
  const [text, setText] = useState('Marek');
  const [light, setLight] = useState(false);
  const [radiusInput, setRadiusInput] = useState('25');
  const [circleColor, setCircleColor] = useState('darkblue');

  const parsedRadius = Number.parseInt(radiusInput, 10);
  const radius = Number.isNaN(parsedRadius) ? 25 : Math.max(10, parsedRadius);

  const getRandomColor = () => {
    const channels = Array.from({ length: 3 }, () =>
      Math.floor(Math.random() * 256)
    );
    return `rgb(${channels[0]}, ${channels[1]}, ${channels[2]})`;
  };

  const handleCirclePress = () => {
    setLight((state) => !state);
    setCircleColor(getRandomColor());
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.paragraph}>
        Hello
        <Text style={styles.bold}> {text}</Text>
        !
      </Text>

      <TextInput
        placeholder="Podaj promien kola"
        value={radiusInput}
        onChangeText={setRadiusInput}
        keyboardType="numeric"
        style={styles.radiusInput}
      />

      <Pressable onPress={handleCirclePress}>
        <View style={styles.circle({ light, radius, color: circleColor })} />
      </Pressable>

      <Button
        title="Click"
        onPress={() => setText('Karol')}
        color="darkblue"
      />

      <TextInput
        placeholder="placeholder"
        multiline
        editable
        numberOfLines={4}
        autoFocus
        keyboardType="default"
        autoCorrect
        style={styles.multiInput}
      />

      <Image
        source={{ uri: 'https://reactnative.dev/img/tiny_logo.png' }}
        style={{ width: 50, height: 150, resizeMode: 'stretch' }}
      />

      <Switch
        onValueChange={() => setOn((state) => !state)}
        value={on}
        thumbColor={on ? 'blue' : 'red'}
      />

      <StatusBar style="auto" />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    paddingVertical: 48,
  },
  paragraph: {
    fontSize: 18,
  },
  bold: {
    fontWeight: 'bold',
  },
  circle: ({ light, radius, color }) => ({
    borderRadius: radius,
    borderWidth: 5,
    borderColor: 'blue',
    width: radius * 2,
    height: radius * 2,
    padding: 5,
    backgroundColor: light ? color : 'darkblue',
  }),
  multiInput: {
    padding: 5,
    textAlignVertical: 'top',
    width: '95%',
    borderWidth: 1,
    borderRadius: 5,
  },
  radiusInput: {
    width: '80%',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
});
