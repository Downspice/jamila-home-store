import { useAuth } from '@/context/AuthContext';
import { Redirect, Stack } from 'expo-router';
import { COLORS } from '@/constants/theme';

export default function AdminLayout() {
  const { isAdmin, loading } = useAuth();

  if (loading) {
    return null;
  }

  if (!isAdmin) {
    return <Redirect href="/" />;
  }

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: COLORS.white,
        },
        headerTintColor: COLORS.textPrimary,
        headerTitleStyle: {
          fontFamily: 'Poppins-SemiBold',
        },
        headerBackTitleVisible: false,
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen
        name="add-product"
        options={{
          title: 'Add Product',
          presentation: 'modal',
        }}
      />
      <Stack.Screen
        name="add-category"
        options={{
          title: 'Add Category',
          presentation: 'modal',
        }}
      />
      <Stack.Screen
        name="edit-product/[id]"
        options={{
          title: 'Edit Product',
          presentation: 'modal',
        }}
      />
      <Stack.Screen
        name="edit-category/[id]"
        options={{
          title: 'Edit Category',
          presentation: 'modal',
        }}
      />
    </Stack>
  );
} 