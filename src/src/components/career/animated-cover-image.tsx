import { Image } from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";
import { StyleSheet } from "react-native-unistyles";

const AnimatedImage = Animated.createAnimatedComponent(Image);

const COVER_IMAGE_HEIGHT = 350;

interface AnimatedCoverImageProps {
  imageUrl: string;
  scrollOffset: SharedValue<number>;
}

export default function AnimatedCoverImage({
  imageUrl,
  scrollOffset,
}: AnimatedCoverImageProps) {
  const imageAnimatedStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      scrollOffset.value,
      [-COVER_IMAGE_HEIGHT, 0, COVER_IMAGE_HEIGHT],
      [1.5, 1, 1],
      Extrapolation.CLAMP
    );

    const opacity = interpolate(
      scrollOffset.value,
      [0, COVER_IMAGE_HEIGHT / 2],
      [1, 0],
      Extrapolation.CLAMP
    );

    return {
      transform: [{ scale }],
      opacity,
    };
  });

  return (
    <AnimatedImage
      source={{
        uri:
          imageUrl ||
          "https://detrujillo.com/wp-content/uploads/2018/10/ingenieria-mecatronica-1.gif",
      }}
      style={[styles.coverImage, imageAnimatedStyle]}
      resizeMode="cover"
    />
  );
}

const styles = StyleSheet.create(() => ({
  coverImage: {
    width: "100%",
    height: COVER_IMAGE_HEIGHT,
  },
}));

export { COVER_IMAGE_HEIGHT };
