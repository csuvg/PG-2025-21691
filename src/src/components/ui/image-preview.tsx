import { Image } from "expo-image";
import { useState } from "react";
import {
  Dimensions,
  Modal,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

interface ImagePreviewProps {
  imageUrl: string;
  style?: any;
  contentFit?: "cover" | "contain" | "fill" | "none" | "scale-down";
}

export default function ImagePreview({
  imageUrl,
  style,
  contentFit = "cover",
}: ImagePreviewProps) {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <>
      <TouchableOpacity onPress={() => setModalVisible(true)}>
        <Image
          source={{ uri: imageUrl }}
          style={style}
          contentFit={contentFit}
        />
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <Image
              source={{ uri: imageUrl }}
              style={styles.modalImage}
              contentFit="contain"
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: width * 0.9,
    height: height * 0.7,
    justifyContent: "center",
    alignItems: "center",
  },
  modalImage: {
    width: "100%",
    height: "100%",
  },
});
