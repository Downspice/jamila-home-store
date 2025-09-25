import React from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Linking,
  StyleSheet,
  Platform,
} from "react-native";
import {
  Phone,
  Mail,
  Globe,
  LayoutGrid,
  PlusSquare,
  Handshake,
} from "lucide-react-native";
import { COLORS } from "@/constants/theme";
import Header from "@/components/shared/Header";
import { Image } from "react-native";
import Logo from "@/assets/images/inapp-logo.png"; // Update path if needed

const AboutScreen = () => {
  return (
    <View style={styles.container}>
      <Header title={"About Jamila Home"} showBackButton />
      <ScrollView contentContainerStyle={styles.content}>
        {/* App Description Section */}
        <View style={[styles.section, styles.centeredSection]}>
          <Image source={Logo} style={styles.logo} resizeMode="contain" />
          <Text style={styles.appName}>Jamila Home</Text>
          <Text style={styles.description}>
            Jamila Home is your one-stop furniture catalog app, offering a
            curated collection of lifestyle and home products. Browse, create
            catalogs, and connect directly with us.
          </Text>
        </View>

        {/* Key Features Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Key Features</Text>
          <FeatureItem Icon={LayoutGrid} label="Browse All Products" />
          <FeatureItem Icon={PlusSquare} label="Create Personal Catalog" />
          <FeatureItem Icon={Handshake} label="Reach Out to Jamila Homes" />
        </View>

        {/* Support Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          <SupportItem
            Icon={Phone}
            text="233 302 437 227"
            onPress={() => Linking.openURL("tel:233302437227")}
          />
          <SupportItem
            Icon={Mail}
            text="info@jamilahome.com"
            onPress={() => Linking.openURL("mailto:joseph.awer@gmail.com")}
          />
          <SupportItem
            Icon={Globe}
            text="jamilahome.com"
            onPress={() => Linking.openURL("https://jamilahome.com")}
          />
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Version 1.0.0</Text>
          <Text style={styles.footerText}>Created by WolfBytes</Text>
        </View>
      </ScrollView>
    </View>
  );
};

const FeatureItem = ({
  Icon,
  label,
}: {
  Icon: React.ComponentType<{ color: string; size?: number }>;
  label: string;
}) => (
  <View style={styles.itemRow}>
    <Icon color={COLORS.primary} size={20} />
    <Text style={styles.itemLabel}>{label}</Text>
  </View>
);

const SupportItem = ({
  Icon,
  text,
  onPress,
}: {
  Icon: React.ComponentType<{ color: string; size?: number }>;
  text: string;
  onPress: () => void;
}) => (
  <Pressable
    style={({ pressed }) => [
      styles.itemRow,
      pressed && { opacity: 0.5 }, // iOS-style feedback
    ]}
    onPress={onPress}
  >
    <Icon color={COLORS.primary} size={20} />
    <Text style={[styles.itemLabel, styles.link]}>{text}</Text>
  </Pressable>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f6f5ed" ,
  },
  content: {
    padding: 20,
  },
  appName: {
    fontSize: 20,
    fontWeight: "700", // Unified across platforms
    color: "#222",
    marginBottom: 6,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 12,
  },
  centeredSection: {
    alignItems: "center",
    textAlign: "center",
  },
  description: {
    fontSize: 15,
    color: "#444",
    lineHeight: 24,
    textAlign: "center", // added
  },
  section: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    // iOS shadow
    shadowColor: "#000",
    shadowOpacity: 0.1, // Increased for better visibility
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
    // Android shadow
    elevation: 4, // Improved elevation
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700", // Consistent font weight
    color: "#333",
    marginBottom: 10,
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
  },
  itemLabel: {
    fontSize: 15,
    marginLeft: 12,
    color: "#333",
    fontWeight: "500",
  },
  link: {
    textDecorationLine: "underline",
    color: COLORS.primary,
  },
  footer: {
    alignItems: "center",
    paddingVertical: 20,
  },
  footerText: {
    fontSize: 13,
    color: "#999",
  },
});

export default AboutScreen;
