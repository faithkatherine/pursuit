import { StyleSheet, View } from "react-native";
import { HeroEditorial } from "components/Cards/HeroEditorial/HeroEditorial.web";
import type { EventInfoFragment } from "graphql/generated/graphql";
import type {
  HomeCategoryFilter,
  HomeDateFilter,
  HomeFilters,
  HomeLocationFilter,
} from "../hooks/useHomeFilters";
import { HomeFilterSidebar } from "./HomeFilterSidebar.web";
import { colors } from "themes/tokens/colors";

const MAX_CONTENT_WIDTH = 1200;
const CONTENT_PADDING_H = 48;
const HERO_HEIGHT = 520;
const GAP = 28;
const SECTION_PADDING_BOTTOM = 48;

type TimeFilterLike = {
  key: HomeDateFilter;
  label: string;
};

type HomeHeroSplitProps = {
  featuredEvent: EventInfoFragment;
  editorialNote: string;
  filters: HomeFilters;
  dateFilters: readonly TimeFilterLike[];
  categoryFilters: readonly HomeCategoryFilter[];
  locationFilters: readonly HomeLocationFilter[];
  onToggleDate: (date: HomeDateFilter) => void;
  onToggleCategory: (category: HomeCategoryFilter) => void;
  onToggleLocation: (location: HomeLocationFilter) => void;
  onReset: () => void;
  onBook: () => void;
  onSave: () => void;
};

export const HomeHeroSplit = ({
  featuredEvent,
  editorialNote,
  filters,
  dateFilters,
  categoryFilters,
  locationFilters,
  onToggleDate,
  onToggleCategory,
  onToggleLocation,
  onReset,
  onBook,
  onSave,
}: HomeHeroSplitProps) => (
  <View style={styles.band}>
    <View style={styles.inner}>
      <HomeFilterSidebar
        filters={filters}
        dateFilters={dateFilters}
        categoryFilters={categoryFilters}
        locationFilters={locationFilters}
        onToggleDate={onToggleDate}
        onToggleCategory={onToggleCategory}
        onToggleLocation={onToggleLocation}
        onReset={onReset}
      />
      <View style={styles.heroWrap}>
        <HeroEditorial
          event={featuredEvent}
          editorialNote={editorialNote}
          onBook={onBook}
          onSave={onSave}
        />
      </View>
    </View>
  </View>
);

const styles = StyleSheet.create({
  band: {
    width: "100%",
    backgroundColor: colors.pursuitWarmBg,
    paddingBottom: SECTION_PADDING_BOTTOM,
  },
  inner: {
    width: "100%",
    maxWidth: MAX_CONTENT_WIDTH,
    marginHorizontal: "auto",
    paddingHorizontal: CONTENT_PADDING_H,
    flexDirection: "row",
    gap: GAP,
    alignItems: "flex-start",
  },
  heroWrap: {
    height: HERO_HEIGHT,
    flex: 1,
    minWidth: 0,
    overflow: "hidden",
    backgroundColor: colors.pursuitTextPrimary,
  },
});
