import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "pill_log";
const REMINDER_KEY = "pill_reminder";

export function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

export async function loadTodayLog(): Promise<string | null> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  const log = JSON.parse(raw);
  return log.date === todayKey() ? log.time : null;
}

export async function saveDose(timeStr: string) {
  await AsyncStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({ date: todayKey(), time: timeStr })
  );
}

export async function clearDose() {
  await AsyncStorage.removeItem(STORAGE_KEY);
}

export async function loadReminder(): Promise<{ hour: number; minute: number } | null> {
  const raw = await AsyncStorage.getItem(REMINDER_KEY);
  if (!raw) return null;
  return JSON.parse(raw);
}

export async function saveReminder(hour: number, minute: number) {
  await AsyncStorage.setItem(REMINDER_KEY, JSON.stringify({ hour, minute }));
}

export async function clearReminder() {
  await AsyncStorage.removeItem(REMINDER_KEY);
}
