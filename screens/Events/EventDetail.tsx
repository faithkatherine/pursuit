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
  Platform,
  useWindowDimensions,
  type ViewStyle,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useQuery } from "@apollo/client";
import MapView, { Marker } from "react-native-maps";

import { GET_EVENT } from "graphql/queries";
import { GetEventQuery, EventInfoFragment } from "graphql/generated/graphql";
import { useSaveToggle } from "hooks/useSaveToggle";
import { useGoingToggle } from "hooks/useGoingToggle";

import { Loading, Error } from "components/Layout";
import { BackButton, SaveButton, CTAButton } from "components/Buttons";
import { StatTile } from "components/Tiles";
import { Badge } from "components/Badge";
import { SavedIndicator } from "components/SavedIndicator";
import { PriceDisplay } from "components/PriceDisplay";
import { GoingBanner } from "components/GoingBanner";

import colors from "themes/tokens/colors";
import typography, { fontSizes, fontWeights } from "themes/tokens/typography";
import { spacing, radii } from "themes/tokens/spacing";

import { getVariant } from "utils/categoryVariants";
import { formatEventDate, calculateEventDuration, isPastEvent } from "utils/date";
import { getScarcityBadge, getTicketButtonText } from "utils/eventHelpers";

import DateIcon from "assets/icons/date.svg";
import LocationIcon from "assets/icons/location.svg";

const CONTROLS_BAND_HEIGHT = 120;
const BADGE_HEIGHT = 80;
const EVENT_DESKTOP_BREAKPOINT = 1024;
const EVENT_WEB_MAX_WIDTH = 1280;
const stickyPosition = "sticky" as ViewStyle["position"];

interface EventDetailProps {
  eventId: string;
  onClose?: () => void;
}

export const EventDetail = ({ eventId, onClose }: EventDetailProps) => {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const isWeb = Platform.OS === "web";
  const { width } = useWindowDimensions();
  const isDesktopWeb = isWeb && width > EVENT_DESKTOP_BREAKPOINT;

  const { data, loading, error } = useQuery<GetEventQuery>(GET_EVENT, {
    variables: { id: eventId },
    skip: !eventId,
  });

  const event = data?.event?.event as EventInfoFragment | null;

  const { isSaved, saving, handleSave } = useSaveToggle(
    eventId,
    event?.isSaved || false,
  );

  const { isGoing, processing, handleToggle: handleGoingToggle } = useGoingToggle(
    eventId,
    event?.isGoing || false,
  );

  const hasTicket = event?.hasConfirmedTicket || false;

  useEffect(() => {
    if (isWeb) return;

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
  }, [onClose, isWeb]);

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

  // Determine event type based on backend computed fields
  // Type A: Internal Free (isFree=true, isExternal=false)
  // Type B: Internal Paid (isFree=false, isExternal=false, ticketingEnabled=true)
  // Type C: External Free (isFree=true, isExternal=true)
  // Type D: External Paid (isFree=false, isExternal=true)
  const isExternal = event.isExternal || false;
  const isInternalPaid = !isExternal && event.ticketingEnabled && !isFree;

  // Check if event has already passed
  const eventHasPassed = isPastEvent(event.date, event.endDate);

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

  const handleMapPress = () => {
    if (!event.coordinates || event.coordinates.length < 2) return;
    const [lng, lat] = event.coordinates;
    if (lng == null || lat == null) return;
    const label = event.locationName || "Event Location";
    const scheme = Platform.select({
      ios: `maps://app?daddr=${lat},${lng}`,
      android: `geo:${lat},${lng}?q=${lat},${lng}(${encodeURIComponent(label)})`,
    });
    const fallbackUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
    Linking.openURL(scheme || fallbackUrl).catch(() => {
      Linking.openURL(fallbackUrl);
    });
  };

  if (isDesktopWeb) {
    const webPaddingHorizontal = width < 1200 ? 40 : 80;

    return (
      <View style={styles.webDesktopPage}>
        <ScrollView
          style={styles.webDesktopScroll}
          contentContainerStyle={[
            styles.webDesktopContent,
            { paddingHorizontal: webPaddingHorizontal },
          ]}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.webDesktopGrid}>
            <View style={styles.webMainColumn}>
              <View style={styles.webHeroMedia}>
                {event.image ? (
                  <Image
                    source={{ uri: event.image }}
                    style={styles.webHeroImage}
                    resizeMode="cover"
                  />
                ) : (
                  <View
                    style={[
                      styles.webHeroFallback,
                      { backgroundColor: v.colorBandBg },
                    ]}
                  />
                )}
                <View style={styles.webHeroControls}>
                  <BackButton
                    onPress={onClose || (() => router.back())}
                    size="md"
                    iconColor={v.backButtonIcon}
                    style={{ backgroundColor: v.backButtonBg }}
                  />
                </View>
              </View>

              <View
                style={[
                  styles.webTitleBlock,
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
                <Text style={[styles.webEventTitle, { color: v.titleTextColor }]}>
                  {event.name}
                </Text>
              </View>

              <View style={styles.metadataStrip}>
                <View style={styles.metadataColumn}>
                  <DateIcon width={20} height={20} color={v.accentForeground} />
                  <View style={styles.metadataText}>
                    <Text
                      style={[styles.metadataPrimary, { color: colors.thunder }]}
                    >
                      {formattedEndDateTime && eventDuration
                        ? `${formattedDateTime.formattedDate} – ${formattedEndDateTime.formattedDate}`
                        : formattedDateTime.formattedDate}
                    </Text>
                    {formattedDateTime.formattedTime && (
                      <Text
                        style={[
                          styles.metadataSecondary,
                          { color: colors.graniteGray },
                        ]}
                      >
                        {formattedEndDateTime && eventDuration
                          ? `From ${formattedDateTime.formattedTime}`
                          : formattedDateTime.formattedTime}
                      </Text>
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
                      style={[styles.metadataPrimary, { color: colors.thunder }]}
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
                  <Text style={[styles.curatorLabel, { color: colors.thunder }]}>
                    PURSUIT SAYS
                  </Text>
                  <Text style={[styles.curatorText, { color: colors.thunder }]}>
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
                <Text style={[styles.descriptionText, { color: colors.thunder }]}>
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

              {event.coordinates &&
               event.coordinates.length >= 2 &&
               event.coordinates[0] != null &&
               event.coordinates[1] != null && (
                <View style={styles.locationSection}>
                  <Text
                    style={[
                      styles.locationSectionLabel,
                      { color: colors.graniteGray },
                    ]}
                  >
                    LOCATION
                  </Text>
                  <Pressable onPress={handleMapPress} testID="map-view">
                    <MapView
                      style={styles.map}
                      initialRegion={{
                        latitude: event.coordinates[1] as number,
                        longitude: event.coordinates[0] as number,
                        latitudeDelta: 0.01,
                        longitudeDelta: 0.01,
                      }}
                      scrollEnabled={false}
                      zoomEnabled={false}
                      pitchEnabled={false}
                      rotateEnabled={false}
                      pointerEvents="none"
                    >
                      <Marker
                        coordinate={{
                          latitude: event.coordinates[1] as number,
                          longitude: event.coordinates[0] as number,
                        }}
                        pinColor={colors.deluge}
                      />
                    </MapView>
                  </Pressable>
                </View>
              )}
            </View>

            <View style={styles.webAsideColumn}>
              <View style={styles.webBookingPanel}>
                {eventHasPassed ? (
                  <>
                    <Text style={styles.webPanelEyebrow}>Event Status</Text>
                    <Text style={[styles.webPanelTitle, { color: colors.aluminium }]}>
                      This event has passed
                    </Text>
                    {isGoing && (
                      <View style={styles.attendedBadge}>
                        <Text style={[styles.attendedText, { color: v.ctaForeground }]}>
                          ✓ Attended
                        </Text>
                      </View>
                    )}
                  </>
                ) : hasTicket ? (
                  <>
                    <Text style={styles.webPanelEyebrow}>Ticket</Text>
                    <Text style={styles.webPanelTitle}>You're booked</Text>
                    <CTAButton
                      variant="primary"
                      onPress={handleViewTicket}
                      backgroundColor={v.ctaButtonBg}
                      textColor={v.ctaButtonText}
                      fullWidth
                    >
                      View ticket
                    </CTAButton>
                  </>
                ) : isInternalPaid ? (
                  <>
                    <PriceDisplay
                      price={event.price}
                      isFree={event.isFree || false}
                      color={v.ctaForeground}
                    />
                    <CTAButton
                      variant="primary"
                      onPress={handleBuyTicket}
                      disabled={isSoldOut}
                      backgroundColor={
                        isSoldOut ? colors.graniteGray : v.ctaButtonBg
                      }
                      textColor={v.ctaButtonText}
                      fullWidth
                    >
                      {getTicketButtonText(isSoldOut, event.isFree, event.price)}
                    </CTAButton>
                  </>
                ) : isExternal ? (
                  <>
                    <CTAButton
                      variant="outlined"
                      onPress={handleMoreDetails}
                      borderColor={v.ctaForeground}
                      textColor={v.ctaForeground}
                      fullWidth
                    >
                      More details
                    </CTAButton>
                    {isGoing ? (
                      <GoingBanner
                        onPress={handleGoingToggle}
                        backgroundColor={v.ctaButtonBg}
                        textColor={v.ctaButtonText}
                        fullWidth
                        testID="going-banner"
                      />
                    ) : (
                      <CTAButton
                        variant="primary"
                        onPress={handleGoingToggle}
                        backgroundColor={v.ctaButtonBg}
                        textColor={v.ctaButtonText}
                        fullWidth
                        testID="going-button"
                      >
                        {processing ? "..." : "Going"}
                      </CTAButton>
                    )}
                  </>
                ) : isGoing ? (
                  <GoingBanner
                    onPress={handleGoingToggle}
                    backgroundColor={v.ctaButtonBg}
                    textColor={v.ctaButtonText}
                    fullWidth
                    testID="going-banner"
                  />
                ) : (
                  <CTAButton
                    variant="primary"
                    onPress={handleGoingToggle}
                    backgroundColor={v.ctaButtonBg}
                    textColor={v.ctaButtonText}
                    fullWidth
                    testID="going-button"
                  >
                    {processing ? "..." : "Going"}
                  </CTAButton>
                )}

                {isSaved && !eventHasPassed && (
                  <SavedIndicator
                    iconSize={16}
                    iconColor={v.ctaForeground}
                    showBackground
                    backgroundColor={v.curatorNoteBg}
                    textColor={v.ctaForeground}
                  />
                )}
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={[styles.container, isWeb && styles.webContainer]}>
      <View
        style={[
          styles.colorBand,
          {
            backgroundColor: v.colorBandBg,
            paddingTop: isWeb ? spacing.base : insets.top,
          },
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
          { paddingBottom: 100 + (isWeb ? 0 : insets.bottom) },
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

        {event.coordinates &&
         event.coordinates.length >= 2 &&
         event.coordinates[0] != null &&
         event.coordinates[1] != null && (
          <View style={styles.locationSection}>
            <Text
              style={[
                styles.locationSectionLabel,
                { color: colors.graniteGray },
              ]}
            >
              LOCATION
            </Text>
            <Pressable onPress={handleMapPress} testID="map-view">
              <MapView
                style={styles.map}
                initialRegion={{
                  latitude: event.coordinates[1] as number,
                  longitude: event.coordinates[0] as number,
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01,
                }}
                scrollEnabled={false}
                zoomEnabled={false}
                pitchEnabled={false}
                rotateEnabled={false}
                pointerEvents="none"
              >
                <Marker
                  coordinate={{
                    latitude: event.coordinates[1] as number,
                    longitude: event.coordinates[0] as number,
                  }}
                  pinColor={colors.deluge}
                />
              </MapView>
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
            paddingBottom: (isWeb ? 0 : insets.bottom) + spacing.base,
          },
        ]}
      >
        {eventHasPassed ? (
          <View style={styles.ctaContent}>
            <View style={styles.pastEventNotice}>
              <Text style={[styles.pastEventText, { color: colors.aluminium }]}>
                This event has passed
              </Text>
              {isGoing && (
                <View style={styles.attendedBadge}>
                  <Text style={[styles.attendedText, { color: v.ctaForeground }]}>
                    ✓ Attended
                  </Text>
                </View>
              )}
            </View>
          </View>
        ) : hasTicket ? (
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
        ) : isInternalPaid ? (
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
        ) : isExternal ? (
          <View style={styles.ctaContentRow}>
            <CTAButton
              variant="outlined"
              onPress={handleMoreDetails}
              borderColor={v.ctaForeground}
              textColor={v.ctaForeground}
            >
              More details
            </CTAButton>
            {isGoing ? (
              <GoingBanner
                onPress={handleGoingToggle}
                backgroundColor={v.ctaButtonBg}
                textColor={v.ctaButtonText}
                flex={2}
                testID="going-banner"
              />
            ) : (
              <CTAButton
                variant="primary"
                onPress={handleGoingToggle}
                backgroundColor={v.ctaButtonBg}
                textColor={v.ctaButtonText}
                flex={2}
                testID="going-button"
              >
                {processing ? "..." : "Going"}
              </CTAButton>
            )}
          </View>
        ) : (
          <View style={styles.ctaContent}>
            {isGoing ? (
              <GoingBanner
                onPress={handleGoingToggle}
                backgroundColor={v.ctaButtonBg}
                textColor={v.ctaButtonText}
                fullWidth
                testID="going-banner"
              />
            ) : (
              <CTAButton
                variant="primary"
                onPress={handleGoingToggle}
                backgroundColor={v.ctaButtonBg}
                textColor={v.ctaButtonText}
                fullWidth
                testID="going-button"
              >
                {processing ? "..." : "Going"}
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
  webContainer: {
    width: "100%",
    maxWidth: 800,
    marginHorizontal: "auto",
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: colors.silverSand,
  },
  webDesktopPage: {
    flex: 1,
    backgroundColor: "#fcf9f6",
  },
  webDesktopScroll: {
    flex: 1,
  },
  webDesktopContent: {
    width: "100%",
    maxWidth: EVENT_WEB_MAX_WIDTH,
    marginHorizontal: "auto",
    paddingTop: 32,
    paddingBottom: 64,
  },
  webDesktopGrid: {
    flexDirection: "row",
    gap: 40,
    alignItems: "flex-start",
  },
  webMainColumn: {
    flex: 8,
    gap: spacing.lg,
  },
  webAsideColumn: {
    flex: 4,
  },
  webHeroMedia: {
    minHeight: 420,
    borderRadius: 24,
    overflow: "hidden",
    backgroundColor: "#f6f3f0",
    position: "relative",
  },
  webHeroImage: {
    width: "100%",
    height: 420,
  },
  webHeroFallback: {
    width: "100%",
    height: 420,
  },
  webHeroControls: {
    position: "absolute",
    top: 24,
    left: 24,
    right: 24,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  webTitleBlock: {
    gap: spacing.sm,
    borderRadius: 24,
    padding: 24,
  },
  webEventTitle: {
    ...typography.h1,
    fontSize: 40,
    fontWeight: fontWeights.bold,
    lineHeight: 48,
  },
  webBookingPanel: {
    position: stickyPosition,
    top: 96,
    backgroundColor: colors.white,
    borderRadius: 24,
    padding: 32,
    gap: 18,
    shadowColor: "#665382",
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.1,
    shadowRadius: 50,
  },
  webPanelEyebrow: {
    ...typography.caption,
    color: "#4a454e",
    textTransform: "uppercase",
  },
  webPanelTitle: {
    ...typography.h3,
    color: colors.thunder,
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
  locationSection: {
    gap: spacing.sm,
  },
  locationSectionLabel: {
    ...typography.body,
    fontSize: 18,
    fontWeight: fontWeights.semibold,
    letterSpacing: 1,
    textTransform: "uppercase",
    lineHeight: 24,
  },
  map: {
    width: "100%",
    height: 200,
    borderRadius: radii.md,
  },
  pastEventNotice: {
    alignItems: "center",
    gap: spacing.xs,
    paddingVertical: spacing.sm,
  },
  pastEventText: {
    ...typography.body,
    fontSize: fontSizes.base,
    lineHeight: 20,
  },
  attendedBadge: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: radii.sm,
    borderWidth: 1,
    borderColor: colors.deluge,
  },
  attendedText: {
    ...typography.body,
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.medium,
    lineHeight: 16,
  },
});
