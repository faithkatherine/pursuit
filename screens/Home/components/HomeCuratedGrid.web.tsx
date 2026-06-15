import { useState } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { CuratorNote } from "components/Cards/CuratorNote/CuratorNote.web";
import type { EventInfoFragment } from "graphql/generated/graphql";
import HeartIcon from "assets/icons/heart.svg";
import { colors } from "themes/tokens/colors";
import { webTypography } from "themes/tokens/typography";
import { formatEventDate } from "utils/date";
import { getVariant } from "utils/categoryVariants";

const MAX_CONTENT_WIDTH = 1200;
const CONTENT_PADDING_H = 48;
const SECTION_PADDING_Y = 48;
const GRID_GAP = 20;
const CARD_WIDTH = 360;
const CARD_RADIUS = 14;
const IMAGE_HEIGHT = 225;
const CARD_PADDING = 20;
const CATEGORY_SIZE = 11;
const TITLE_SIZE = 18;
const TITLE_LINE_HEIGHT = 24;
const META_SIZE = 13;
const PRICE_SIZE = 14;
const HOVER_LIFT = -4;

type CuratorNoteData = {
  quote: string;
  author: string;
  role: string;
};

type HomeCuratedGridProps = {
  events: EventInfoFragment[];
  title: string;
  curatorNote?: CuratorNoteData;
  showCuratorNote?: boolean;
  onViewAll: () => void;
  onEventPress: (eventId: string) => void;
};

const formatDate = (date: string) => {
  const formatted = formatEventDate(date, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
  return typeof formatted === "string" ? formatted : formatted.formattedDate;
};

const getPriceLabel = (event: EventInfoFragment) =>
  event.isFree ? "Free entry" : `KES ${event.price.toLocaleString()}`;

const EventGridCard = ({
  event,
  onPress,
}: {
  event: EventInfoFragment;
  onPress: () => void;
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const variant = getVariant(event);
  const accentColor = variant?.accentColor ?? colors.pursuitPurple;
  const categoryName = event.category[0]?.name ?? "Event";
  const shouldAnimate =
    typeof window === "undefined" ||
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isLifted = isHovered && shouldAnimate;

  return (
    <Pressable
      style={[styles.card, isLifted ? styles.cardHover : null]}
      onHoverIn={() => setIsHovered(true)}
      onHoverOut={() => setIsHovered(false)}
      onPress={onPress}
    >
      <View style={styles.imageWrap}>
        <Image
          source={{ uri: event.image ?? undefined }}
          style={[styles.image, isLifted ? styles.imageHover : null]}
          resizeMode="cover"
        />
        <View style={styles.heartWrap}>
          <HeartIcon width={24} height={24} color={colors.pursuitTextPrimary} />
        </View>
      </View>
      <View style={styles.cardBody}>
        <Text style={[styles.category, { color: accentColor }]}>
          {categoryName.toUpperCase()}
        </Text>
        <Text style={styles.cardTitle} numberOfLines={2}>
          {event.name}
        </Text>
        <View style={styles.metaRow}>
          <Text style={styles.metaText} numberOfLines={1}>
            {formatDate(event.date)} · {event.locationName ?? "Venue TBA"}
          </Text>
          <Text
            style={[
              styles.priceText,
              event.isFree ? { color: accentColor } : null,
            ]}
          >
            {getPriceLabel(event)}
          </Text>
        </View>
      </View>
    </Pressable>
  );
};

export const HomeCuratedGrid = ({
  events,
  title,
  curatorNote,
  showCuratorNote = false,
  onViewAll,
  onEventPress,
}: HomeCuratedGridProps) => {
  const firstRow = showCuratorNote ? events.slice(0, 3) : events;
  const remaining = showCuratorNote ? events.slice(3) : [];

  return (
    <View style={styles.band}>
      <View style={styles.inner}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{title}</Text>
          <Pressable onPress={onViewAll}>
            <Text style={styles.viewAll}>View All</Text>
          </Pressable>
        </View>

        <View style={styles.grid}>
          {firstRow.map((event) => (
            <View key={event.id} style={styles.gridCell}>
              <EventGridCard
                event={event}
                onPress={() => onEventPress(event.id)}
              />
            </View>
          ))}
          {showCuratorNote && curatorNote && (
            <View style={styles.gridCell}>
              <CuratorNote {...curatorNote} />
            </View>
          )}
          {remaining.map((event) => (
            <View key={event.id} style={styles.gridCell}>
              <EventGridCard
                event={event}
                onPress={() => onEventPress(event.id)}
              />
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  band: {
    width: "100%",
    backgroundColor: colors.pursuitWarmBg,
    paddingVertical: SECTION_PADDING_Y,
  },
  inner: {
    width: "100%",
    maxWidth: MAX_CONTENT_WIDTH,
    marginHorizontal: "auto",
    paddingHorizontal: CONTENT_PADDING_H,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  sectionTitle: {
    fontFamily: webTypography.heading.fontFamily,
    fontSize: 24,
    fontWeight: webTypography.heading.fontWeight,
    color: colors.pursuitTextPrimary,
  },
  viewAll: {
    fontFamily: webTypography.label.fontFamily,
    fontSize: 13,
    fontWeight: "500",
    color: colors.pursuitPurple,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: GRID_GAP,
  },
  gridCell: {
    width: CARD_WIDTH,
  },
  card: {
    width: "100%",
    borderRadius: CARD_RADIUS,
    backgroundColor: colors.white,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(26,26,46,0.08)",
    shadowColor: colors.pursuitTextPrimary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.06,
    shadowRadius: 20,
  },
  cardHover: {
    transform: [{ translateY: HOVER_LIFT }],
    shadowOpacity: 0.14,
  },
  imageWrap: {
    height: IMAGE_HEIGHT,
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  imageHover: {
    transform: [{ scale: 1.05 }],
  },
  heartWrap: {
    position: "absolute",
    top: 16,
    right: 16,
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.white,
  },
  cardBody: {
    padding: CARD_PADDING,
    gap: 8,
  },
  category: {
    fontFamily: webTypography.label.fontFamily,
    fontSize: CATEGORY_SIZE,
    fontWeight: webTypography.label.fontWeight,
    letterSpacing: 1,
  },
  cardTitle: {
    fontFamily: webTypography.heading.fontFamily,
    fontSize: TITLE_SIZE,
    fontWeight: "600",
    lineHeight: TITLE_LINE_HEIGHT,
    color: colors.pursuitTextPrimary,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
  },
  metaText: {
    flex: 1,
    fontFamily: webTypography.body.fontFamily,
    fontSize: META_SIZE,
    fontWeight: webTypography.body.fontWeight,
    color: colors.pursuitTextMuted,
  },
  priceText: {
    fontFamily: webTypography.label.fontFamily,
    fontSize: PRICE_SIZE,
    fontWeight: webTypography.label.fontWeight,
    color: colors.pursuitTextPrimary,
  },
});
