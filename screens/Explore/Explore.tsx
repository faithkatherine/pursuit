import React, { useState, useMemo } from "react";
import { View, Text, StyleSheet, ScrollView, Pressable, TextInput } from "react-native";
import { useRouter } from "expo-router";
import MapView, { Marker, type MapPressEvent, type Region } from "react-native-maps";
import Svg, { Path } from "react-native-svg";

import { Layout, Error, MasonryGrid } from "components/Layout";
import { Button } from "components/Buttons";
import { BaseModal } from "components/Modals";
import { EventExploreCard } from "components/Cards/EventExploreCard";
import { colors } from "@shared/constants/tokens/colors";
import { useEvents } from "@shared/hooks/useEvents";
import {
  filterByCategory,
  filterBySpecificDate,
  isFeaturedEvent,
} from "@shared/utils/eventFilters";
import {
  isSameDay,
  formatDateLabel,
  getMonthTitle,
  getCalendarDays,
} from "@shared/utils/calendar";

// Import icons from assets
import LocationIcon from "assets/icons/location.svg";
import CloseIcon from "assets/icons/close.svg";
import DateIcon from "assets/icons/date.svg";

// Map configuration
const DEFAULT_MAP_REGION: Region = {
  latitude: -1.2921,
  longitude: 36.8219,
  latitudeDelta: 0.18,
  longitudeDelta: 0.18,
};
const MAP_FILTER_RADIUS_KM = 10;

// Filter categories
const CATEGORIES = [
  "All",
  "Concerts & Nightlife",
  "Outdoors & Active",
  "Arts & Culture",
  "Food & Drink",
  "Markets",
  "Wellness",
  "Talks & Workshops",
];

// Search icon (only one not in assets)
const SearchIcon = () => (
  <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
    <Path
      d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"
      fill={colors.aluminium}
    />
  </Svg>
);

const SearchOffIcon = () => (
  <Svg width={40} height={40} viewBox="0 0 24 24" fill="none">
    <Path
      d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"
      fill={colors.aluminium}
    />
    <Path d="M2 2L22 22" stroke={colors.aluminium} strokeWidth={2} />
  </Svg>
);

export const Explore = () => {
  const router = useRouter();

  // Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [locationFilter, setLocationFilter] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  // Draft state for modals
  const [draftDate, setDraftDate] = useState<Date | null>(null);
  const [draftLocation, setDraftLocation] = useState<typeof locationFilter>(null);

  // Modal state
  const [showDateModal, setShowDateModal] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);

  // Calendar state
  const [calendarMonth, setCalendarMonth] = useState(() => new Date());
  const [mapRegion, setMapRegion] = useState<Region>(DEFAULT_MAP_REGION);

  // Fetch events with location filter
  const { events, loading, error } = useEvents({
    search: searchQuery.trim() || undefined,
    latitude: locationFilter?.latitude,
    longitude: locationFilter?.longitude,
    radiusKm: locationFilter ? MAP_FILTER_RADIUS_KM : undefined,
  });

  // Compute filter labels
  const dateFilterLabel = selectedDate ? formatDateLabel(selectedDate) : "Any date";
  const locationFilterLabel = locationFilter ? "Map area" : "All areas";

  // Generate calendar
  const calendarDays = useMemo(
    () => getCalendarDays(calendarMonth),
    [calendarMonth],
  );
  const calendarTitle = getMonthTitle(calendarMonth);

  // Apply filters (search is handled by backend query)
  const filteredEvents = useMemo(() => {
    if (!events) return [];
    let filtered = filterByCategory(events, selectedCategory);
    filtered = filterBySpecificDate(filtered, selectedDate);
    return filtered;
  }, [events, selectedCategory, selectedDate]);

  // Mark featured events
  const eventsWithFeatured = useMemo(
    () =>
      filteredEvents.map((event, index) => ({
        ...event,
        isFeatured: isFeaturedEvent(event, index),
      })),
    [filteredEvents],
  );

  const hasActiveFilters =
    searchQuery.trim() !== "" ||
    selectedCategory !== "All" ||
    selectedDate !== null ||
    locationFilter !== null;

  // Handlers
  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("All");
    setSelectedDate(null);
    setLocationFilter(null);
  };

  const openDateModal = () => {
    setDraftDate(selectedDate);
    setCalendarMonth(selectedDate || new Date());
    setShowDateModal(true);
  };

  const applyDateFilter = () => {
    setSelectedDate(draftDate);
    setShowDateModal(false);
  };

  const resetDateFilter = () => {
    setSelectedDate(null);
    setShowDateModal(false);
  };

  const openLocationModal = () => {
    setDraftLocation(locationFilter);
    if (locationFilter) {
      setMapRegion({
        ...DEFAULT_MAP_REGION,
        ...locationFilter,
      });
    }
    setShowLocationModal(true);
  };

  const applyLocationFilter = () => {
    setLocationFilter(draftLocation);
    setShowLocationModal(false);
  };

  const resetLocationFilter = () => {
    setLocationFilter(null);
    setShowLocationModal(false);
  };

  const handleMapPress = (event: MapPressEvent) => {
    const coordinate = event.nativeEvent.coordinate;
    setDraftLocation(coordinate);
    setMapRegion((current) => ({
      ...current,
      ...coordinate,
    }));
  };

  const shiftMonth = (direction: number) => {
    setCalendarMonth((current) => {
      const next = new Date(current);
      next.setMonth(current.getMonth() + direction);
      return next;
    });
  };

  if (error) {
    return <Error error={error.message || "Something went wrong"} />;
  }

  return (
    <Layout backgroundColor={colors.ghostWhite} shouldShowTopInset={true}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Search bar */}
        <View style={styles.searchBar}>
          <SearchIcon />
          <TextInput
            style={styles.searchInput}
            placeholder="Search events, venues, neighbourhoods..."
            placeholderTextColor={colors.aluminium}
            value={searchQuery}
            onChangeText={setSearchQuery}
            returnKeyType="search"
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        {/* Category filter chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryContent}
          style={styles.categoryScroll}
        >
          {CATEGORIES.map((category) => (
            <Button
              key={category}
              variant="chips"
              text={category.toUpperCase()}
              selected={selectedCategory === category}
              onPress={() => setSelectedCategory(category)}
            />
          ))}
        </ScrollView>

        {/* Date + Location filters */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterContent}
          style={styles.filterScroll}
        >
          <Pressable
            style={[
              styles.filterChip,
              selectedDate && styles.filterChipActive,
            ]}
            onPress={openDateModal}
          >
            <DateIcon width={16} height={16} fill={selectedDate ? colors.deluge : colors.black} />
            <Text
              style={[
                styles.filterChipText,
                selectedDate && styles.filterChipTextActive,
              ]}
            >
              {dateFilterLabel}
            </Text>
          </Pressable>

          <Pressable
            style={[
              styles.filterChip,
              locationFilter && styles.filterChipActive,
            ]}
            onPress={openLocationModal}
          >
            <LocationIcon width={16} height={16} fill={locationFilter ? colors.deluge : colors.black} />
            <Text
              style={[
                styles.filterChipText,
                locationFilter && styles.filterChipTextActive,
              ]}
              numberOfLines={1}
            >
              {locationFilterLabel}
            </Text>
          </Pressable>
        </ScrollView>

        {/* Content */}
        {loading ? (
          <MasonryGrid>
            {[...Array(6)].map((_, i) => (
              <View
                key={i}
                style={[styles.skeleton, { height: i % 3 === 0 ? 300 : 240 }]}
              />
            ))}
          </MasonryGrid>
        ) : eventsWithFeatured.length === 0 ? (
          <View style={styles.emptyState}>
            <SearchOffIcon />
            <Text style={styles.emptyTitle}>Nothing here yet</Text>
            <Text style={styles.emptyBody}>Try a different category or date</Text>
            {hasActiveFilters && (
              <Button
                variant="primary"
                text="Clear filters"
                onPress={clearFilters}
                style={styles.clearButton}
              />
            )}
          </View>
        ) : (
          <MasonryGrid>
            {eventsWithFeatured.map((event) => (
              <EventExploreCard
                key={event.id}
                event={event}
                isFeatured={event.isFeatured}
                onPress={() => router.push(`/(protected)/events/${event.id}`)}
              />
            ))}
          </MasonryGrid>
        )}
      </ScrollView>

      {/* Date picker modal */}
      <BaseModal
        visible={showDateModal}
        variant="bottomSheet"
        animationType="slide"
        shouldShowCloseIcon={false}
        onClose={() => setShowDateModal(false)}
      >
        <View style={styles.sheet}>
          <View style={styles.sheetHeader}>
            <Text style={styles.sheetTitle}>Select Date</Text>
            <Pressable style={styles.closeButton} onPress={() => setShowDateModal(false)}>
              <CloseIcon width={20} height={20} fill={colors.onSurface} />
            </Pressable>
          </View>

          <View style={styles.calendar}>
            {/* Month navigation */}
            <View style={styles.calendarHeader}>
              <Text style={styles.calendarTitle}>{calendarTitle}</Text>
              <View style={styles.calendarNav}>
                <Pressable
                  style={styles.navButton}
                  onPress={() => shiftMonth(-1)}
                >
                  <Text style={styles.navText}>‹</Text>
                </Pressable>
                <Pressable
                  style={styles.navButton}
                  onPress={() => shiftMonth(1)}
                >
                  <Text style={styles.navText}>›</Text>
                </Pressable>
              </View>
            </View>

            {/* Weekday headers */}
            <View style={styles.weekdays}>
              {["S", "M", "T", "W", "T", "F", "S"].map((day, i) => (
                <Text key={`${day}-${i}`} style={styles.weekday}>
                  {day}
                </Text>
              ))}
            </View>

            {/* Calendar grid */}
            <View style={styles.calendarGrid}>
              {calendarDays.map((date, i) => {
                const selected = date && draftDate ? isSameDay(date, draftDate) : false;
                return (
                  <Pressable
                    key={date?.toISOString() ?? `empty-${i}`}
                    style={[styles.day, selected && styles.daySelected]}
                    disabled={!date}
                    onPress={() => date && setDraftDate(date)}
                  >
                    <Text style={[styles.dayText, selected && styles.dayTextSelected]}>
                      {date?.getDate() ?? ""}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          <View style={styles.sheetFooter}>
            <Button
              variant="secondary"
              text="Reset"
              onPress={resetDateFilter}
              style={styles.footerButton}
            />
            <Button
              variant="primary"
              text="Apply"
              onPress={applyDateFilter}
              style={styles.footerButton}
            />
          </View>
        </View>
      </BaseModal>

      {/* Location picker modal */}
      <BaseModal
        visible={showLocationModal}
        variant="bottomSheet"
        animationType="slide"
        shouldShowCloseIcon={false}
        onClose={() => setShowLocationModal(false)}
      >
        <View style={styles.sheet}>
          <View style={styles.sheetHeader}>
            <Text style={styles.sheetTitle}>Select Location</Text>
            <Pressable style={styles.closeButton} onPress={() => setShowLocationModal(false)}>
              <CloseIcon width={20} height={20} fill={colors.onSurface} />
            </Pressable>
          </View>

          <View style={styles.mapContainer}>
            <MapView
              style={styles.map}
              initialRegion={mapRegion}
              region={mapRegion}
              onPress={handleMapPress}
              onRegionChangeComplete={setMapRegion}
            >
              {draftLocation && (
                <Marker
                  coordinate={draftLocation}
                  title="Selected area"
                  description={`Events within ${MAP_FILTER_RADIUS_KM} km`}
                />
              )}
            </MapView>
            <View style={styles.mapHint}>
              <LocationIcon width={16} height={16} fill={colors.onSurfaceVariant} />
              <Text style={styles.mapHintText}>
                Tap the map to filter nearby events
              </Text>
            </View>
          </View>

          <View style={styles.sheetFooter}>
            <Button
              variant="secondary"
              text="Reset"
              onPress={resetLocationFilter}
              style={styles.footerButton}
            />
            <Button
              variant="primary"
              text="Apply"
              onPress={applyLocationFilter}
              style={styles.footerButton}
            />
          </View>
        </View>
      </BaseModal>
    </Layout>
  );
};

const styles = StyleSheet.create({
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surfaceContainer,
    borderRadius: 24,
    height: 48,
    paddingHorizontal: 16,
    marginHorizontal: 20,
    marginTop: 12,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontFamily: "Manrope",
    fontSize: 14,
    color: colors.onSurface,
    height: "100%",
  },
  categoryScroll: {
    marginTop: 16,
  },
  categoryContent: {
    paddingHorizontal: 20,
    gap: 8,
  },
  filterScroll: {
    marginTop: 12,
  },
  filterContent: {
    paddingHorizontal: 20,
    gap: 10,
  },
  filterChip: {
    flexDirection: "row",
    alignItems: "center",
    height: 36,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: colors.surfaceContainerLow,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    gap: 6,
  },
  filterChipActive: {
    borderColor: colors.deluge,
    backgroundColor: colors.ube50,
  },
  filterChipText: {
    fontFamily: "Manrope",
    fontSize: 13,
    color: colors.black,
  },
  filterChipTextActive: {
    color: colors.deluge,
  },
  skeleton: {
    backgroundColor: colors.surfaceContainerHighest,
    borderRadius: 16,
    opacity: 0.6,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 80,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontFamily: "PlusJakartaSans-Bold",
    fontSize: 20,
    fontWeight: "700",
    color: colors.black,
    marginTop: 16,
  },
  emptyBody: {
    fontFamily: "Manrope",
    fontSize: 14,
    color: colors.aluminium,
    textAlign: "center",
    marginTop: 8,
  },
  clearButton: {
    marginTop: 20,
  },
  sheet: {
    maxHeight: 620,
  },
  sheetHeader: {
    minHeight: 56,
    paddingHorizontal: 24,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.outlineVariant,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sheetTitle: {
    fontFamily: "PlusJakartaSans-Bold",
    fontSize: 20,
    fontWeight: "700",
    color: colors.onSurface,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surfaceContainerLow,
  },
  calendar: {
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  calendarHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  calendarTitle: {
    fontFamily: "PlusJakartaSans-Bold",
    fontSize: 16,
    fontWeight: "700",
    color: colors.onSurface,
  },
  calendarNav: {
    flexDirection: "row",
    gap: 14,
  },
  navButton: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  navText: {
    fontFamily: "PlusJakartaSans-Bold",
    fontSize: 28,
    color: colors.deluge,
    lineHeight: 30,
  },
  weekdays: {
    flexDirection: "row",
    marginBottom: 6,
  },
  weekday: {
    flex: 1,
    textAlign: "center",
    fontFamily: "PlusJakartaSans-Bold",
    fontSize: 11,
    fontWeight: "700",
    color: colors.onSurfaceVariant,
  },
  calendarGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  day: {
    width: `${100 / 7}%`,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
  },
  daySelected: {
    backgroundColor: colors.deluge,
  },
  dayText: {
    fontFamily: "Plus Jakarta Sans",
    fontSize: 14,
    fontWeight: "500",
    color: colors.onSurface,
  },
  dayTextSelected: {
    fontWeight: "700",
    color: colors.white,
  },
  mapContainer: {
    minHeight: 300,
    marginHorizontal: 24,
    marginVertical: 20,
    borderRadius: 18,
    overflow: "hidden",
    backgroundColor: colors.surfaceContainerLow,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  mapHint: {
    position: "absolute",
    left: 14,
    right: 14,
    bottom: 14,
    minHeight: 38,
    paddingHorizontal: 12,
    borderRadius: 19,
    backgroundColor: colors.white,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  mapHintText: {
    fontFamily: "Plus Jakarta Sans",
    fontSize: 13,
    fontWeight: "700",
    color: colors.onSurfaceVariant,
    flexShrink: 1,
  },
  sheetFooter: {
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: colors.outlineVariant,
    flexDirection: "row",
    gap: 12,
  },
  footerButton: {
    flex: 1,
  },
});

export default Explore;
