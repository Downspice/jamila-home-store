import {
  Bell,
  Bookmark,
  HelpCircle,
  Info,
  Lock,
  LogOut,
  Settings,
  UserCircle,
} from "lucide-react-native";
import { useRouter } from "expo-router";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useProfile } from "@/hooks/useProfile";
import { COLORS, SPACING } from "@/constants/theme";
import Button from "@/components/ui/Button";
import { useAvatar } from "@/hooks/useAvatar";
import { supabase } from "@/lib/supabase";
import Header from "@/components/shared/Header";
import UnAuthenticatedScreen from "@/components/ui/UnauthenticatedScreen";

export default function ProfileScreen() {
  const router = useRouter();
  const { user, signOut, isAdmin } = useAuth();
  const { refreshing, onRefresh } = useProfile();
  const { uploadAvatar } = useAvatar();
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    if (user) fetchProfile();
  }, [user]);

  const fetchProfile = async () => {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user?.id)
      .single();
    setProfile(data);
  };

  const handleAvatarUpdate = async () => {
    if (!user) return;
    const url = await uploadAvatar(user.id, profile?.avatar_url);
    if (url) setProfile({ ...profile, avatar_url: url });
  };

  const handleSignOut = async () => {
    await signOut();
    router.replace("/");
  };

  const Option = ({ icon, label, onPress }: any) => (
    <TouchableOpacity
      style={styles.optionRow}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.optionIcon}>{icon}</View>
      <Text style={styles.optionLabel}>{label}</Text>
      <Text style={styles.chevron}>›</Text>
    </TouchableOpacity>
  );

    if (!user) {
      return (
        <View style={styles.container}>
          <Header title="Profile" showBackButton={false} />
          <UnAuthenticatedScreen/>
        </View>
      );
    }
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 30 }}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={COLORS.primary}
        />
      }
    >
      <Header
        title="Profile"
        showBackButton={false}
        transparent={false}
        showProfile={true}
      />
      <TouchableOpacity
        style={styles.avatarContainer}
        onPress={handleAvatarUpdate}
      >
        {profile?.avatar_url ? (
          <Image source={{ uri: profile.avatar_url }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Ionicons name="person" size={48} color="#777" />
          </View>
        )}
      </TouchableOpacity>

      <Text style={styles.name}>{profile?.full_name || "Guest"}</Text>
      <Text style={styles.email}>{user?.email}</Text>

      <View style={styles.optionsSection}>
        <Option
          icon={<UserCircle size={20} color={COLORS.primary} />}
          label="Edit Profile"
          onPress={() => router.push("/profile/edit")}
        />
        {/* <Option icon={<Bell size={20} color={COLORS.primary} />} label="Notifications" onPress={() => router.push("/profile/notifications")} /> */}
        <Option
          icon={<Lock size={20} color={COLORS.primary} />}
          label="Privacy & Security"
          onPress={() => router.push("/profile/privacy")}
        />
        {/* <Option
          icon={<HelpCircle size={20} color={COLORS.primary} />}
          label="Help & Support"
          onPress={() => router.push("/profile/help")}
        /> */}
        <Option
          icon={<Info size={20} color={COLORS.primary} />}
          label="About"
          onPress={() => router.push("/profile/about")}
        />
        {isAdmin && (
          <Option
            icon={<Settings size={20} color={COLORS.primary} />}
            label="Admin Dashboard"
            onPress={() => router.push("/admin")}
          />
        )}
      </View>

      <View style={{ marginTop: 30, paddingHorizontal: SPACING.lg }}>
        <Button
          title="Sign Out"
          onPress={handleSignOut}
          variant="outline"
          icon={<LogOut size={18} color="#d32f2f" />}
          textColor="#d32f2f"
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.screenBackground,
  },
  avatarContainer: {
    alignSelf: "center",
    marginTop: 30,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#e0e0e0",
    justifyContent: "center",
    alignItems: "center",
  },
  name: {
    textAlign: "center",
    fontSize: 18,
    fontWeight: "600",
    marginTop: 12,
    color: "#212121",
  },
  email: {
    textAlign: "center",
    fontSize: 14,
    color: "#757575",
    marginTop: 4,
  },
  optionsSection: {
    marginTop: 30,
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: SPACING.lg,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  optionIcon: {
    width: 30,
    alignItems: "center",
    marginRight: 16,
  },
  optionLabel: {
    flex: 1,
    fontSize: 16,
    color: "#212121",
  },
  chevron: {
    fontSize: 20,
    color: "#BDBDBD",
  },
});
