import { View, Text, Modal, StyleSheet, Pressable } from "react-native";
import CloseIcon from "pursuit/assets/icons/close.svg";
import colors from "pursuit/themes/tokens/colors";
import { Button } from "pursuit/components/Buttons";

interface BaseModalProps {
  children?: React.ReactNode;
  visible?: boolean;
  animationType?: "slide" | "fade" | "none";
  onClose?: () => void;
  variant?: "fullScreen" | "bottomSheet";
  title?: string;
}
export const BaseModal: React.FC<BaseModalProps> = ({
  children,
  visible = false,
  animationType = "slide",
  onClose,
  variant = "bottomSheet",
  title,
}) => {
  switch (variant) {
    case "bottomSheet":
      return (
        <Modal
          visible={visible}
          animationType={animationType}
          presentationStyle="pageSheet"
          transparent
        >
          <View style={[styles.container, styles.bottomSheetContainer]}>
            <View style={styles.bottomSheet}>
              <View style={styles.bottomSheetHandle} />
              <Button
                variant="secondary"
                circleDimensions={{
                  width: 32,
                  height: 32,
                  borderRadius: 16,
                  backgroundColor: colors.black,
                }}
                onPress={onClose}
                icon={<CloseIcon width={24} height={24} color={colors.white} />}
                style={styles.bottomSheetClose}
              />
              <View>{children}</View>
            </View>
          </View>
        </Modal>
      );
    case "fullScreen":
      return (
        <Modal
          visible={visible}
          animationType={animationType}
          presentationStyle="formSheet"
        >
          <View style={styles.fullScreenHeader}>
            <Text style={styles.headerTitle}>{title}</Text>
            {onClose && (
              <Pressable onPress={onClose} style={styles.cancelButton}>
                <Text style={styles.cancelText}>Cancel</Text>
              </Pressable>
            )}
          </View>
          <View style={styles.content}>{children}</View>
        </Modal>
      );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  bottomSheetContainer: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  bottomSheet: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingVertical: 12,
    maxHeight: "80%",
  },
  bottomSheetHandle: {
    width: 36,
    height: 4,
    backgroundColor: colors.silverSand,
    borderRadius: 2,
    alignSelf: "center",
  },
  bottomSheetClose: {
    alignSelf: "flex-end",
    marginRight: 8,
  },

  fullScreenHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.silverSand,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.thunder,
    flex: 1,
    textAlign: "center",
  },
  cancelButton: {
    padding: 8,
  },
  cancelText: {
    color: colors.lightBlue,
    fontSize: 16,
    fontWeight: "400",
  },
  closeIcon: {
    transform: [{ rotate: "90deg" }],
  },
  content: {
    flex: 1,
    paddingTop: 20,
  },
});
