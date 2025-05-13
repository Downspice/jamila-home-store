import LottieView from "lottie-react-native";
import { useRef } from "react";
import { View, Text, StyleSheet } from "react-native";
import Button from "./Button";
import { LogIn } from "lucide-react-native";
import { useRouter } from "expo-router";
import { COLORS, SPACING } from "@/constants/theme";

export default function UnAuthenticatedScreen() {
  const animation = useRef<LottieView>(null);
  const router = useRouter();

  return (
    <View style={styles.centerContent}>
      <LottieView
        autoPlay
        ref={animation}
        style={{
          width: 200,
          height: 200,
          backgroundColor: "transparent",
        }}
        source={require("@/assets/lottie/no-auth.json")}
      />

      <Text style={styles.loginMessage}>
        Please sign in to view your profile
      </Text>
      <Button
        title="Sign In"
        icon={<LogIn />}
        iconPosition="right"
        onPress={() => router.push("/login")}
        style={styles.loginButton}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f6f5ed",
  },
  content: {
    flex: 1,
    padding: SPACING.lg,
  },
  profileSection: {
    marginBottom: SPACING.xl,
  },
  profileCard: {
    alignItems: "center",
    padding: SPACING.lg,
  },
  avatarContainer: {
    position: "relative",
    marginBottom: SPACING.md,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  avatarPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  editIcon: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: COLORS.primary,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: COLORS.background,
  },
  username: {
    fontFamily: "Poppins-Bold",
    fontSize: 24,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  email: {
    fontFamily: "Poppins-Regular",
    fontSize: 16,
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
  },
  adminBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.primary + "20",
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: 20,
    marginTop: SPACING.xs,
  },
  adminText: {
    fontFamily: "Poppins-Medium",
    fontSize: 12,
    color: COLORS.primary,
    marginLeft: SPACING.xs,
  },
  statsSection: {
    marginBottom: SPACING.xl,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statCard: {
    flex: 1,
    marginHorizontal: SPACING.xs,
    padding: SPACING.md,
    alignItems: "center",
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.primary + "20",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: SPACING.sm,
  },
  statValue: {
    fontFamily: "Poppins-Bold",
    fontSize: 24,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  statTitle: {
    fontFamily: "Poppins-Regular",
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  menuSection: {
    marginBottom: SPACING.xl,
  },
  menuCard: {
    padding: SPACING.md,
  },
  menuOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary + "20",
    justifyContent: "center",
    alignItems: "center",
    marginRight: SPACING.md,
  },
  menuTitle: {
    flex: 1,
    fontFamily: "Poppins-Medium",
    fontSize: 16,
    color: COLORS.textPrimary,
  },
  chevronContainer: {
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  chevron: {
    fontFamily: "Poppins-Bold",
    fontSize: 24,
    color: COLORS.textSecondary,
  },
  actionsSection: {
    marginBottom: SPACING.xl,
  },
  signOutButton: {
    marginTop: SPACING.lg,
  },
  centerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: SPACING.xl,
  },
  loginMessage: {
    fontFamily: "Poppins-Medium",
    fontSize: 14,
    color: COLORS.textPrimary,
    textAlign: "center",
    marginVertical: SPACING.md,
  },
  loginButton: {
    width: 150,
    paddingVertical: SPACING.sm,
    backgroundColor: COLORS.primary,
  },
});
