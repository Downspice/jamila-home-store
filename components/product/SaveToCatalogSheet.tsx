import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Modal, Platform } from 'react-native';
import { COLORS, SPACING } from '@/constants/theme';
import { Bookmark, Plus, X, Check } from 'lucide-react-native';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

type Props = {
  isVisible: boolean;
  onClose: () => void;
  catalogs: Array<{
    id: string;
    name: string;
    hasProduct?: boolean;
  }>;
  onSelectCatalog: (catalogId: string) => void;
  onCreateCatalog: (name: string) => void;
};

export default function SaveToCatalogSheet({
  isVisible,
  onClose,
  catalogs,
  onSelectCatalog,
  onCreateCatalog,
}: Props) {
  const [showNewCatalogInput, setShowNewCatalogInput] = useState(false);
  const [newCatalogName, setNewCatalogName] = useState('');

  const handleCreateNewCatalog = () => {
    if (newCatalogName.trim()) {
      onCreateCatalog(newCatalogName);
      setNewCatalogName('');
      setShowNewCatalogInput(false);
    }
  };

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.title}>Save to Catalog</Text>
            <TouchableOpacity onPress={onClose}>
              <X size={24} color={COLORS.textPrimary} />
            </TouchableOpacity>
          </View>

          {showNewCatalogInput ? (
            <View style={styles.newCatalogForm}>
              <Input
                label="Catalog Name"
                value={newCatalogName}
                onChangeText={setNewCatalogName}
                placeholder="Enter catalog name"
                returnKeyType="done"
              />
              <View style={styles.buttonRow}>
                <Button size="small" variant="primary" 
                  title="Create"
                  onPress={handleCreateNewCatalog}
                  style={styles.button}
                />
                <Button size="small"
                  title="Cancel"
                  onPress={() => {
                    setNewCatalogName('');
                    setShowNewCatalogInput(false);
                  }}
                  variant="outline"
                  style={styles.button}
                />
              </View>
            </View>
          ) : (
            <View style={styles.catalogList}>
              {catalogs.map(catalog => (
                <TouchableOpacity
                  key={catalog.id}
                  style={[
                    styles.catalogItem,
                    catalog.hasProduct && styles.catalogItemDisabled
                  ]}
                  onPress={() => !catalog.hasProduct && onSelectCatalog(catalog.id)}
                  disabled={catalog.hasProduct}
                >
                  <View style={styles.catalogItemContent}>
                    <Bookmark size={20} color={COLORS.primary} style={styles.catalogIcon} />
                    <Text style={styles.catalogName}>{catalog.name}</Text>
                  </View>
                  {catalog.hasProduct && (
                    <View style={styles.productStatus}>
                      <Check size={16} color={COLORS.success} />
                      <Text style={styles.productStatusText}>Already saved</Text>
                    </View>
                  )}
                </TouchableOpacity>
              ))}
              <TouchableOpacity
                style={styles.newCatalogButton}
                onPress={() => setShowNewCatalogInput(true)}
              >
                <Plus size={20} color={COLORS.primary} />
                <Text style={styles.newCatalogText}>New Catalog</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: Platform.OS === 'android' ? 70 : 0, // slight shift up on Android if needed
  },
  modalContent: {
    backgroundColor: COLORS.background,
    borderRadius: 16,
    padding: SPACING.lg,
    width: '90%',
    maxWidth: 400,
    ...Platform.select({
      android: {
        elevation: 5, // Android shadow
      },
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
    }),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  title: {
    fontFamily: 'Playfair-Bold',
    fontSize: 22.5,
    color: COLORS.textPrimary,
  },
  newCatalogButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    backgroundColor: COLORS.white,
    borderRadius: 11.5,
    borderWidth: 1,
    borderColor: COLORS.black10,
    marginTop: SPACING.sm,
  },
  newCatalogText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12.5,
    color: COLORS.primary,
    marginLeft: SPACING.xs,
  },
  newCatalogForm: {
    gap: SPACING.md,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between', 
    alignItems: 'center',            
    gap: SPACING.md,                  
  },
  button: {
    flex: 1,
  },
  catalogList: {
    gap: SPACING.sm,
  },
  catalogItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING.md,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.black10,
  },
  catalogItemDisabled: {
    opacity: 0.7,
  },
  catalogItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  catalogIcon: {
    marginRight: SPACING.md,
  },
  catalogName: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: COLORS.textPrimary,
  },
  productStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  productStatusText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: COLORS.success,
  },
});