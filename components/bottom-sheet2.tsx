import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { forwardRef, useCallback, useState } from "react";
import {
  Dimensions,
  LayoutChangeEvent,
  Pressable,
  StyleSheet,
  useColorScheme,
  View,
} from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  interpolate,
  runOnJS,
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

const MAX_TRANSLATE_Y = -SCREEN_HEIGHT + 50;

type BottomSheetProps = {
  children?: React.ReactNode;
  maxUpwardTranslation: number;
  translateY: SharedValue<number>;
};

export type BottomSheetRefProps2 = {
  scrollTo: (destination: number) => void;
  isActive: () => boolean;
};

const MIN_DOWNWARD_TRANSLATE = 0;

const BottomSheet2 = forwardRef<BottomSheetRefProps2, BottomSheetProps>(
  ({ children, maxUpwardTranslation, translateY }, ref) => {
    const colorScheme = useColorScheme();
    const backgroundColor = colorScheme === "dark" ? "#212121" : "#eeeeee";
    // const insets = useSafeAreaInsets();
    // const headerHeight = useHeaderHeight();

    // const translateY = useSharedValue(0);

    const insets = useSafeAreaInsets();
    const [currentHeight, setCurrentHeight] = useState(0);

    const animatedStyle = useAnimatedStyle(() => {
      // console.log("first");
      return {
        height: interpolate(
          translateY.value,
          [0, maxUpwardTranslation],
          [currentHeight, currentHeight - maxUpwardTranslation]
        ),
        transform: [
          {
            translateY: translateY.value,
          },
        ],
      };
    }, [translateY, maxUpwardTranslation, currentHeight]);

    const handleLayout = (e: LayoutChangeEvent) => {
      setCurrentHeight(e.nativeEvent.layout.height);
    };

    // const active = useSharedValue(false);

    // const isActive = useCallback(() => {
    //   return active.value;
    // }, []);

    // const scrollTo = useCallback((destination: number) => {
    //   "worklet"; //Sin esto se cierra la app y no se puede usar scrollTo

    //   active.value = destination !== 0;

    //   translateY.value = withSpring(destination, { damping: 50 });
    // }, []);

    // useImperativeHandle(
    //   ref,
    //   () => ({
    //     scrollTo,
    //     isActive,
    //   }),
    //   [scrollTo, isActive]
    // );

    // const context = useSharedValue({
    //   y: 0,
    // });

    // const gesture = Gesture.Pan()
    //   .onStart(() => {
    //     context.value = { y: translateY.value };
    //   })
    //   .onUpdate((event) => {
    //     console.log(event.translationY);

    //     translateY.value = event.translationY + context.value.y;
    //     translateY.value = Math.max(translateY.value, maxUpwardTranslation); //-MAX_TRANSLATE_Y + headerHeight(insets.top)
    //   })
    //   .onEnd((event) => {
    //     //* Aqui podria validar con valores minimos y maximos
    //     console.log(event.translationY);
    //     if (translateY.value > -SCREEN_HEIGHT / 3) {
    //       // translateY.value = withSpring(0, { damping: 50 });
    //       scrollTo(0);
    //     } else if (translateY.value < -SCREEN_HEIGHT / 1.5) {
    //       // translateY.value = withSpring(MAX_TRANSLATE_Y, { damping: 50 });
    //       scrollTo(MAX_TRANSLATE_Y);
    //     }
    //   });

    // useEffect(() => {
    //   // translateY.value = withSpring(-SCREEN_HEIGHT / 3, { damping: 50 });
    //   scrollTo(-SCREEN_HEIGHT / 3);
    // }, []);

    // const rBottomSheetStyle = useAnimatedStyle(() => {
    //   const borderRadius = interpolate(
    //     translateY.value,
    //     [MAX_TRANSLATE_Y + 50, MAX_TRANSLATE_Y],
    //     [25, 5],
    //     Extrapolation.CLAMP
    //   );

    //   return {
    //     borderRadius,
    //     transform: [{ translateY: translateY.value }],
    //   };
    // });

    return (
      <View
        style={{
          flex: 1,
          position: "relative",
          paddingBottom: insets.bottom,

          // paddingTop: SCREEN_HEIGHT + insets.top,
        }}
        onLayout={handleLayout}
      >
        <Animated.View
          style={[
            animatedStyle,
            {
              flex: 1,

              position: "absolute",
              left: 0,

              right: 0,
              bottom: 0,
              top: 0,

              backgroundColor: backgroundColor,
              borderTopLeftRadius: 25,
              borderTopRightRadius: 25,
              zIndex: 999,
            },
          ]}
        >
          <BottomSheetHeader
            translateY={translateY}
            maxUpwardTranslate={maxUpwardTranslation}
            minDownwardTranslate={MIN_DOWNWARD_TRANSLATE}
          />

          {children}
        </Animated.View>
      </View>
    );
  }
);

BottomSheet2.displayName = "BottomSheet2";

export default BottomSheet2;

function BottomSheetHeader({
  translateY,
  maxUpwardTranslate,
  minDownwardTranslate,
  dragThreshold = 50,
}: {
  translateY: SharedValue<number>;
  maxUpwardTranslate: number;
  minDownwardTranslate: number;
  dragThreshold?: number;
}) {
  const startY = useSharedValue(0);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const colorScheme = useColorScheme();
  const backgroundColor = colorScheme === "dark" ? "#212121" : "#eeeeee";

  const handleToggleIsCollapsed = useCallback(() => {
    setIsCollapsed(!isCollapsed);
  }, [isCollapsed]);

  const toggleTransactions = useCallback(
    (direction: "up" | "down") => {
      "worklet";
      translateY.value = withSpring(
        direction === "up" ? -maxUpwardTranslate : minDownwardTranslate,
        {
          stiffness: 100,
          damping: 50,
        }
      );
      runOnJS(handleToggleIsCollapsed)();
    },
    [
      handleToggleIsCollapsed,
      maxUpwardTranslate,
      minDownwardTranslate,
      translateY,
    ]
  );

  const panGesture = Gesture.Pan()
    .onStart(() => {
      startY.value = translateY.value;
    })
    .onUpdate((event) => {
      const translationY = event.translationY + startY.value;
      if (translationY > 0) return;
      translateY.value = Math.max(translationY, -maxUpwardTranslate);
    })
    .onEnd((event) => {
      if (event.translationY < 0) {
        if (event.translationY < -dragThreshold) {
          toggleTransactions("up");
        } else {
          toggleTransactions("down");
        }
      } else {
        if (event.translationY > dragThreshold) {
          toggleTransactions("down");
        } else {
          toggleTransactions("up");
        }
      }
    });

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View
        style={[
          // styles.bottomSheetContainer,
          { backgroundColor },
          // rBottomSheetStyle,
        ]}
      >
        <View
          style={[
            styles.line,
            { backgroundColor: Colors[colorScheme ?? "light"].icon },
          ]}
        />

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 15,
            justifyContent: "space-between",
          }}
        >
          <View>
            <ThemedText>Transacciones</ThemedText>
          </View>
          <Pressable
            onPress={() => toggleTransactions(!isCollapsed ? "up" : "down")}
          >
            <ThemedText>{isCollapsed ? "up" : "down"}</ThemedText>
          </Pressable>
        </View>
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  bottomSheetContainer: {
    height: SCREEN_HEIGHT,
    width: "100%",
    // backgroundColor: "white",
    position: "absolute",
    top: SCREEN_HEIGHT,
    // borderRadius: 25,
  },
  line: {
    width: 75,
    height: 4,
    backgroundColor: "gray",
    alignSelf: "center",
    marginVertical: 15,
    borderRadius: 2,
  },
});
