import * as Notifications from "expo-notifications";
import { Alert } from "react-native";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function requestPermission(): Promise<boolean> {
  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== "granted") {
    Alert.alert(
      "Permission needed",
      "Enable notifications in Settings to use reminders."
    );
    return false;
  }
  return true;
}

export async function scheduleReminder(hour: number, minute: number) {
  await Notifications.cancelAllScheduledNotificationsAsync();
  await Notifications.scheduleNotificationAsync({
    content: { title: "Pill reminder", body: "Did you take your pill today?" },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.CALENDAR,
      hour,
      minute,
      repeats: true,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    },
  });
}

export async function cancelReminder() {
  await Notifications.cancelAllScheduledNotificationsAsync();
}
