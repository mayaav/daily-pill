import { useEffect, useRef, useState } from "react";
import { Animated, AppState, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import { BrutalButton } from "../components/BrutalButton";
import { BrutalCard } from "../components/BrutalCard";
import { loadTodayLog, saveDose, clearDose } from "../lib/storage";
import { cancelReminder, scheduleReminder } from "../lib/notifications";

const UNDO_DURATION = 60;

type Props = {
  reminderTime: Date | null;
  reminderEnabled: boolean;
  onOpenSettings: () => void;
};

export function HomeScreen({ reminderTime, reminderEnabled, onOpenSettings }: Props) {
  const insets = useSafeAreaInsets();
  const [takenAt, setTakenAt] = useState<string | null>(null);
  const [undoSecondsLeft, setUndoSecondsLeft] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const undoTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    loadTodayLog().then(setTakenAt);

    const sub = AppState.addEventListener("change", (state) => {
      if (state === "active") {
        loadTodayLog().then(setTakenAt);
        // Reschedule daily reminder with correct local time on each foreground
        if (reminderEnabled && reminderTime) {
          scheduleReminder(reminderTime.getHours(), reminderTime.getMinutes());
        }
      }
    });
    return () => sub.remove();
  }, []);

  function animateTransition(fn: () => void) {
    Animated.timing(fadeAnim, { toValue: 0, duration: 150, useNativeDriver: true }).start(() => {
      fn();
      Animated.timing(fadeAnim, { toValue: 1, duration: 250, useNativeDriver: true }).start();
    });
  }

  async function logDose() {
    const timeStr = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    await saveDose(timeStr);
    await cancelReminder();
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    animateTransition(() => setTakenAt(timeStr));
    startUndoTimer();
  }

  async function undoDose() {
    await clearDose();
    if (reminderEnabled && reminderTime) {
      await scheduleReminder(reminderTime.getHours(), reminderTime.getMinutes());
    }
    clearUndoTimer();
    setUndoSecondsLeft(0);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    animateTransition(() => setTakenAt(null));
  }

  function startUndoTimer() {
    setUndoSecondsLeft(UNDO_DURATION);
    undoTimer.current = setInterval(() => {
      setUndoSecondsLeft((s) => {
        if (s <= 1) { clearUndoTimer(); return 0; }
        return s - 1;
      });
    }, 1000);
  }

  function clearUndoTimer() {
    if (undoTimer.current) { clearInterval(undoTimer.current); undoTimer.current = null; }
  }

  const isTaken = takenAt !== null;
  const bg = isTaken ? "#2D7A4F" : "#F5F5F0";

  return (
    <View style={{ flex: 1, backgroundColor: bg }}>
        {/* Header */}
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 24, paddingTop: insets.top + 8, paddingBottom: 4 }}>
          <Text style={{ fontSize: 13, fontWeight: "700", letterSpacing: 2, color: isTaken ? "rgba(255,255,255,0.6)" : "#999", textTransform: "uppercase" }}>
            Daily Pill
          </Text>
          <TouchableOpacity onPress={onOpenSettings} hitSlop={12}>
            <Text style={{ fontSize: 20, color: isTaken ? "rgba(255,255,255,0.6)" : "#999" }}>⚙</Text>
          </TouchableOpacity>
        </View>

        {/* Main content */}
        <Animated.View style={{ flex: 1, justifyContent: "center", alignItems: "center", paddingHorizontal: 32, gap: 32, opacity: fadeAnim }}>
          {isTaken ? (
            <>
              <BrutalCard color="#fff" style={{ alignItems: "center", width: "100%" }}>
                <Text style={{ fontSize: 64, marginBottom: 8 }}>✓</Text>
                <Text style={{ fontSize: 36, fontWeight: "900", color: "#111", letterSpacing: -1 }}>
                  Taken
                </Text>
                <Text style={{ fontSize: 16, color: "#555", marginTop: 4, fontWeight: "600" }}>
                  at {takenAt}
                </Text>
              </BrutalCard>

              {undoSecondsLeft > 0 && (
                <BrutalButton
                  label={`Undo (${undoSecondsLeft}s)`}
                  onPress={undoDose}
                  variant="outline"
                />
              )}
            </>
          ) : (
            <>
              <BrutalCard style={{ alignItems: "center", width: "100%" }}>
                <Text style={{ fontSize: 32, fontWeight: "900", color: "#111", textAlign: "center", lineHeight: 40, letterSpacing: -0.5 }}>
                  Did you take{"\n"}your pill today?
                </Text>
              </BrutalCard>

              <BrutalButton label="I took it" onPress={logDose} />
            </>
          )}
        </Animated.View>
    </View>
  );
}
