import { Image, StyleSheet, Text, View } from "react-native";
import { Button } from "components/Buttons";
import type { EventInfoFragment } from "graphql/generated/graphql";
import HeartIcon from "assets/icons/heart.svg";
import LocationIcon from "assets/icons/location.svg";
import DateIcon from "assets/icons/date.svg";
import TicketIcon from "assets/icons/ticket.svg";
import { colors } from "themes/tokens/colors";
import { webTypography } from "themes/tokens/typography";
import { formatEventDate } from "utils/date";

const HERO_HEIGHT = 520;
const IMAGE_FLEX = 1.2;
const PANEL_WIDTH = 340;
const PANEL_PADDING_H = 28;
const PANEL_PADDING_V = 32;
const BADGE_TOP = 16;
const BADGE_LEFT = 16;
const BADGE_RADIUS = 4;
const BADGE_FONT_SIZE = 11;
const EYEBROW_SIZE = 11;
const TITLE_SIZE = 38;
const TITLE_LINE_HEIGHT = 42;
const BODY_SIZE = 16;
const BODY_LINE_HEIGHT = 26;
const META_SIZE = 14;
const ICON_SIZE = 18;
const BUTTON_GAP = 14;

type HeroEditorialProps = {
  event: EventInfoFragment;
  editorialNote: string;
  onBook: () => void;
  onSave: () => void;
};

const getDateParts = (date: string) => {
  const formatted = formatEventDate(date, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
  if (typeof formatted === "string") return formatted;
  return `${formatted.formattedDate} · ${formatted.formattedTime}`;
};

const getPriceLabel = (event: EventInfoFragment) =>
  event.isFree ? "Free entry" : `KES ${event.price.toLocaleString()}`;

export const HeroEditorial = ({
  event,
  editorialNote,
  onBook,
  onSave,
}: HeroEditorialProps) => (
  <View style={styles.container}>
    <View style={styles.imageColumn}>
      <Image
        source={{ uri: event.image ?? undefined }}
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.badge}>
        <Text style={styles.badgeText}>EDITOR'S PICK · THIS WEEK</Text>
      </View>
      <View style={styles.heartWrap}>
        <HeartIcon
          width={ICON_SIZE + 4}
          height={ICON_SIZE + 4}
          color={colors.white}
        />
      </View>
    </View>

    <View style={styles.panel}>
      <Text style={styles.eyebrow}>PURSUIT SAYS · FEATURED</Text>
      <Text style={styles.title}>{event.name}</Text>
      <Text style={styles.description}>{editorialNote}</Text>

      <View style={styles.metaRow}>
        <View style={styles.metaItem}>
          <DateIcon width={ICON_SIZE} height={ICON_SIZE} color={colors.white65} />
          <Text style={styles.metaText}>{getDateParts(event.date)}</Text>
        </View>
        <View style={styles.metaItem}>
          <LocationIcon
            width={ICON_SIZE}
            height={ICON_SIZE}
            color={colors.white65}
          />
          <Text style={styles.metaText}>{event.locationName ?? "Venue TBA"}</Text>
        </View>
        <View style={styles.metaItem}>
          <TicketIcon width={ICON_SIZE} height={ICON_SIZE} color={colors.white65} />
          <Text style={styles.metaText}>{getPriceLabel(event)}</Text>
        </View>
      </View>

      <View style={styles.buttonRow}>
        <Button
          variant="primary"
          text="Book Tickets ->"
          onPress={onBook}
          style={styles.primaryButton}
          textStyle={styles.primaryButtonText}
        />
        <Button
          variant="secondary"
          text="Save"
          onPress={onSave}
          style={styles.secondaryButton}
          textStyle={styles.secondaryButtonText}
        />
      </View>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    height: HERO_HEIGHT,
    flexDirection: "row",
    flex: 1,
    backgroundColor: colors.pursuitTextPrimary,
  },
  imageColumn: {
    flex: IMAGE_FLEX,
    position: "relative",
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  badge: {
    position: "absolute",
    top: BADGE_TOP,
    left: BADGE_LEFT,
    borderRadius: BADGE_RADIUS,
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  badgeText: {
    fontFamily: webTypography.label.fontFamily,
    fontSize: BADGE_FONT_SIZE,
    fontWeight: webTypography.label.fontWeight,
    color: colors.white,
    letterSpacing: 1.5,
  },
  heartWrap: {
    position: "absolute",
    top: BADGE_TOP,
    right: BADGE_LEFT,
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  panel: {
    width: PANEL_WIDTH,
    height: HERO_HEIGHT,
    backgroundColor: colors.pursuitTextPrimary,
    paddingHorizontal: PANEL_PADDING_H,
    paddingVertical: PANEL_PADDING_V,
    justifyContent: "center",
  },
  eyebrow: {
    fontFamily: webTypography.label.fontFamily,
    fontSize: EYEBROW_SIZE,
    fontWeight: webTypography.label.fontWeight,
    color: colors.pursuitPurple,
    letterSpacing: 2,
    marginBottom: 16,
  },
  title: {
    fontFamily: webTypography.heading.fontFamily,
    fontSize: TITLE_SIZE,
    fontWeight: webTypography.heading.fontWeight,
    lineHeight: TITLE_LINE_HEIGHT,
    color: colors.white,
    marginBottom: 20,
  },
  description: {
    fontFamily: webTypography.body.fontFamily,
    fontSize: BODY_SIZE,
    fontWeight: webTypography.body.fontWeight,
    lineHeight: BODY_LINE_HEIGHT,
    color: colors.white80,
    marginBottom: 24,
  },
  metaRow: {
    gap: 10,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  metaText: {
    flex: 1,
    fontFamily: webTypography.body.fontFamily,
    fontSize: META_SIZE,
    fontWeight: webTypography.body.fontWeight,
    color: colors.white65,
  },
  buttonRow: {
    flexDirection: "row",
    gap: BUTTON_GAP,
    marginTop: 28,
  },
  primaryButton: {
    width: "auto",
    borderRadius: 24,
    paddingHorizontal: 24,
    paddingVertical: 14,
    shadowOpacity: 0,
  },
  primaryButtonText: {
    fontFamily: webTypography.label.fontFamily,
    fontSize: 15,
    fontWeight: webTypography.label.fontWeight,
  },
  secondaryButton: {
    width: "auto",
    borderRadius: 24,
    backgroundColor: "rgba(255,255,255,0.12)",
    borderColor: "rgba(255,255,255,0.24)",
    paddingHorizontal: 24,
    paddingVertical: 14,
    shadowOpacity: 0,
  },
  secondaryButtonText: {
    fontFamily: webTypography.label.fontFamily,
    fontSize: 15,
    fontWeight: webTypography.label.fontWeight,
    color: colors.white,
  },
});
