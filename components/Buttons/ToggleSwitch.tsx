import { Switch } from "react-native";
import colors from "themes/tokens/colors";

interface ToggleSwitchProps {
  isEnabled: boolean;
  onToggle: (enabled: boolean) => void;
  style?: object;
}

export const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  isEnabled,
  onToggle,
  style,
}) => {
  return (
    <Switch
      value={isEnabled}
      onValueChange={onToggle}
      thumbColor={isEnabled ? colors.white : colors.graniteGray}
      trackColor={{
        false: colors.white,
        true: colors.black,
      }}
      ios_backgroundColor={colors.aluminium}
      style={[{ transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }] }, style]}
      testID="toggle-switch"
    />
  );
};
