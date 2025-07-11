import { Colors } from "@/constants/Colors";
import { forwardRef, useCallback, useImperativeHandle } from "react";
import { Dimensions, StyleSheet, useColorScheme, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

const MAX_TRANSLATE_Y = -SCREEN_HEIGHT + 50;

type BottomSheetProps = {
  children?: React.ReactNode;
};

export type BottomSheetRefProps = {
  scrollTo: (destination: number) => void;
  isActive: () => boolean;
};

const BottomSheet = forwardRef<BottomSheetRefProps, BottomSheetProps>(
  ({ children }, ref) => {
    const colorScheme = useColorScheme();
    const backgroundColor = colorScheme === "dark" ? "#212121" : "#eeeeee";
    // const insets = useSafeAreaInsets();
    // const headerHeight = useHeaderHeight();

    const translateY = useSharedValue(0);
    const active = useSharedValue(false);

    const isActive = useCallback(() => {
      return active.value;
    }, []);

    const scrollTo = useCallback((destination: number) => {
      "worklet"; //Sin esto se cierra la app y no se puede usar scrollTo

      active.value = destination !== 0;

      translateY.value = withSpring(destination, { damping: 50 });
    }, []);

    useImperativeHandle(
      ref,
      () => ({
        scrollTo,
        isActive,
      }),
      [scrollTo, isActive]
    );

    const context = useSharedValue({
      y: 0,
    });

    const gesture = Gesture.Pan()
      .onStart(() => {
        context.value = { y: translateY.value };
      })
      .onUpdate((event) => {
        translateY.value = event.translationY + context.value.y;
        translateY.value = Math.max(translateY.value, MAX_TRANSLATE_Y); //-MAX_TRANSLATE_Y + headerHeight(insets.top)
      })
      .onEnd((event) => {
        //* Aqui podria validar con valores minimos y maximos
        console.log(event.translationY);
        if (translateY.value > -SCREEN_HEIGHT / 3) {
          // translateY.value = withSpring(0, { damping: 50 });
          scrollTo(0);
        } else if (translateY.value < -SCREEN_HEIGHT / 1.5) {
          // translateY.value = withSpring(MAX_TRANSLATE_Y, { damping: 50 });
          scrollTo(MAX_TRANSLATE_Y);
        }
      });

    // useEffect(() => {
    //   // translateY.value = withSpring(-SCREEN_HEIGHT / 3, { damping: 50 });
    //   scrollTo(-SCREEN_HEIGHT / 3);
    // }, []);

    const rBottomSheetStyle = useAnimatedStyle(() => {
      const borderRadius = interpolate(
        translateY.value,
        [MAX_TRANSLATE_Y + 50, MAX_TRANSLATE_Y],
        [25, 5],
        Extrapolation.CLAMP
      );

      return {
        borderRadius,
        transform: [{ translateY: translateY.value }],
      };
    });

    return (
      <GestureDetector gesture={gesture}>
        <Animated.View
          style={[
            styles.bottomSheetContainer,
            { backgroundColor },
            rBottomSheetStyle,
          ]}
        >
          <View
            style={[
              styles.line,
              { backgroundColor: Colors[colorScheme ?? "light"].icon },
            ]}
          />
          <View style={{ height: "100%", marginBottom: 50 }}>{children}</View>
        </Animated.View>
      </GestureDetector>
    );
  }
);

BottomSheet.displayName = "BottomSheet";

export default BottomSheet;

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
