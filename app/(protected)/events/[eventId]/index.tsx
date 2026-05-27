import { useLocalSearchParams, useRouter } from "expo-router";
import { EventDetail } from "screens/Events/EventDetail";

const EventDetailScreen = () => {
  const { eventId } = useLocalSearchParams<{ eventId: string }>();
  const router = useRouter();

  const handleClose = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/(protected)/(tabs)");
    }
  };

  return <EventDetail eventId={eventId} onClose={handleClose} />;
};

export default EventDetailScreen;
