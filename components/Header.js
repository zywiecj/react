import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, Text, View } from 'react-native';

export function Header({ children, size = 30, themeColors, fontFamily }) {
  return (
    <View style={styles.row}>
      <Ionicons name="color-palette-outline" color={themeColors.tint} size={26} />
      <Text style={styles.header(size, themeColors, fontFamily)}>{children}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
  },
  header: (x, themeColors, fontFamily) => ({
    fontSize: x,
    lineHeight: x + 4,
    marginTop: -2,
    fontFamily,
    color: themeColors.text,
  }),
});
