import { Platform, Switch, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import DateTimePicker from "@react-native-community/datetimepicker";
import { BrutalCard } from "../components/BrutalCard";

type Props = {
  reminderEnabled: boolean;
  reminderTime: Date | null;
  onTimeChange: (_: unknown, date?: Date) => void;
  onToggle: (value: boolean) => void;
  onReset: () => void;
  onBack: () => void;
};

export function SettingsScreen({
  reminderEnabled,
  reminderTime,
  onTimeChange,
  onToggle,
  onReset,
  onBack,
}: Props) {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F5F5F0", paddingHorizontal: 24 }}>
      <TouchableOpacity onPress={onBack} style={{ paddingVertical: 12, marginBottom: 24 }}>
        <Text style={{ fontSize: 16, fontWeight: "700", color: "#111" }}>← Back</Text>
      </TouchableOpacity>

      <Text style={{ fontSize: 32, fontWeight: "900", color: "#111", letterSpacing: -1, marginBottom: 32 }}>
        Settings
      </Text>

      {/* Toggle row */}
      <BrutalCard style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
        <View style={{ flex: 1, marginRight: 16 }}>
          <Text style={{ fontSize: 17, fontWeight: "800", color: "#111" }}>Daily reminder</Text>
          <Text style={{ fontSize: 13, color: "#888", marginTop: 2 }}>
            {reminderEnabled ? "You'll get a nudge each day" : "Notifications are off"}
          </Text>
        </View>
        <Switch
          value={reminderEnabled}
          onValueChange={onToggle}
          trackColor={{ false: "#ddd", true: "#2D7A4F" }}
          thumbColor="#fff"
        />
      </BrutalCard>

      {/* Time picker — only visible when enabled */}
      {reminderEnabled && (
        <View style={{ marginTop: 20 }}>
          <BrutalCard>
            <Text style={{ fontSize: 13, fontWeight: "700", letterSpacing: 2, color: "#888", textTransform: "uppercase", marginBottom: 8 }}>
              Remind me at
            </Text>
            <DateTimePicker
              value={reminderTime ?? new Date()}
              mode="time"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={onTimeChange}
              style={{ marginLeft: -8 }}
            />
          </BrutalCard>
        </View>
      )}

      {/* Reset — pinned to bottom */}
      <View style={{ flex: 1, justifyContent: "flex-end", paddingBottom: 16 }}>
        <TouchableOpacity onPress={onReset} style={{ alignSelf: "center", padding: 12 }}>
          <Text style={{ fontSize: 13, color: "#aaa", fontWeight: "600" }}>Reset today's log</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
