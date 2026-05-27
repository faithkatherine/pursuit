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
import { spacing, radii } from "themes/tokens/spacing";

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

  // Fetch event data
  const { data, loading, error } = useQuery<GetEventQuery>(GET_EVENT, {
    variables: { id: eventId },
    skip: !eventId,
  });

  const event = data?.event?.event as EventType | null;

  // Save functionality
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

  // Category color for the band
  const categoryColor = getVariant(event)?.cardBackground || colors.deluge;

  // Format date
  const formatDate = formatEventDate(event.date);

  // Truncate description for "Read More"
  const truncateText = (text: string, maxLength: number = 150) => {
    if (text.length <= maxLength || showFullDescription) return text;
    return text.substring(0, maxLength) + "...";
  };

  // Determine if event is ticketed or external
  const isExternal = event.source === "external";
  const isFree = event.isFree;

  // Handle external link
  const handleMoreInfo = () => {
    // For now, using a placeholder. You'll need to add 'link' field to event schema
    const link = "https://example.com";
    if (link) {
      Linking.openURL(link);
    }
  };

  // Handle book button - navigate to checkout
  const handleBook = () => {
    router.push(`/(protected)/events/${eventId}/checkout`);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: 100 + insets.bottom },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Image with overlay controls */}
        <View style={styles.heroContainer}>
          {/* Header with buttons - overlays at top */}
          <View style={[styles.heroHeader, { paddingTop: insets.top }]}>
            <BackButton onPress={onClose || (() => router.back())} size="md" />
            <SaveButton
              onPress={handleSave}
              isSaved={isSaved}
              loading={saving}
              size="md"
            />
          </View>

          {/* Image with gradient overlay */}
          <LinearGradient
            colors={["rgba(0,0,0,0.4)", "rgba(0,0,0,0)", "rgba(0,0,0,0.6)"]}
            locations={[0, 0.3, 1]}
            style={styles.heroImageWrapper}
          >
            {event.image ? (
              <Image source={{ uri: event.image }} style={styles.heroImage} />
            ) : (
              <View
                style={[styles.heroImage, { backgroundColor: categoryColor }]}
              />
            )}
          </LinearGradient>

          {/* Editor's Pick Badge - overlays image */}
          {event.isEditorsPick && (
            <View style={styles.editorsBadge}>
              <Text style={styles.editorsBadgeText}>Editor's Pick</Text>
            </View>
          )}

          {/* Event Title Band - positioned at bottom of hero */}
          <View style={styles.titleBand}>
            <LinearGradient
              colors={[categoryColor, `${categoryColor}E6`]}
              style={styles.titleGradient}
            >
              <Text style={styles.eventTitle}>{event.name}</Text>
            </LinearGradient>
          </View>
        </View>

        {/* Event Details */}
        <View style={styles.detailsContainer}>
          {/* Curator Note */}
          {event.curatorNote && (
            <View style={styles.curatorNoteContainer}>
              <Text style={styles.curatorNote}>"{event.curatorNote}"</Text>
              {event.curatorName && (
                <Text style={styles.curatorAttribution}>
                  — {event.curatorName}
                </Text>
              )}
            </View>
          )}

          {/* Metadata Grid */}
          <View style={styles.metadataGrid}>
            {/* Date & Time */}
            <View style={styles.metadataItem}>
              <Text style={styles.metadataLabel}>Date:</Text>
              <Text style={styles.metadataValue}>{formatDate}</Text>
            </View>

            {/* Divider */}
            <View style={styles.verticalDivider} />

            {/* Location */}
            <View style={styles.metadataItem}>
              <Text style={styles.metadataLabel}>Location:</Text>
              <Text style={styles.metadataValue}>
                {event.locationName || "TBA"}
              </Text>
            </View>
          </View>

          {/* Second Row: Attendees & Rating */}
          <View style={styles.metadataGrid}>
            {/* Attendees (placeholder) */}
            <View style={styles.metadataItem}>
              <View style={styles.attendeesContainer}>
                {/* Placeholder profile pictures */}
                <View style={styles.attendeeAvatars}>
                  <View
                    style={[styles.avatar, { backgroundColor: colors.deluge }]}
                  />
                  <View
                    style={[
                      styles.avatar,
                      { backgroundColor: colors.careysPink, marginLeft: -8 },
                    ]}
                  />
                  <View
                    style={[
                      styles.avatar,
                      { backgroundColor: colors.leather, marginLeft: -8 },
                    ]}
                  />
                </View>
              </View>
            </View>

            {/* Divider */}
            <View style={styles.verticalDivider} />

            {/* Rating (placeholder) */}
            <View style={styles.metadataItem}>
              <Text style={styles.metadataLabel}>Rate:</Text>
              <View style={styles.ratingContainer}>
                <Text style={styles.ratingValue}>4.8</Text>
                <StarIcon width={16} height={16} fill={colors.mustard} />
              </View>
            </View>
          </View>

          {/* About Section */}
          <View style={styles.aboutSection}>
            <Text style={styles.aboutTitle}>About</Text>
            <Text style={styles.aboutText}>
              {event.description
                ? truncateText(event.description)
                : "No description available."}
            </Text>
            {event.description &&
              event.description.length > 150 &&
              !showFullDescription && (
                <Pressable onPress={() => setShowFullDescription(true)}>
                  <Text style={styles.readMoreText}>Read More</Text>
                </Pressable>
              )}
          </View>

          {/* Scarcity Signal (placeholder) */}
          {/* <View style={styles.scarcityContainer}>
            <Text style={styles.scarcityText}>12 spots left</Text>
          </View> */}
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  heroContainer: {
    width: SCREEN_WIDTH,
    height: HERO_HEIGHT,
    position: "relative",
    overflow: "hidden",
  },
  heroHeader: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: spacing.base,
    paddingBottom: spacing.base,
  },
  heroImageWrapper: {
    width: "100%",
    height: "100%",
    ...StyleSheet.absoluteFillObject,
  },
  heroImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  editorsBadge: {
    position: "absolute",
    top: 80,
    left: spacing.base,
    backgroundColor: colors.white,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radii.sm,
    zIndex: 5,
  },
  editorsBadgeText: {
    ...typography.caption,
    fontWeight: fontWeights.semibold,
    color: colors.thunder,
  },
  titleBand: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  titleGradient: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
  },
  eventTitle: {
    ...typography.h2,
    fontSize: fontSizes["2xl"],
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
