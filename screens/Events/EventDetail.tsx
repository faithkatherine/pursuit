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
  Alert,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useQuery } from "@apollo/client";

import { GET_EVENT } from "graphql/queries";
import { GetEventQuery } from "graphql/generated/graphql";
import { EventType } from "graphql/generated/graphql";
import { useSaveToggle } from "hooks/useSaveToggle";

import { Loading, Error } from "components/Layout";
import { BackButton, SaveButton, CTAButton } from "components/Buttons";
import { StatTile } from "components/Tiles";
import { Badge } from "components/Badge";
import { SavedIndicator } from "components/SavedIndicator";
import { PriceDisplay } from "components/PriceDisplay";

import colors from "themes/tokens/colors";
import typography, { fontSizes, fontWeights } from "themes/tokens/typography";
import { spacing, radii } from "themes/tokens/spacing";

import { getVariant } from "utils/categoryVariants";
import { formatEventDate, calculateEventDuration } from "utils/date";
import { getScarcityBadge, getTicketButtonText } from "utils/eventHelpers";

import DateIcon from "assets/icons/date.svg";
import LocationIcon from "assets/icons/location.svg";

const CONTROLS_BAND_HEIGHT = 120;
const BADGE_HEIGHT = 80;

interface EventDetailProps {
  eventId: string;
  onClose?: () => void;
}

export const EventDetail = ({ eventId, onClose }: EventDetailProps) => {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const { data, loading, error } = useQuery<GetEventQuery>(GET_EVENT, {
    variables: { id: eventId },
    skip: !eventId,
  });

  const event = data?.event?.event as EventType | null;

  const { isSaved, saving, handleSave } = useSaveToggle(
    eventId,
    event?.isSaved || false,
  );

  const hasTicket = event?.hasConfirmedTicket || false;

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

  // Variant defaults
  const v = variant || {
    // Original properties
    cardBackground: colors.mistLavender,
    badgeBackground: `${colors.mistLavender}95`,
    accentColor: colors.deluge,
    isDark: false,
    // EventDetail properties
    colorBandBg: colors.mistLavender,
    backButtonBg: "rgba(255, 255, 255, 0.85)",
    backButtonIcon: colors.deluge,
    titleContainerBg: `${colors.deluge}14`,
    titleTextColor: colors.thunder,
    badgeTextColor: colors.deluge,
    accentForeground: colors.deluge,
    statTileBg: `${colors.deluge}14`,
    statTileLabelColor: colors.aluminium,
    statTileValueColor: colors.thunder,
    curatorNoteBg: `${colors.deluge}14`,
    curatorNoteBorder: colors.deluge,
    ctaBarBg: colors.mistLavender,
    ctaForeground: colors.deluge,
    ctaButtonBg: colors.deluge,
    ctaButtonText: colors.white,
  };

  const formattedDateTime = formatEventDate(event.date) as {
    formattedDate: string;
    formattedTime: string;
  };
  const formattedEndDateTime = event.endDate
    ? (formatEventDate(event.endDate) as {
        formattedDate: string;
        formattedTime: string;
      })
    : null;

  const eventDuration = calculateEventDuration(event.date, event.endDate);
  const scarcityBadge = getScarcityBadge(event.availableTickets);
  const isSoldOut = event.availableTickets === 0;
  const isFree = event.isFree || event.price === 0;

  // Parse gallery images from JSON string
  const galleryImages =
    event.hasGallery && event.galleryImages
      ? (() => {
          try {
            return typeof event.galleryImages === "string"
              ? JSON.parse(event.galleryImages)
              : event.galleryImages;
          } catch (e) {
            console.error("Failed to parse gallery images:", e);
            return [];
          }
        })()
      : [];

  const handleActionPress = () => {
    if (hasTicket) {
      router.push(`/(protected)/events/${eventId}/confirmation`);
    } else {
      if (isSaved) {
        Alert.alert("Remove from saved events?", "", [
          { text: "Cancel", style: "cancel" },
          { text: "Remove", style: "destructive", onPress: handleSave },
        ]);
      } else {
        handleSave();
      }
    }
  };

  const handleBuyTicket = () => {
    if (isSoldOut) return;
    router.push(`/(protected)/events/${eventId}/checkout`);
  };

  const handleMoreDetails = () => {
    const link = event.moreDetailsUrl || "https://example.com";
    if (link) {
      Linking.openURL(link);
    }
  };

  const handleShare = () => {
    Alert.alert("Share", "Share functionality coming soon");
  };

  const handleViewTicket = () => {
    router.push(`/(protected)/events/${eventId}/confirmation`);
  };

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.colorBand,
          { backgroundColor: v.colorBandBg, paddingTop: insets.top },
        ]}
      >
        <View style={styles.headerControls}>
          <BackButton
            onPress={onClose || (() => router.back())}
            size="md"
            iconColor={v.backButtonIcon}
            style={{ backgroundColor: v.backButtonBg }}
          />
          {hasTicket ? (
            <Pressable
              onPress={handleActionPress}
              disabled={saving}
              style={[
                styles.actionButton,
                { backgroundColor: v.backButtonBg },
              ]}
            >
              {/* TODO: Replace with proper ticket icon when available */}
              <Text
                style={{ color: v.backButtonIcon, fontSize: 20 }}
              >
                🎫
              </Text>
            </Pressable>
          ) : (
            <SaveButton
              onPress={handleActionPress}
              isSaved={isSaved}
              loading={saving}
              size="md"
              fillColor={v.backButtonIcon}
              style={{ backgroundColor: v.backButtonBg }}
            />
          )}
        </View>
      </View>
      <View
        style={[
          styles.eventNameContainer,
          { backgroundColor: v.titleContainerBg },
        ]}
      >
        <View style={styles.badgesContainer}>
          <Badge
            text={(event.category?.[0]?.name || "Event").toUpperCase()}
            backgroundColor={v.badgeBackground}
            textColor={v.badgeTextColor}
          />
          {scarcityBadge && (
            <Badge
              text={scarcityBadge.text}
              backgroundColor={scarcityBadge.color}
            />
          )}
          {isFree ? (
            <Badge text="Free" backgroundColor={v.badgeBackground} />
          ) : (
            hasTicket && (
              <Badge text="Booked" backgroundColor={v.badgeBackground} />
            )
          )}
        </View>
        <Text
          style={[styles.eventTitle, { color: v.titleTextColor }]}
        >
          {event.name}
        </Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: 100 + insets.bottom },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.metadataStrip}>
          <View style={styles.metadataColumn}>
            <DateIcon
              width={20}
              height={20}
              color={v.accentForeground}
            />
            <View style={styles.metadataText}>
              {formattedEndDateTime && eventDuration ? (
                <>
                  <Text
                    style={[
                      styles.metadataPrimary,
                      { color: colors.thunder },
                    ]}
                  >
                    {formattedDateTime.formattedDate} –{" "}
                    {formattedEndDateTime.formattedDate}
                  </Text>
                  {formattedDateTime.formattedTime && (
                    <Text
                      style={[
                        styles.metadataSecondary,
                        { color: colors.graniteGray },
                      ]}
                    >
                      From {formattedDateTime.formattedTime}
                    </Text>
                  )}
                </>
              ) : (
                <>
                  <Text
                    style={[
                      styles.metadataPrimary,
                      { color: colors.thunder },
                    ]}
                  >
                    {formattedDateTime.formattedDate}
                  </Text>
                  {formattedDateTime.formattedTime && (
                    <Text
                      style={[
                        styles.metadataSecondary,
                        { color: colors.graniteGray },
                      ]}
                    >
                      {formattedDateTime.formattedTime}
                    </Text>
                  )}
                </>
              )}
            </View>
          </View>

          <View style={styles.metadataDivider} />

          <View style={styles.metadataColumn}>
            <LocationIcon
              width={20}
              height={20}
              color={v.accentForeground}
            />
            <View style={styles.metadataText}>
              <Text
                style={[
                  styles.metadataPrimary,
                  { color: colors.thunder },
                ]}
              >
                {event.locationName}
              </Text>
            </View>
          </View>
        </View>
        {event.ticketingEnabled && (
          <View style={styles.statStrip}>
            <StatTile
              label="Going"
              value={event.goingCount || "—"}
              backgroundColor={v.statTileBg}
              labelColor={v.statTileLabelColor}
              valueColor={v.statTileValueColor}
              testID="stat-tile-going"
            />

            <StatTile
              label="Entry"
              value={
                isSoldOut
                  ? "Sold out"
                  : isFree
                    ? "Free"
                    : `KES ${event.price?.toLocaleString()}`
              }
              backgroundColor={v.statTileBg}
              labelColor={v.statTileLabelColor}
              valueColor={v.statTileValueColor}
              testID="stat-tile-entry"
            />

            <StatTile
              label="Spots"
              value={
                event.availableTickets === 0
                  ? "Sold out"
                  : event.availableTickets === null ||
                      event.availableTickets === undefined
                    ? "—"
                    : event.availableTickets <= 5
                      ? `${event.availableTickets} left`
                      : `${event.availableTickets} spots`
              }
              backgroundColor={v.statTileBg}
              labelColor={v.statTileLabelColor}
              valueColor={v.statTileValueColor}
              testID="stat-tile-spots"
            />
          </View>
        )}

        {/* Curator Note (conditional) */}
        {event.isEditorsPick && event.curatorNote && (
          <View
            style={[
              styles.curatorNote,
              {
                borderLeftColor: v.curatorNoteBorder,
                backgroundColor: v.curatorNoteBg,
              },
            ]}
          >
            <Text
              style={[
                styles.curatorLabel,
                { color: colors.thunder },
              ]}
            >
              PURSUIT SAYS
            </Text>
            <Text
              style={[
                styles.curatorText,
                { color: colors.thunder },
              ]}
            >
              {event.curatorNote}
            </Text>
            {event.curatorName && (
              <Text
                style={[
                  styles.curatorAttribution,
                  { color: colors.graniteGray },
                ]}
              >
                — {event.curatorName}
              </Text>
            )}
          </View>
        )}

        <View style={styles.descriptionSection}>
          <Text
            style={[
              styles.descriptionText,
              { color: colors.thunder },
            ]}
          >
            {event.description}
          </Text>
        </View>

        {event.hasGallery && galleryImages.length > 0 && (
          <View style={styles.gallerySection}>
            <Text
              style={[
                styles.gallerySectionLabel,
                { color: colors.graniteGray },
              ]}
            >
              GALLERY
            </Text>
            <Pressable
              style={styles.galleryStrip}
              onPress={() => {
                // TODO: Implement full-screen gallery viewer
                Alert.alert(
                  "Gallery",
                  "Full-screen gallery viewer coming soon",
                );
              }}
            >
              {galleryImages
                .slice(0, 3)
                .map((imageUrl: string, index: number) => (
                  <View key={index} style={styles.galleryThumbnail}>
                    {index === 2 && galleryImages.length > 3 ? (
                      <View style={styles.galleryOverlay}>
                        <Image
                          source={{ uri: imageUrl }}
                          style={styles.thumbnailImage}
                        />
                        <View style={styles.galleryOverlayContent}>
                          <Text style={styles.galleryOverlayText}>
                            +{galleryImages.length - 2}
                          </Text>
                        </View>
                      </View>
                    ) : (
                      <Image
                        source={{ uri: imageUrl }}
                        style={styles.thumbnailImage}
                      />
                    )}
                  </View>
                ))}
            </Pressable>
          </View>
        )}
      </ScrollView>

      <View
        style={[
          styles.ctaBar,
          {
            backgroundColor: v.ctaBarBg,
            borderTopColor: `${v.ctaForeground}26`,
            paddingBottom: insets.bottom + spacing.base,
          },
        ]}
      >
        {hasTicket ? (
          <View style={styles.ctaContentRow}>
            <CTAButton
              variant="outlined"
              onPress={handleShare}
              borderColor={v.ctaForeground}
              textColor={v.ctaForeground}
            >
              Share
            </CTAButton>
            <CTAButton
              variant="primary"
              onPress={handleViewTicket}
              backgroundColor={v.ctaButtonBg}
              textColor={v.ctaButtonText}
              flex={2}
            >
              View ticket
            </CTAButton>
          </View>
        ) : event.ticketingEnabled ? (
          <View style={styles.ctaContentRow}>
            <PriceDisplay
              price={event.price}
              isFree={event.isFree || false}
              color={v.ctaForeground}
            />
            <CTAButton
              variant="primary"
              onPress={handleBuyTicket}
              disabled={isSoldOut}
              backgroundColor={isSoldOut ? colors.graniteGray : v.ctaButtonBg}
              textColor={v.ctaButtonText}
              flex={2}
            >
              {getTicketButtonText(isSoldOut, event.isFree, event.price)}
            </CTAButton>
          </View>
        ) : event.moreDetailsUrl ? (
          <View style={styles.ctaContent}>
            <CTAButton
              variant="primary"
              onPress={handleMoreDetails}
              backgroundColor={v.ctaButtonBg}
              textColor={v.ctaButtonText}
              fullWidth
            >
              More details
            </CTAButton>
            {isSaved && (
              <SavedIndicator
                iconSize={12}
                iconColor={v.ctaForeground}
              />
            )}
          </View>
        ) : (
          <View style={styles.ctaContent}>
            {isSaved ? (
              <SavedIndicator
                iconSize={16}
                iconColor={v.ctaForeground}
                showBackground
                backgroundColor={v.curatorNoteBg}
                textColor={v.ctaForeground}
              />
            ) : (
              <CTAButton
                variant="outlined"
                onPress={handleSave}
                disabled={saving}
                borderColor={v.ctaForeground}
                textColor={v.ctaForeground}
                fullWidth
              >
                Save to plans
              </CTAButton>
            )}
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  colorBand: {
    height: CONTROLS_BAND_HEIGHT,
    paddingHorizontal: spacing.base,
    paddingTop: spacing.base,
    justifyContent: "space-between",
  },
  headerControls: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  eventNameContainer: {
    minHeight: BADGE_HEIGHT,
    gap: spacing.sm,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.base,
  },
  badgesContainer: {
    flexDirection: "row",
    gap: spacing.sm,
    flexWrap: "wrap",
  },
  eventTitle: {
    ...typography.h2,
    fontSize: 22,
    fontWeight: fontWeights.medium,
    lineHeight: 28,
    color: colors.white,
  },
  scrollView: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.base,
    paddingTop: spacing.lg,
    gap: spacing.lg,
  },
  metadataStrip: {
    flexDirection: "row",
    gap: spacing.base,
  },
  metadataColumn: {
    flex: 1,
    flexDirection: "row",
    gap: spacing.xs,
  },
  metadataText: {
    flex: 1,
    gap: 2,
  },
  metadataPrimary: {
    ...typography.body,
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.medium,
    lineHeight: 18,
  },
  metadataSecondary: {
    ...typography.body,
    fontSize: fontSizes.xs,
    lineHeight: 16,
  },
  metadataDivider: {
    width: 1,
    backgroundColor: colors.aluminium,
  },
  statStrip: {
    flexDirection: "row",
    gap: spacing.xs,
  },
  curatorNote: {
    minHeight: 80,
    borderLeftWidth: 6,
    borderRadius: radii.md,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    paddingLeft: spacing.sm,
    paddingRight: spacing.sm,
    paddingVertical: spacing.sm,
    gap: spacing.xs,
  },
  curatorLabel: {
    ...typography.body,
    fontSize: 18,
    fontWeight: fontWeights.semibold,
    letterSpacing: 1,
    textTransform: "uppercase",
    lineHeight: 18,
  },
  curatorText: {
    ...typography.body,
    fontSize: 13,
    lineHeight: 19.5,
    fontStyle: "italic",
  },
  curatorAttribution: {
    ...typography.body,
    fontSize: 11,
    fontStyle: "italic",
  },
  descriptionSection: {
    gap: spacing.xs,
  },
  descriptionText: {
    ...typography.body,
    fontSize: 16,
    lineHeight: 22.4,
  },
  gallerySection: {
    gap: spacing.sm,
  },
  gallerySectionLabel: {
    ...typography.body,
    fontSize: 18,
    fontWeight: fontWeights.semibold,
    letterSpacing: 1,
    textTransform: "uppercase",
    lineHeight: 24,
  },
  galleryStrip: {
    flexDirection: "row",
    gap: 6,
  },
  galleryThumbnail: {
    flex: 1,
    height: 100,
    borderRadius: radii.md,
    overflow: "hidden",
  },
  thumbnailImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  galleryOverlay: {
    position: "relative",
    width: "100%",
    height: "100%",
  },
  galleryOverlayContent: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  galleryOverlayText: {
    ...typography.body,
    fontSize: fontSizes.base,
    fontWeight: fontWeights.semibold,
    color: colors.white,
  },
  galleryDescription: {
    ...typography.body,
    fontSize: 11,
    lineHeight: 16.5,
  },
  ctaBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: spacing.base,
    paddingTop: spacing.base,
    borderTopWidth: 0.5,
  },
  ctaContent: {
    gap: spacing.xs,
  },
  ctaContentRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
});
