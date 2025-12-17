import { View, Text, Modal, StyleSheet, Pressable } from "react-native";
import CloseIcon from "assets/icons/close.svg";
import colors from "themes/tokens/colors";
import { Button } from "components/Buttons";

interface BaseModalProps {
  children?: React.ReactNode;
  visible?: boolean;
  shouldShowCloseIcon?: boolean;
  animationType?: "slide" | "fade" | "none";
  onClose?: () => void;
  variant?: "fullScreen" | "bottomSheet";
  title?: string;
  backgroundComponent?: React.ReactNode;
  backgroundColor?: string;
}
export const BaseModal: React.FC<BaseModalProps> = ({
  children,
  visible = false,
  shouldShowCloseIcon = true,
  animationType = "slide",
  onClose,
  variant = "bottomSheet",
  title,
  backgroundComponent,
  backgroundColor = colors.white,
}) => {
  switch (variant) {
    case "bottomSheet":
      return (
        <Modal
          visible={visible}
          animationType={animationType}
          presentationStyle="fullScreen"
          transparent
        >
          <View style={[styles.container, styles.bottomSheetContainer]}>
            <View style={[styles.bottomSheet, { backgroundColor }]}>
              {backgroundComponent && (
                <View style={styles.backgroundContainer}>
                  {backgroundComponent}
                </View>
              )}
              <View style={styles.bottomSheetHandle} />
              {shouldShowCloseIcon && (
                <Button
                  variant="secondary"
                  circleDimensions={{
                    width: 32,
                    height: 32,
                    borderRadius: 16,
                    backgroundColor: colors.black,
                  }}
                  onPress={onClose}
                  icon={
                    <CloseIcon width={24} height={24} color={colors.white} />
                  }
                  style={styles.bottomSheetClose}
                />
              )}
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
          <View style={[styles.fullScreenContainer, { backgroundColor }]}>
            {backgroundComponent && (
              <View style={styles.backgroundContainer}>
                {backgroundComponent}
              </View>
            )}
            <View
              style={[
                styles.fullScreenHeader,
                shouldShowCloseIcon ? { padding: 16 } : {},
              ]}
            >
              {shouldShowCloseIcon && (
                <Button
                  variant="secondary"
                  circleDimensions={{
                    width: 32,
                    height: 32,
                    borderRadius: 16,
                    backgroundColor: colors.black,
                  }}
                  onPress={onClose}
                  icon={
                    <CloseIcon width={24} height={24} color={colors.white} />
                  }
                  style={styles.bottomSheetClose}
                />
              )}
            </View>
            <View
              style={[
                styles.content,
                shouldShowCloseIcon ? { paddingTop: 20 } : {},
              ]}
            >
              {children}
            </View>
          </View>
        </Modal>
      );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    overflow: "hidden",
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
  fullScreenContainer: {
    flex: 1,
  },
  fullScreenHeader: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  backgroundContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  closeIcon: {
    transform: [{ rotate: "90deg" }],
  },
  content: {
    flex: 1,
  },
});
