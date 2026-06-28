import { StyleSheet, Text, View, Pressable } from "react-native";
import { Button } from "components/Buttons";
import type {
  HomeCategoryFilter,
  HomeDateFilter,
  HomeFilters,
  HomeLocationFilter,
} from "../hooks/useHomeFilters";
import { colors } from "@shared/constants/tokens/colors";
import { webTypography } from "@shared/constants/tokens/typography";

const FILTER_SIDEBAR_W = 220;
const CARD_RADIUS = 12;
const CARD_PADDING_H = 16;
const CARD_PADDING_V = 20;
const GROUP_GAP = 18;
const LABEL_SIZE = 10;
const OPTION_SIZE = 13;
const WEEKEND_TITLE_SIZE = 19;

type HomeFilterSidebarProps = {
  filters: HomeFilters;
  dateFilters: readonly { key: HomeDateFilter; label: string }[];
  categoryFilters: readonly HomeCategoryFilter[];
  locationFilters: readonly HomeLocationFilter[];
  onToggleDate: (date: HomeDateFilter) => void;
  onToggleCategory: (category: HomeCategoryFilter) => void;
  onToggleLocation: (location: HomeLocationFilter) => void;
  onReset: () => void;
};

const FilterOption = ({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) => (
  <Pressable
    onPress={onPress}
    style={[styles.option, active ? styles.optionActive : null]}
  >
    <Text style={[styles.optionText, active ? styles.optionTextActive : null]}>
      {label}
    </Text>
  </Pressable>
);

export const HomeFilterSidebar = ({
  filters,
  dateFilters,
  categoryFilters,
  locationFilters,
  onToggleDate,
  onToggleCategory,
  onToggleLocation,
  onReset,
}: HomeFilterSidebarProps) => (
  <View style={styles.sidebar}>
    <View style={styles.card}>
      <View style={styles.group}>
        <Text style={styles.label}>When</Text>
        {dateFilters.map((filter) => (
          <FilterOption
            key={filter.key}
            label={filter.label}
            active={filters.date === filter.key}
            onPress={() => onToggleDate(filter.key)}
          />
        ))}
      </View>

      <View style={styles.group}>
        <Text style={styles.label}>Category</Text>
        {categoryFilters.map((category) => (
          <FilterOption
            key={category}
            label={category}
            active={filters.categories.includes(category)}
            onPress={() => onToggleCategory(category)}
          />
        ))}
      </View>

      <View style={styles.group}>
        <Text style={styles.label}>Location</Text>
        {locationFilters.map((location) => (
          <FilterOption
            key={location}
            label={location}
            active={filters.locations.includes(location)}
            onPress={() => onToggleLocation(location)}
          />
        ))}
      </View>

      <Button
        variant="primary"
        text="Reset filters"
        onPress={onReset}
        style={styles.resetButton}
        textStyle={styles.resetButtonText}
      />
    </View>

    <View style={styles.weekendCard}>
      {/* TODO: Wire to plans API when available */}
      <Text style={styles.weekendEyebrow}>For your weekend</Text>
      <Text style={styles.weekendTitle}>3 nights in Westlands</Text>
      <Text style={styles.weekendMeta}>Fri-Sun · Nairobi</Text>
      <Text style={styles.weekendTodo}>Curated starter plan</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  sidebar: {
    width: FILTER_SIDEBAR_W,
    gap: 18,
  },
  card: {
    borderRadius: CARD_RADIUS,
    backgroundColor: colors.pursuitRoseBand,
    paddingHorizontal: CARD_PADDING_H,
    paddingVertical: CARD_PADDING_V,
    gap: GROUP_GAP,
  },
  group: {
    gap: 6,
  },
  label: {
    fontFamily: webTypography.label.fontFamily,
    fontSize: LABEL_SIZE,
    fontWeight: webTypography.label.fontWeight,
    color: colors.pursuitTextMuted,
    textTransform: "uppercase",
    letterSpacing: 1.5,
    marginBottom: 2,
  },
  option: {
    borderLeftWidth: 3,
    borderLeftColor: "transparent",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  optionActive: {
    backgroundColor: "rgba(124,92,156,0.08)",
    borderLeftColor: colors.pursuitPurple,
  },
  optionText: {
    fontFamily: webTypography.body.fontFamily,
    fontSize: OPTION_SIZE,
    fontWeight: "500",
    color: colors.pursuitTextPrimary,
  },
  optionTextActive: {
    fontFamily: webTypography.label.fontFamily,
    fontWeight: webTypography.label.fontWeight,
    color: colors.pursuitPurple,
  },
  resetButton: {
    borderRadius: 24,
    paddingVertical: 12,
    shadowOpacity: 0,
  },
  resetButtonText: {
    fontFamily: webTypography.label.fontFamily,
    fontSize: 14,
    fontWeight: webTypography.label.fontWeight,
  },
  weekendCard: {
    borderRadius: CARD_RADIUS,
    backgroundColor: colors.pursuitRoseBand,
    paddingHorizontal: CARD_PADDING_H,
    paddingVertical: CARD_PADDING_V,
  },
  weekendEyebrow: {
    fontFamily: webTypography.label.fontFamily,
    fontSize: LABEL_SIZE,
    fontWeight: webTypography.label.fontWeight,
    color: colors.leather,
    textTransform: "uppercase",
    letterSpacing: 2,
    marginBottom: 18,
  },
  weekendTitle: {
    fontFamily: webTypography.heading.fontFamily,
    fontSize: WEEKEND_TITLE_SIZE,
    fontWeight: webTypography.heading.fontWeight,
    color: colors.pursuitTextPrimary,
  },
  weekendMeta: {
    marginTop: 8,
    fontFamily: webTypography.body.fontFamily,
    fontSize: OPTION_SIZE,
    color: colors.pursuitTextMuted,
  },
  weekendTodo: {
    marginTop: 10,
    fontFamily: webTypography.label.fontFamily,
    fontSize: 11,
    color: colors.pursuitPurple,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
});
