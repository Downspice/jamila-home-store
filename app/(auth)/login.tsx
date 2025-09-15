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
  ActivityIndicator,
  ImageBackground,
} from "react-native";
import { useRouter } from "expo-router";
import { COLORS, SPACING } from "@/constants/theme";
import { useAuth } from "@/context/AuthContext";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import GoogleSigninButtonComponent from "@/loginComponenets/googleSignIn";

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
    <ImageBackground
      source={require("@/assets/images/onboarding1.png")}
      style={styles.backgroundImage}
      resizeMode="cover" // or "contain", "stretch", "repeat", based on your preference
    >
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
            {/* <Text style={styles.subtitle}>Jamila Home</Text> */}
          </View>

          <View style={styles.formCard}>
            <Text style={styles.formHeader}>Log in to Jamila</Text>

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
              style={styles.input}
            />

            <Input
              label="Password"
              value={password}
              onChangeText={setPassword}
              placeholder="Enter your password"
              secureTextEntry
              style={styles.input}
            />

            <TouchableOpacity onPress={handleLogin}>
              <View style={styles.actionButton}>
                {loading ? (
                  <ActivityIndicator size="small" color={COLORS.primary} />
                ) : (
                  <Text style={styles.buttonText}>Sign In</Text>
                )}
              </View>
            </TouchableOpacity>
            {/* <GoogleSigninButtonComponent /> */}
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
                  onPress={() => router.push("/(tabs)")}
                >
                  I’ll sign in later
                </Text>
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: COLORS.screenBackground,
  },
  backgroundImage: {
    flex: 1,
    width: "100%",
    height: "100%",
    justifyContent: "center",
  },
  container: {
    flex: 1,
  },
  image: {
    flex: 1,
    justifyContent: "center",
    width: "100%", // or fixed pixel value
    height: "100%", // or fixed pixel value
  },
  scrollContent: {
    flexGrow: 1,
    // paddingHorizontal: SPACING.lg,
    paddingTop: 80,
    paddingBottom: SPACING.xxl,
  },
  header: {
    alignItems: "center",
    marginBottom: SPACING.xl,
  },
  logo: {
    width: 200,
    height: 200,
    // marginBottom: SPACING.sm,
  },
  title: {
    fontFamily: "Playfair-Bold",
    fontSize: 34,
    color: COLORS.white,
    textAlign: "center",
  },
  formHeader: {
    fontFamily: "Playfair-Regular",
    fontSize: 25,
    color: COLORS.white,
    textAlign: "center",
  },
  subtitle: {
    fontFamily: "Poppins-Regular",
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: "center",
  },
  actionButton: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 1,
    height: 40,
    borderRadius: 100,
    backgroundColor: COLORS.primary,

    // width: "50%",
  },
  buttonText: {
    color: COLORS.black,
    fontWeight: "600",
    fontSize: 14,
  },
  formCard: {
    // backgroundColor:gradien,
    borderRadius: 20,
    width: "100%",
    shadowColor: "#000",
    padding: SPACING.md,
    shadowOffset: { width: 0, height: 4 },
    // shadowOpacity: 0.15,
    // shadowRadius: 12,
    // elevation: 6,
    // backdropFilter: "blur(10px)",
    position: "absolute",
    bottom: 2,
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
  loginButton: {
    marginTop: SPACING.md,
  },
  footer: {
    marginTop: SPACING.md,
    alignItems: "center",
    gap: 8,
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
  input: {
    width: "100%",
    borderRadius: 1000,
  },
});
