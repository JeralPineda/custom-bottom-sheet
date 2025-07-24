import BottomSheet2, { BottomSheetRefProps2 } from "@/components/bottom-sheet2";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useRef, useState } from "react";
import { FlatList, LayoutChangeEvent, StyleSheet, View } from "react-native";
import { useSharedValue } from "react-native-reanimated";

interface Item {
  id: number;
  title: string;
  description: string;
}

const fakeData: Item[] = [
  {
    id: 1,
    title: "Item 1",
    description: "Descripción del item 1",
  },
  {
    id: 2,
    title: "Item 2",
    description: "Descripción del item 2",
  },
  {
    id: 3,
    title: "Item 3",
    description: "Descripción del item 3",
  },
  {
    id: 4,
    title: "Item 4",
    description: "Descripción del item 4",
  },
  {
    id: 5,
    title: "Item 5",
    description: "Descripción del item 5",
  },
  {
    id: 6,
    title: "Item 6",
    description: "Descripción del item 6",
  },
  {
    id: 7,
    title: "Item 7",
    description: "Descripción del item 7",
  },
  {
    id: 8,
    title: "Item 8",
    description: "Descripción del item 8",
  },
  {
    id: 9,
    title: "Item 9",
    description: "Descripción del item 9",
  },
  {
    id: 10,
    title: "Item 10",
    description: "Descripción del item 10",
  },
  {
    id: 11,
    title: "Item 11",
    description: "Descripción del item 11",
  },
  {
    id: 12,
    title: "Item 12",
    description: "Descripción del item 12",
  },
  {
    id: 13,
    title: "Item 13",
    description: "Descripción del item 13",
  },
  {
    id: 14,
    title: "Item 14",
    description: "Descripción del item 14",
  },
  {
    id: 15,
    title: "Item 15",
    description: "Descripción del item 15",
  },
  {
    id: 16,
    title: "Item 16",
    description: "Descripción del item 16",
  },
  {
    id: 17,
    title: "Item 17",
    description: "Descripción del item 17",
  },
  {
    id: 18,
    title: "Item 18",
    description: "Descripción del item 18",
  },
  {
    id: 19,
    title: "Item 19",
    description: "Descripción del item 19",
  },
  {
    id: 20,
    title: "Item 20",
    description: "Descripción del item 20",
  },
];

export default function NewBottomSheet() {
  const animateTranslateY = useSharedValue(0);
  const maxUpwardTranslateY = 300;
  const [cardHeight, setCardHeight] = useState(0);

  const ref = useRef<BottomSheetRefProps2 | null>(null);

  const handleLayout = (event: LayoutChangeEvent) => {
    const { height } = event.nativeEvent.layout;
    setCardHeight(height);
  };

  return (
    <ThemedView style={{ flex: 1 }}>
      <View style={{ height: 120 }}>
        <View style={{ flex: 1, position: "relative" }}>
          <View
            style={{
              height: 60,
              paddingVertical: 15,
              backgroundColor: "#d56f6f",
            }}
          ></View>
          {/* Body */}
          <View
            style={{ height: 60, backgroundColor: "#595dd4" }}
            onLayout={handleLayout}
          ></View>
        </View>
      </View>

      <BottomSheet2
        ref={ref}
        maxUpwardTranslation={cardHeight}
        translateY={animateTranslateY}
      >
        <View style={styles.bottomSheetContent}>
          <FlatList
            data={fakeData}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.itemContainer}>
                <View style={styles.itemContent}>
                  <ThemedText style={styles.itemTitle}>{item.title}</ThemedText>
                  <ThemedText style={styles.itemDescription}>
                    {item.description}
                  </ThemedText>
                </View>
              </View>
            )}
            // contentContainerStyle={styles.flatListContent}
            // showsVerticalScrollIndicator={true}
            // scrollEnabled={true}
            // bounces={true}
            alwaysBounceVertical={true}
            // style={{ flex: 1 }}
          />
        </View>
      </BottomSheet2>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 50,
    width: 60,
    height: 60,
  },
  bottomSheetContent: {
    flex: 1,
    // paddingBottom: 50,
  },
  flatListContent: {
    flexGrow: 1,
    padding: 10,
    paddingBottom: 20,
  },
  itemContainer: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  itemContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  itemDescription: {
    fontSize: 14,
    color: "#666",
  },
});
