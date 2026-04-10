import "./global.css";
import { useEffect, useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { HomeScreen } from "./src/screens/HomeScreen";
import { SettingsScreen } from "./src/screens/SettingsScreen";
import {
  requestPermission,
  scheduleReminder,
  cancelReminder,
} from "./src/lib/notifications";
import {
  loadReminder,
  saveReminder,
  clearReminder,
  clearDose,
} from "./src/lib/storage";

type Screen = "home" | "settings";

export default function App() {
  const [screen, setScreen] = useState<Screen>("home");
  const [reminderEnabled, setReminderEnabled] = useState(false);
  const [reminderTime, setReminderTime] = useState<Date | null>(null);

  useEffect(() => {
    loadReminder().then((saved) => {
      if (!saved) return;
      const d = new Date();
      d.setHours(saved.hour, saved.minute, 0, 0);
      setReminderTime(d);
      setReminderEnabled(true);
      // Reschedule on every app open in case iOS dropped it
      scheduleReminder(saved.hour, saved.minute);
    });
  }, []);

  async function handleToggleReminder(value: boolean) {
    if (value) {
      const granted = await requestPermission();
      if (!granted) return;
      const d = new Date();
      d.setHours(9, 0, 0, 0);
      setReminderTime(d);
      setReminderEnabled(true);
      await scheduleReminder(9, 0);
      await saveReminder(9, 0);
    } else {
      setReminderEnabled(false);
      setReminderTime(null);
      await cancelReminder();
      await clearReminder();
    }
  }

  async function handleTimeChange(_: unknown, selected?: Date) {
    if (!selected) return;
    setReminderTime(selected);
    await scheduleReminder(selected.getHours(), selected.getMinutes());
    await saveReminder(selected.getHours(), selected.getMinutes());
  }

  if (screen === "settings") {
    return (
      <SafeAreaProvider>
        <SettingsScreen
          reminderEnabled={reminderEnabled}
          reminderTime={reminderTime}
          onTimeChange={handleTimeChange}
          onToggle={handleToggleReminder}
          onReset={clearDose}
          onBack={() => setScreen("home")}
        />
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <HomeScreen
        reminderTime={reminderTime}
        reminderEnabled={reminderEnabled}
        onOpenSettings={() => setScreen("settings")}
      />
    </SafeAreaProvider>
  );
}
