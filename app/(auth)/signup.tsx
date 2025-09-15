import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Image,
} from "react-native";
import { Link, useRouter } from "expo-router";
import { COLORS, SPACING } from "@/constants/theme";
import { useAuth } from "@/context/AuthContext";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { LinearGradient } from "expo-linear-gradient";

export default function SignupScreen() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { signUp } = useAuth();
  const router = useRouter();

  const handleSignup = async () => {
    // Validation
    if (!fullName || !email || !password || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await signUp(email, password, fullName);

      if (result?.error) {
        setError(result.error.message);
      } else {
        router.replace("/(tabs)");
      }
    } catch (error: any) {
      setError(error.message || "Failed to sign up");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.background}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.headerContainer}>
            <Image
              source={require("@/assets/images/logo.png")}
              style={styles.logo}
            />
          </View>

          <View style={styles.formContainer}>
            {error && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>
              Join Jamila Home to explore beautiful furniture
            </Text>
            <Input
              label="Full Name"
              value={fullName}
              onChangeText={setFullName}
              placeholder="Enter your full name"
              style={styles.input}
            />

            <Input
              label="Email"
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
              autoCapitalize="none"
              keyboardType="email-address"
              style={styles.input}
            />

            <Input
              label="Password"
              value={password}
              onChangeText={setPassword}
              placeholder="Create a password"
              secureTextEntry
              style={styles.input}
            />

            <Input
              label="Confirm Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Confirm your password"
              secureTextEntry
              style={styles.input}
            />

            <TouchableOpacity onPress={handleSignup}>
              <View style={styles.actionButton}>
                {loading ? (
                  <ActivityIndicator size="small" color={COLORS.primary} />
                ) : (
                  <Text style={styles.buttonText}>Sign Up</Text>
                )}
              </View>
            </TouchableOpacity>

            <View style={styles.footerContainer}>
              <Text style={styles.footerText}>Already have an account?</Text>
              <Link href="/login" asChild>
                <TouchableOpacity>
                  <Text style={styles.loginLink}>Sign In</Text>
                </TouchableOpacity>
              </Link> 
            </View>
            <View style={styles.footerContainer}> 
              <Text style={styles.footerText}>
                <Text style={styles.linkText} onPress={() => router.push("/(tabs)")}>
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
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: SPACING.sm,
    paddingTop: 80,
    // paddingBottom: SPACING.xxl,
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: SPACING.sm,
  },
  title: {
    fontFamily: "Playfair-Regular",
    fontSize: 25,
    color: COLORS.primary,
    textAlign: "center",
  },
  subtitle: {
    fontFamily: "Poppins-Regular",
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: "center",
    paddingBottom: SPACING.md,
  },
  logo: {
    width: 150,
    height: 150,
  },
  formContainer: {
    // backgroundColor: COLORS.white + "CC",
    // borderRadius: 20,
    width: "100%",
    shadowColor: "#000",
    padding: SPACING.md,
    // shadowOffset: { width: 0, height: 4 },
    // shadowOpacity: 0.15,
    // shadowRadius: 12,
    elevation: 1,
    // backdropFilter: "blur(10px)",
    position: "absolute",
    bottom: 14,
    alignSelf: "center",
  },
  errorBox: {
    backgroundColor: COLORS.error + "15",
    borderRadius: 8,
    padding: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  errorText: {
    fontFamily: "Poppins-Medium",
    fontSize: 14,
    color: COLORS.error,
    textAlign: "center",
    borderRadius: 1000,
  },
  signupButton: {
    marginTop: SPACING.md,
  },
  actionButton: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 1,
    height: 40,
    borderRadius: 100,
    backgroundColor: COLORS.primary,
  },
  buttonText: {
    color: COLORS.black,
    fontWeight: "600",
    fontSize: 14,
  },
  footerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: SPACING.md,
  },
  footerText: {
    fontFamily: "Poppins-Regular",
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  loginLink: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 14,
    color: COLORS.primary,
    marginLeft: SPACING.xs,
  },
  input: {
    width: "100%",
    borderRadius: 1000,
  },
  linkText: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 14,
    color: COLORS.primary,
    textDecorationLine: "underline",
  },
});
