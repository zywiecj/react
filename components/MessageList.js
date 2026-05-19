import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

export function MessageList({ data, onPressItem, selectedId, themeColors, fontFamily }) {
  return (
    <FlatList
      data={data}
      keyExtractor={(item) => String(item.id)}
      contentContainerStyle={styles.list}
      renderItem={({ item }) => {
        const active = item.id === selectedId;

        return (
          <Pressable onPress={() => onPressItem(item.id)}>
            <View style={styles.card(active, themeColors)}>
              <Text style={styles.subject(themeColors, fontFamily)}>{item.subject}</Text>
              <Text style={styles.from(themeColors, fontFamily)}>{item.from}</Text>
            </View>
          </Pressable>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    padding: 12,
    gap: 10,
  },
  card: (active, themeColors) => ({
    backgroundColor: active ? themeColors.tint : themeColors.panel,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: themeColors.tint,
    padding: 12,
    gap: 4,
  }),
  subject: (themeColors, fontFamily) => ({
    color: themeColors.text,
    fontFamily,
    fontSize: 18,
    fontWeight: '700',
  }),
  from: (themeColors, fontFamily) => ({
    color: themeColors.text,
    fontFamily,
    fontSize: 14,
  }),
});
