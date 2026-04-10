import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import Constants from "expo-constants";

const SUPABASE_URL = "https://exhulojxlkovbapnhzme.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV4aHVsb2p4bGtvdmJhcG5oem1lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU4MTMzODksImV4cCI6MjA5MTM4OTM4OX0.CrFu3EuWq-2MkPSs82n_EdCRovRjzb0CTkGApnRBurs";

export async function getExpoPushToken(): Promise<string | null> {
  if (!Device.isDevice) return null;

  const { status } = await Notifications.getPermissionsAsync();
  if (status !== "granted") return null;

  const token = await Notifications.getExpoPushTokenAsync({
    projectId: Constants.expoConfig?.extra?.eas?.projectId,
  });

  return token.data;
}

export async function registerReminderWithBackend(
  hour: number,
  minute: number
): Promise<void> {
  try {
    const token = await getExpoPushToken();
    if (!token) return;

    // Convert local time to UTC
    const localDate = new Date();
    localDate.setHours(hour, minute, 0, 0);
    const utcHour = localDate.getUTCHours();
    const utcMinute = localDate.getUTCMinutes();

    await fetch(`${SUPABASE_URL}/functions/v1/register-reminder`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({
        expoPushToken: token,
        reminderHour: utcHour,
        reminderMinute: utcMinute,
      }),
    });
  } catch {
    // Silently fail — local notification is still the fallback
  }
}
