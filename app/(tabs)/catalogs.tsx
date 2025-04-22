import React, { useState, useRef } from 'react';
import { StyleSheet, View, Text, ScrollView, Alert, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS, SPACING } from '@/constants/theme';
import { useCatalogs } from '@/hooks/useCatalogs';
import Header from '@/components/shared/Header';
import Button from '@/components/ui/Button';
import GlassmorphicCard from '@/components/ui/GlassmorphicCard';
import { useAuth } from '@/context/AuthContext';
import { Bookmark, FolderPlus, MoreVertical, Plus, ArrowLeft, Trash2, Edit2 } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import Input from '@/components/ui/Input';
import { BottomSheetModal, BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';

type Catalog = {
  id: string;
  name: string;
  created_at: string;
  product_count?: number;
  products?: Array<{
    id: string;
    name: string;
    images: string[];
  }>;
};

export default function CatalogsScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { catalogs, createCatalog, loading, deleteCatalog, updateCatalog } = useCatalogs();
  
  const [showNewCatalogModal, setShowNewCatalogModal] = useState(false);
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [selectedCatalog, setSelectedCatalog] = useState<Catalog | null>(null);
  const [newCatalogName, setNewCatalogName] = useState('');
  const [newCatalogDescription, setNewCatalogDescription] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'detail'>('list');

  const handleCreateCatalog = async () => {
    if (!newCatalogName.trim()) {
      Alert.alert('Error', 'Please enter a catalog name');
      return;
    }

    const result = await createCatalog(newCatalogName);
    if (result.error) {
      Alert.alert('Error', 'Failed to create catalog');
    } else {
      setShowNewCatalogModal(false);
      setNewCatalogName('');
      setNewCatalogDescription('');
    }
  };

  const handleCatalogPress = (catalog: any) => {
    setSelectedCatalog(catalog);
    setViewMode('detail');
  };

  const handleRenameCatalog = async (catalog: Catalog) => {
    setSelectedCatalog(catalog);
    setNewCatalogName(catalog.name);
    setShowRenameModal(true);
  };

  const handleRenameSubmit = async () => {
    if (!selectedCatalog || !newCatalogName.trim()) return;

    const result = await updateCatalog(selectedCatalog.id, newCatalogName);
    if (result.error) {
      Alert.alert('Error', 'Failed to rename catalog');
    } else {
      setShowRenameModal(false);
      setNewCatalogName('');
      setSelectedCatalog(null);
    }
  };

  const handleDeleteCatalog = async (catalog: Catalog) => {
    Alert.alert(
      'Delete Catalog',
      'Are you sure you want to delete this catalog? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const result = await deleteCatalog(catalog.id);
            if (result.error) {
              Alert.alert('Error', 'Failed to delete catalog');
            }
          },
        },
      ]
    );
  };

  if (!user) {
    return (
      <View style={styles.container}>
        <Header title="My Catalogs" />
        <View style={styles.centerContent}>
          <Text style={styles.loginMessage}>Please sign in to view your catalogs</Text>
          <Button 
            title="Sign In" 
            onPress={() => router.push('/login')} 
            style={styles.loginButton}
          />
        </View>
      </View>
    );
  }

  if (viewMode === 'detail' && selectedCatalog) {
    return (
      <View style={styles.container}>
        <Header 
          title={selectedCatalog.name}
          showBackButton
        />
        
        <View style={styles.detailContent}>
          <View style={styles.detailHeader}>
            <View>
              <Text style={styles.detailTitle}>{selectedCatalog.name}</Text>
              <Text style={styles.detailDate}>
                Created on {new Date(selectedCatalog.created_at).toLocaleDateString()}
              </Text>
            </View>
            <Button
              title="Add Items"
              icon={<Plus size={16} color={COLORS.white} />}
              iconPosition="left"
              onPress={() => router.push('/')}
            />
          </View>

          <ScrollView style={styles.detailGrid}>
            {selectedCatalog.products?.map((product: { id: string; name: string; images: string[] }) => (
              <TouchableOpacity 
                key={product.id} 
                style={styles.productItem}
                onPress={() => router.push(`/product/${product.id}`)}
              >
                <Image 
                  source={{ uri: product.images[0] }} 
                  style={styles.productImage}
                />
                <Text style={styles.productName}>{product.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={styles.container}>
      <Header title="My Catalogs" />
      
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>My Catalogues</Text>
          <Button
            title="New Catalogue"
            icon={<FolderPlus size={16} color={COLORS.white} />}
            iconPosition="left"
            size="small"
            onPress={() => setShowNewCatalogModal(true)}
          />
        </View>

        <Text style={styles.subtitle}>
          Organize your favorite items into collections for easy reference
        </Text>

        <ScrollView style={styles.catalogList}>
          {catalogs.map((catalog: Catalog, index) => (
            <Animated.View
              key={catalog.id}
              entering={FadeInDown.delay(index * 100).springify()}
            >
              <GlassmorphicCard style={styles.catalogCard}>
                <View style={styles.cardHeader}>
                  <View style={styles.cardTitleContainer}>
                    {catalog.products?.[0]?.images?.[0] && (
                      <Image 
                        source={{ uri: catalog.products[0].images[0] }} 
                        style={styles.catalogThumbnail}
                      />
                    )}
                    <View style={styles.cardTitleText}>
                      <Text style={styles.catalogName}>{catalog.name}</Text>
                      <Text style={styles.catalogDate}>
                        Created on {new Date(catalog.created_at).toLocaleDateString()}
                      </Text>
                    </View>
                  </View>
                  <Menu>
                    <MenuTrigger>
                      <Button
                        variant="ghost"
                        size="small"
                        title=""
                        icon={<MoreVertical size={16} color={COLORS.textPrimary} />}
                        onPress={() => {}}
                      />
                    </MenuTrigger>
                    <MenuOptions>
                      <MenuOption onSelect={() => handleRenameCatalog(catalog)}>
                        <View style={styles.menuOption}>
                          <Edit2 size={16} color={COLORS.textPrimary} />
                          <Text style={styles.menuOptionText}>Rename</Text>
                        </View>
                      </MenuOption>
                      <MenuOption onSelect={() => handleDeleteCatalog(catalog)}>
                        <View style={[styles.menuOption, styles.deleteOption]}>
                          <Trash2 size={16} color={COLORS.error} />
                          <Text style={[styles.menuOptionText, styles.deleteText]}>Delete</Text>
                        </View>
                      </MenuOption>
                    </MenuOptions>
                  </Menu>
                </View>

                <View style={styles.cardContent}>
                  <Text style={styles.itemCount}>
                    {catalog.product_count || 0} items
                  </Text>
                  <ScrollView 
                    horizontal 
                    showsHorizontalScrollIndicator={false}
                    style={styles.thumbnailList}
                  >
                    {catalog.products?.map((product: { id: string; name: string; images: string[] }) => (
                      <TouchableOpacity 
                        key={product.id} 
                        style={styles.thumbnail}
                        onPress={() => router.push(`/product/${product.id}`)}
                      >
                        <Image 
                          source={{ uri: product.images[0] }} 
                          style={styles.thumbnailImage}
                        />
                      </TouchableOpacity>
                    ))}
                    <TouchableOpacity
                      style={styles.addButton}
                      onPress={() => handleCatalogPress(catalog)}
                    >
                      <View style={styles.addButtonContent}>
                        <Plus size={24} color={COLORS.primary} />
                        <Text style={styles.addButtonText}>Add</Text>
                      </View>
                    </TouchableOpacity>
                  </ScrollView>
                </View>

                <Button
                  variant="ghost"
                  title="View Catalogue"
                  icon={<Bookmark size={16} color={COLORS.primary} />}
                  iconPosition="left"
                  style={styles.viewButton}
                  onPress={() => handleCatalogPress(catalog)}
                />
              </GlassmorphicCard>
            </Animated.View>
          ))}
        </ScrollView>
      </View>

      {/* New Catalog Modal */}
      <BottomSheetModalProvider>
        <BottomSheetModal
          ref={null}
          snapPoints={['50%']}
          onDismiss={() => setShowNewCatalogModal(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Create New Catalogue</Text>
            <Text style={styles.modalDescription}>
              Create a new collection to organize your favorite items
            </Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Catalogue Name</Text>
              <Input
                value={newCatalogName}
                onChangeText={setNewCatalogName}
                placeholder="e.g., Dream Bedroom"
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Description (optional)</Text>
              <Input
                value={newCatalogDescription}
                onChangeText={setNewCatalogDescription}
                placeholder="What's this collection for?"
              />
            </View>

            <View style={styles.modalButtons}>
              <Button
                title="Cancel"
                variant="outline"
                onPress={() => setShowNewCatalogModal(false)}
              />
              <Button
                title="Create Catalogue"
                onPress={handleCreateCatalog}
              />
            </View>
          </View>
        </BottomSheetModal>
      </BottomSheetModalProvider>

      {/* Rename Catalog Modal */}
      <BottomSheetModalProvider>
        <BottomSheetModal
          ref={null}
          snapPoints={['30%']}
          onDismiss={() => {
            setShowRenameModal(false);
            setNewCatalogName('');
            setSelectedCatalog(null);
          }}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Rename Catalogue</Text>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>New Name</Text>
              <Input
                value={newCatalogName}
                onChangeText={setNewCatalogName}
                placeholder="Enter new name"
                autoFocus
              />
            </View>
            <View style={styles.modalButtons}>
              <Button
                title="Cancel"
                variant="outline"
                onPress={() => {
                  setShowRenameModal(false);
                  setNewCatalogName('');
                  setSelectedCatalog(null);
                }}
              />
              <Button
                title="Rename"
                onPress={handleRenameSubmit}
              />
            </View>
          </View>
        </BottomSheetModal>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    padding: SPACING.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  title: {
    fontFamily: 'Poppins-Bold',
    fontSize: 24,
    color: COLORS.textPrimary,
  },
  subtitle: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xl,
  },
  catalogList: {
    flex: 1,
  },
  catalogCard: {
    marginBottom: SPACING.lg,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.md,
  },
  cardTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  catalogThumbnail: {
    width: 40,
    height: 40,
    borderRadius: 8,
    marginRight: SPACING.sm,
  },
  cardTitleText: {
    flex: 1,
  },
  catalogName: {
    fontFamily: 'Poppins-Bold',
    fontSize: 18,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  catalogDate: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  cardContent: {
    marginBottom: SPACING.md,
  },
  itemCount: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
  },
  thumbnailList: {
    flexDirection: 'row',
  },
  thumbnail: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: SPACING.sm,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.black10,
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
  },
  addButton: {
    width: 80,
    height: 80,
    borderRadius: 8,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.sm,
  },
  addButtonContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: COLORS.primary,
    marginTop: SPACING.xs,
  },
  viewButton: {
    width: '100%',
  },
  detailContent: {
    flex: 1,
    padding: SPACING.lg,
  },
  detailHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.xl,
  },
  detailTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 24,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  detailDate: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  detailGrid: {
    flex: 1,
  },
  productItem: {
    width: '48%',
    marginBottom: SPACING.lg,
  },
  productImage: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 8,
    marginBottom: SPACING.sm,
  },
  productName: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: COLORS.textPrimary,
  },
  modalContent: {
    padding: SPACING.lg,
  },
  modalTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 20,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  modalDescription: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xl,
  },
  inputGroup: {
    marginBottom: SPACING.lg,
  },
  inputLabel: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: SPACING.md,
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
  loginButton: {
    width: 150,
  },
  menuOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.sm,
  },
  menuOptionText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: COLORS.textPrimary,
    marginLeft: SPACING.sm,
  },
  deleteOption: {
    borderTopWidth: 1,
    borderTopColor: COLORS.black10,
  },
  deleteText: {
    color: COLORS.error,
  },
});