import React from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Linking,
  StyleSheet,
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

const AboutScreen = () => {
  return (
    <View style={styles.container}>
      <Header title={"About Jamila Home"} showBackButton />
      <ScrollView contentContainerStyle={styles.content}>  
        <View style={styles.section}>
          <Text style={styles.appName}>Jamila Home</Text>
          <Text style={styles.description}>
            Jamila Home is your one-stop furniture catalog app, offering a
            curated collection of lifestyle and home products. Browse, create
            catalogs, and connect directly with us.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Key Features</Text>
          <FeatureItem Icon={LayoutGrid} label="Browse All Products" />
          <FeatureItem Icon={PlusSquare} label="Create Personal Catalog" />
          <FeatureItem Icon={Handshake} label="Reach Out to Jamila Homes" />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          <SupportItem
            Icon={Phone}
            text="0577210669"
            onPress={() => Linking.openURL("tel:0577210669")}
          />
          <SupportItem
            Icon={Mail}
            text="joseph.awer@gmail.com"
            onPress={() => Linking.openURL("mailto:joseph.awer@gmail.com")}
          />
          <SupportItem
            Icon={Globe}
            text="jamilahome.com"
            onPress={() => Linking.openURL("https://jamilahome.com")}
          />
        </View>

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
  <Pressable style={styles.itemRow} onPress={onPress}>
    <Icon color={COLORS.primary} size={20} />
    <Text style={[styles.itemLabel, styles.link]}>{text}</Text>
  </Pressable>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9F9F9",
  },
  content: {
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: "700",
    color: COLORS.primary,
    marginBottom: 16,
  },
  appName: {
    fontSize: 20,
    fontWeight: "600",
    color: "#222",
    marginBottom: 6, 
  },
  description: {
    fontSize: 15,
    color: "#444",
    lineHeight: 22,
  },
  section: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
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
