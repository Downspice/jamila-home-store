import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { COLORS, SPACING } from "@/constants/theme";
import { useAuth } from "@/context/AuthContext";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { signIn } = useAuth();
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await signIn(email, password);

      if (result?.error) {
        setError(result.error.message);
      } else {
        router.replace("/(tabs)");
      }
    } catch (error: any) {
      setError(error.message || "Failed to sign in");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.background}>
      <View style={styles.diagonalOverlay} />

      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Image
              source={require("@/assets/images/logo.png")}
              style={styles.logo}
            />
            <Text style={styles.title}>Jamila Home</Text>
            <Text style={styles.subtitle}>Elegant Furniture for Your Home</Text>
          </View>

          <View style={styles.formCard}>
            {error && (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            <Input
              label="Email"
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
              autoCapitalize="none"
              keyboardType="email-address"
            />

            <Input
              label="Password"
              value={password}
              onChangeText={setPassword}
              placeholder="Enter your password"
              secureTextEntry
            />

            <Button
              title="Sign In"
              variant="secondary"
              onPress={handleLogin}
              loading={loading}
              style={styles.loginButton}
              fullWidth
            />

            <View style={styles.footer}>
              <Text style={styles.footerText}>
                Don't have an account?
                <Text
                  style={styles.linkText}
                  onPress={() => router.push("/signup")}
                >
                  {" "}
                  Sign Up
                </Text>
              </Text>

              <Text style={styles.footerText}>
                <Text
                  style={styles.linkText}
                  onPress={() => router.push("/")}
                >
                  I’ll sign in later
                </Text>
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: COLORS.screenBackground,
  },
  diagonalOverlay: {
    position: "absolute",
    top: -250,
    left: -100,
    width: "250%",
    height: "250%",
    backgroundColor: COLORS.white,
    transform: [{ rotate: "-25deg" }],
    zIndex: -1,
    borderRadius: 100,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: SPACING.lg,
    paddingTop: 80,
    paddingBottom: SPACING.xxl,
  },
  header: {
    alignItems: "center",
    marginBottom: SPACING.xl,
  },
  logo: {
    width: 160,
    height: 160,
    marginBottom: SPACING.sm,
  },
  title: {
    fontFamily: "Playfair-Bold",
    fontSize: 34,
    color: COLORS.primary,
    textAlign: "center",
  },
  subtitle: {
    fontFamily: "Poppins-Regular",
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: "center",
  },
  formCard: {
    backgroundColor: COLORS.white + "CC",
    borderRadius: 20,
    padding: SPACING.xl,
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
    backdropFilter: "blur(10px)",
  },
  errorBox: {
    backgroundColor: COLORS.error + "15",
    borderRadius: 8,
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  errorText: {
    fontFamily: "Poppins-Medium",
    fontSize: 14,
    color: COLORS.error,
    textAlign: "center",
  },
  loginButton: {
    marginTop: SPACING.md,
  },
  footer: {
    marginTop: SPACING.xl,
    alignItems: "center",
    gap: 10,
  },
  footerText: {
    fontFamily: "Poppins-Regular",
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: "center",
  },
  linkText: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 14,
    color: COLORS.primary,
    textDecorationLine: "underline",
  },
});
