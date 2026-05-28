import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Pressable,
  BackHandler,
  Linking,
  Dimensions,
  useWindowDimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useQuery } from "@apollo/client";

import { GET_EVENT } from "graphql/queries";
import { GetEventQuery } from "graphql/generated/graphql";
import { EventType } from "graphql/generated/graphql";
import { useSaveToggle } from "hooks/useSaveToggle";

import { Loading, Error } from "components/Layout";
import { SaveButton, BackButton } from "components/Buttons";

import colors from "themes/tokens/colors";
import typography, { fontSizes, fontWeights } from "themes/tokens/typography";
import { spacing, radii, layoutSpacing } from "themes/tokens/spacing";

import { getVariant } from "utils/categoryVariants";

import StarIcon from "assets/icons/star.svg";
import { formatEventDate } from "utils/date";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const HERO_HEIGHT = 400;

interface EventDetailProps {
  eventId: string;
  onClose?: () => void;
}

export const EventDetail = ({ eventId, onClose }: EventDetailProps) => {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [showFullDescription, setShowFullDescription] = useState(false);
  const Width = useWindowDimensions().width - layoutSpacing.cardPadding * 2; // Full width minus horizontal padding

  const { data, loading, error } = useQuery<GetEventQuery>(GET_EVENT, {
    variables: { id: eventId },
    skip: !eventId,
  });

  const event = data?.event?.event as EventType | null;

  const { isSaved, saving, handleSave } = useSaveToggle(
    eventId,
    event?.isSaved || false,
  );

  // Android back button handling
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        if (onClose) {
          onClose();
          return true;
        }
        return false;
      },
    );

    return () => backHandler.remove();
  }, [onClose]);

  if (loading) {
    return <Loading />;
  }

  if (error || !event) {
    return <Error error="Failed to load event details" />;
  }

  const variant = getVariant(event);
  const categoryColor = variant?.cardBackground || colors.deluge;
  const accentColor = variant?.accentColor || colors.roseFog;

  const formatDate = formatEventDate(event.date);

  const truncateText = (text: string, maxLength: number = 150) => {
    if (text.length <= maxLength || showFullDescription) return text;
    return text.substring(0, maxLength) + "...";
  };

  const isExternal = event.source === "external";
  const isFree = event.isFree;

  const handleMoreInfo = () => {
    const link = "https://example.com";
    if (link) {
      Linking.openURL(link);
    }
  };

  const handleBook = () => {
    router.push(`/(protected)/events/${eventId}/checkout`);
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: categoryColor, paddingTop: insets.top },
      ]}
    >
      <View style={[styles.header]}>
        <View style={styles.controls}>
          <BackButton
            onPress={onClose || (() => router.back())}
            size="md"
            iconColor={categoryColor}
            style={{ backgroundColor: accentColor }}
          />
          <SaveButton
            onPress={handleSave}
            isSaved={isSaved}
            loading={saving}
            size="md"
            fillColor={categoryColor}
            style={{ backgroundColor: accentColor }}
          />
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: 100 + insets.bottom },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <View style={styles.eventImageContainer}>
            {/* Image with gradient overlay */}
            <View style={styles.imageSection}>
              <LinearGradient
                colors={["rgba(0,0,0,0.6)", "rgba(0,0,0,0)", "rgba(0,0,0,0.8)"]}
                locations={[0, 0.3, 1]}
                style={styles.heroImageWrapper}
              >
                {event.image ? (
                  <Image
                    source={{ uri: event.image }}
                    style={styles.heroImage}
                  />
                ) : (
                  <View
                    style={[
                      styles.heroImage,
                      { backgroundColor: categoryColor },
                    ]}
                  />
                )}
              </LinearGradient>
            </View>

            {/* Title Band - Bottom section */}
            <View
              style={[styles.titleBand, { backgroundColor: categoryColor }]}
            >
              <Text style={styles.eventTitle}>{event.name}</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    flexDirection: "row",
    paddingHorizontal: spacing.base,
    paddingBottom: spacing.base,
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  controls: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  scrollView: {
    flex: 1,
    backgroundColor: colors.white,
    borderTopRightRadius: radii["2xl"],
    borderTopLeftRadius: radii["2xl"],
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    paddingHorizontal: spacing.base,
    paddingTop: spacing.base,
  },
  eventImageContainer: {
    flexDirection: "column",
    width: "100%",
    aspectRatio: 3 / 4,
    overflow: "hidden",
    borderRadius: radii.lg,
    backgroundColor: colors.white,
  },
  imageSection: {
    flex: 1,
    width: "100%",
    overflow: "hidden",
  },
  heroImageWrapper: {
    flex: 1,
    width: "100%",
  },
  heroImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  titleBand: {
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
    borderBottomLeftRadius: radii.lg,
    borderBottomRightRadius: radii.lg,
  },
  eventTitle: {
    ...typography.h3,
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.semibold,
    color: colors.white,
  },
  detailsContainer: {
    padding: spacing.xl,
  },
  curatorNoteContainer: {
    marginBottom: spacing.xl,
    paddingHorizontal: spacing.sm,
  },
  curatorNote: {
    fontFamily: "Georgia",
    fontStyle: "italic",
    fontSize: fontSizes.base,
    lineHeight: 24,
    color: colors.thunder,
    marginBottom: spacing.xs,
  },
  curatorAttribution: {
    ...typography.bodySmall,
    color: colors.aluminium,
    textAlign: "right",
  },
  metadataGrid: {
    flexDirection: "row",
    marginBottom: spacing.lg,
    paddingVertical: spacing.sm,
  },
  metadataItem: {
    flex: 1,
  },
  metadataLabel: {
    ...typography.label,
    fontSize: fontSizes.sm,
    color: colors.thunder,
    marginBottom: spacing.xs,
  },
  metadataValue: {
    ...typography.bodySmall,
    fontSize: fontSizes.sm,
    color: colors.leather,
  },
  verticalDivider: {
    width: 1,
    backgroundColor: colors.silverSand,
    marginHorizontal: spacing.base,
  },
  attendeesContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  attendeeAvatars: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: radii.full,
    borderWidth: 2,
    borderColor: colors.white,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  ratingValue: {
    ...typography.bodySmall,
    fontSize: fontSizes.base,
    fontWeight: fontWeights.semibold,
    color: colors.thunder,
  },
  aboutSection: {
    marginTop: spacing.base,
  },
  aboutTitle: {
    ...typography.h4,
    fontSize: fontSizes.xl,
    color: colors.thunder,
    marginBottom: spacing.md,
  },
  aboutText: {
    ...typography.body,
    fontSize: fontSizes.sm,
    color: colors.leather,
    lineHeight: 22,
  },
  readMoreText: {
    ...typography.label,
    fontSize: fontSizes.sm,
    color: colors.deluge,
    marginTop: spacing.sm,
  },
  scarcityContainer: {
    marginTop: spacing.lg,
    backgroundColor: colors.roseFog,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radii.sm,
    alignSelf: "flex-start",
  },
  scarcityText: {
    ...typography.caption,
    fontWeight: fontWeights.semibold,
    color: colors.thunder,
  },
  ctaBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.silverSand,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.base,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  fullWidthButton: {
    backgroundColor: colors.deluge,
    paddingVertical: spacing.base,
    borderRadius: radii.md,
    alignItems: "center",
    justifyContent: "center",
  },
  fullWidthButtonText: {
    ...typography.button,
    color: colors.white,
  },
  ticketedBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  priceText: {
    ...typography.h3,
    fontSize: fontSizes["2xl"],
    color: colors.thunder,
  },
  bookButton: {
    backgroundColor: colors.deluge,
    paddingHorizontal: spacing["3xl"],
    paddingVertical: spacing.base,
    borderRadius: radii.md,
  },
  bookButtonText: {
    ...typography.button,
    color: colors.white,
  },
});
