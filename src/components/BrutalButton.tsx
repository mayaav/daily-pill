import { TouchableOpacity, Text, View } from "react-native";

type Props = {
  label: string;
  onPress: () => void;
  variant?: "primary" | "outline";
};

export function BrutalButton({ label, onPress, variant = "primary" }: Props) {
  const isPrimary = variant === "primary";

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.85}>
      {/* Offset shadow layer */}
      <View
        style={{
          position: "absolute",
          top: 4,
          left: 4,
          right: -4,
          bottom: -4,
          backgroundColor: "#111",
          borderRadius: 4,
        }}
      />
      <View
        style={{
          backgroundColor: isPrimary ? "#2D7A4F" : "#F5F5F0",
          borderWidth: 2.5,
          borderColor: "#111",
          borderRadius: 4,
          paddingVertical: 18,
          paddingHorizontal: 48,
          alignItems: "center",
        }}
      >
        <Text
          style={{
            color: isPrimary ? "#fff" : "#111",
            fontSize: 18,
            fontWeight: "800",
            letterSpacing: 1,
            textTransform: "uppercase",
          }}
        >
          {label}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
