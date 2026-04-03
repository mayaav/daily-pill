import { View, ViewStyle } from "react-native";

type Props = {
  children: React.ReactNode;
  style?: ViewStyle;
  color?: string;
};

export function BrutalCard({ children, style, color = "#fff" }: Props) {
  return (
    <View style={{ position: "relative" }}>
      {/* Offset shadow */}
      <View
        style={{
          position: "absolute",
          top: 5,
          left: 5,
          right: -5,
          bottom: -5,
          backgroundColor: "#111",
          borderRadius: 6,
        }}
      />
      <View
        style={[
          {
            backgroundColor: color,
            borderWidth: 2.5,
            borderColor: "#111",
            borderRadius: 6,
            padding: 24,
          },
          style,
        ]}
      >
        {children}
      </View>
    </View>
  );
}
