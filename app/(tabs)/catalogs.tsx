import React, { useState } from 'react';
import { StyleSheet, View, Text, FlatList, Modal, TouchableOpacity, RefreshControl, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS, SPACING, SHADOWS } from '@/constants/theme';
import Header from '@/components/shared/Header';
import { useAuth } from '@/context/AuthContext';
import { useCatalogs } from '@/hooks/useCatalogs';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import CatalogCard from '@/components/ui/CatalogCard';
import { FolderPlus, X, MoreVertical } from 'lucide-react-native';
import GlassmorphicCard from '@/components/ui/GlassmorphicCard';
import Animated, { FadeIn } from 'react-native-reanimated';
import { supabase } from '@/lib/supabase';

type Catalog = {
  id: string;
  name: string;
  catalog_products?: any[];
};

export default function CatalogsScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [newCatalogName, setNewCatalogName] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isRenameModalVisible, setIsRenameModalVisible] = useState(false);
  const [selectedCatalog, setSelectedCatalog] = useState<Catalog | null>(null);
  const [renameCatalogName, setRenameCatalogName] = useState('');
  const { 
    catalogs, 
    loading, 
    error, 
    refreshing, 
    onRefresh,
    createCatalog,
    updateCatalog,
    refetchCatalogs
  } = useCatalogs();

  const handlePresentModalPress = () => {
    setIsModalVisible(true);
  };

  const handleDismissModal = () => {
    setIsModalVisible(false);
    setNewCatalogName('');
  };

  const handleCreateCatalog = async () => {
    if (!newCatalogName.trim()) return;

    try {
      const { error } = await createCatalog(newCatalogName.trim());
      if (error) throw error;
      handleDismissModal();
    } catch (error) {
      console.error('Error creating catalog:', error);
    }
  };

  const handleCatalogPress = (id: string) => {
    router.push(`/catalog/${id}`);
  };

  const handleRenamePress = (catalog: Catalog) => {
    setSelectedCatalog(catalog);
    setNewCatalogName(catalog.name);
    setIsRenameModalVisible(true);
  };

  const handleDeletePress = (catalog: Catalog) => {
    Alert.alert(
      'Delete Catalog',
      'Are you sure you want to delete this catalog? This will also remove all product associations.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const { error } = await supabase
                .from('catalogs')
                .delete()
                .eq('id', catalog.id);

              if (error) throw error;

              await refetchCatalogs();
              Alert.alert('Success', 'Catalog deleted successfully');
            } catch (error: any) {
              Alert.alert('Error', error.message);
            }
          },
        },
      ]
    );
  };

  const handleDismissRenameModal = () => {
    setIsRenameModalVisible(false);
    setSelectedCatalog(null);
    setRenameCatalogName('');
  };

  const handleRenameCatalog = async () => {
    if (!selectedCatalog || !renameCatalogName.trim()) return;

    try {
      const { error } = await updateCatalog(selectedCatalog.id, renameCatalogName.trim());
      if (error) throw error;
      handleDismissRenameModal();
    } catch (error) {
      console.error('Error renaming catalog:', error);
    }
  };

  const renderCatalogItem = ({ item, index }: { item: Catalog; index: number }) => (
    <CatalogCard
      id={item.id}
      name={item.name}
      productCount={item.catalog_products?.length || 0}
      onPress={() => handleCatalogPress(item.id)}
      onRename={() => handleRenamePress(item)}
      onDelete={() => handleDeletePress(item)}
      index={index}
    />
  );

  if (!user) {
    return (
      <View style={styles.container}>
        <Header title="My Catalogs" />
        <View style={styles.centerContent}>
          <Text style={styles.loginMessage}>Please sign in to view your catalogs</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title="My Catalogs" />
      
      <FlatList
        data={catalogs}
        renderItem={renderCatalogItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.catalogList}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.primary}
          />
        }
        ListEmptyComponent={
          !loading ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No catalogs yet</Text>
              <Text style={styles.emptySubText}>
                Create a catalog to organize your favorite items
              </Text>
            </View>
          ) : null
        }
      />

      <Animated.View 
        entering={FadeIn.delay(200).springify()}
        style={styles.fabContainer}
      >
        <TouchableOpacity
          style={styles.fab}
          onPress={handlePresentModalPress}
          activeOpacity={0.8}
        >
          <FolderPlus size={24} color={COLORS.white} />
        </TouchableOpacity>
      </Animated.View>

      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={handleDismissModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Create New Catalog</Text>
              <TouchableOpacity onPress={handleDismissModal}>
                <X size={24} color={COLORS.textPrimary} />
              </TouchableOpacity>
            </View>
            
            <Text style={styles.modalDescription}>
              Create a new collection to organize your favorite items
            </Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Catalog Name</Text>
              <Input
                value={newCatalogName}
                onChangeText={setNewCatalogName}
                placeholder="e.g., Dream Bedroom"
              />
            </View>

            <View style={styles.modalButtons}>
              <Button
                title="Cancel"
                variant="outline"
                onPress={handleDismissModal}
              />
              <Button
                title="Create Catalog"
                onPress={handleCreateCatalog}
              />
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={isRenameModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={handleDismissRenameModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Rename Catalog</Text>
              <TouchableOpacity onPress={handleDismissRenameModal}>
                <X size={24} color={COLORS.textPrimary} />
              </TouchableOpacity>
            </View>
            
            <Text style={styles.modalDescription}>
              Enter a new name for your catalog
            </Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Catalog Name</Text>
              <Input
                value={renameCatalogName}
                onChangeText={setRenameCatalogName}
                placeholder="Enter new name"
              />
            </View>

            <View style={styles.modalButtons}>
              <Button
                title="Cancel"
                variant="outline"
                onPress={handleDismissRenameModal}
              />
              <Button
                title="Rename"
                onPress={handleRenameCatalog}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    marginBottom:70,
  },
  catalogList: {
    padding: SPACING.lg,
    paddingBottom: SPACING.xxl,
  },
  catalogItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  moreButton: {
    padding: SPACING.sm,
    marginLeft: SPACING.sm,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xxl,
  },
  emptyText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 18,
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  emptySubText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  loginMessage: {
    fontFamily: 'Poppins-Medium',
    fontSize: 18,
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: SPACING.xl,
  },
  fabContainer: {
    position: 'absolute',
    bottom: SPACING.xl,
    right: SPACING.xl,
    zIndex: 10,
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.large,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: COLORS.background,
    borderRadius: 16,
    padding: SPACING.lg,
    width: '90%',
    maxWidth: 400,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  modalTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 20,
    color: COLORS.textPrimary,
  },
  modalDescription: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xl,
  },
  inputGroup: {
    marginBottom: SPACING.xl,
  },
  inputLabel: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: SPACING.md,
  },
});