import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Alert } from 'react-native';
import { COLORS, SPACING } from '@/constants/theme';
import BottomDrawer from './BottomDrawer';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { supabase } from '@/lib/supabase';
import { Plus } from 'lucide-react-native';
import { toast } from '@/components/ui/use-toast';

type Props = {
  isVisible: boolean;
  onClose: () => void;
  productId: string;
};

interface Catalog {
  id: string;
  name: string;
  product_count: number;
  catalog_products: Array<{ count: number }>;
}

export default function SaveToCatalogDrawer({ isVisible, onClose, productId }: Props) {
  const [newCatalogName, setNewCatalogName] = useState('');
  const [loading, setLoading] = useState(false);
  const [catalogs, setCatalogs] = useState<Catalog[]>([]);
  const [showNewCatalogInput, setShowNewCatalogInput] = useState(false);

  useEffect(() => {
    if (isVisible) {
      fetchCatalogs();
    }
  }, [isVisible]);

  const fetchCatalogs = async () => {
    try {
      console.log('Fetching catalogs...');
      const { data: catalogsData, error } = await supabase
        .from('catalogs')
        .select(`
          id,
          name,
          catalog_products (count)
        `)
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id);

      if (error) {
        console.error('Error fetching catalogs:', error);
        toast.error('Failed to load catalogs. Please try again.');
        return;
      }

      console.log('Raw catalog data:', catalogsData);

      const typedCatalogs: Catalog[] = catalogsData?.map(catalog => ({
        id: catalog.id,
        name: catalog.name,
        product_count: catalog.catalog_products?.[0]?.count || 0,
        catalog_products: catalog.catalog_products || []
      })) || [];

      console.log('Processed catalogs:', typedCatalogs);
      setCatalogs(typedCatalogs);
    } catch (error) {
      console.error('Error in fetchCatalogs:', error);
      toast.error('An unexpected error occurred while loading catalogs.');
    }
  };

  const handleCreateCatalog = async () => {
    if (!newCatalogName.trim()) {
      toast.error('Please enter a catalog name');
      return;
    }

    setLoading(true);
    try {
      console.log('Creating new catalog:', newCatalogName);
      // Create new catalog
      const { data: catalog, error: catalogError } = await supabase
        .from('catalogs')
        .insert({
          name: newCatalogName.trim(),
          user_id: (await supabase.auth.getUser()).data.user?.id,
        })
        .select()
        .single();

      if (catalogError) throw catalogError;
      console.log('Created catalog:', catalog);

      // Add product to catalog
      console.log('Adding product to catalog:', { catalogId: catalog.id, productId });
      const { error: productError } = await supabase
        .from('catalog_products')
        .insert({
          catalog_id: catalog.id,
          product_id: productId,
        });

      if (productError) throw productError;

      console.log('Successfully added product to catalog');
      await fetchCatalogs(); // Refresh catalogs
      toast.success('Product saved to new catalog');
      setNewCatalogName('');
      setShowNewCatalogInput(false);
      onClose();
    } catch (error: any) {
      console.error('Error creating catalog:', error);
      toast.error(error.message || 'Failed to create catalog');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveToCatalog = async (catalogId: string) => {
    setLoading(true);
    try {
      console.log('Adding product to existing catalog:', { catalogId, productId });
      const { error } = await supabase
        .from('catalog_products')
        .insert({
          catalog_id: catalogId,
          product_id: productId,
        });

      if (error) throw error;

      console.log('Successfully added product to catalog');
      await fetchCatalogs(); // Refresh catalogs
      toast.success('Product saved to catalog');
      onClose();
    } catch (error: any) {
      console.error('Error saving to catalog:', error);
      toast.error(error.message || 'Failed to save to catalog');
    } finally {
      setLoading(false);
    }
  };

  return (
    <BottomDrawer isVisible={isVisible} onClose={onClose}>
      <View style={styles.header}>
        <Text style={styles.title}>Save to Catalog</Text>
        <TouchableOpacity
          style={styles.newCatalogButton}
          onPress={() => setShowNewCatalogInput(true)}
        >
          <Plus size={20} color={COLORS.primary} />
          <Text style={styles.newCatalogText}>New Catalog</Text>
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
            <Button
              title="Cancel"
              onPress={() => {
                setNewCatalogName('');
                setShowNewCatalogInput(false);
              }}
              variant="outline"
              style={styles.button}
            />
            <Button
              title="Create"
              onPress={handleCreateCatalog}
              loading={loading}
              style={styles.button}
            />
          </View>
        </View>
      ) : (
        <View style={styles.catalogList}>
          {catalogs.map(catalog => (
            <TouchableOpacity
              key={catalog.id}
              style={styles.catalogItem}
              onPress={() => handleSaveToCatalog(catalog.id)}
              disabled={loading}
            >
              <Text style={styles.catalogName}>{catalog.name}</Text>
              <Text style={styles.catalogCount}>
                {catalog.product_count} items
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </BottomDrawer>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  title: {
    fontFamily: 'Playfair-Bold',
    fontSize: 24,
    color: COLORS.textPrimary,
  },
  newCatalogButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.sm,
  },
  newCatalogText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: COLORS.primary,
    marginLeft: SPACING.xs,
  },
  newCatalogForm: {
    gap: SPACING.md,
  },
  buttonRow: {
    flexDirection: 'row',
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
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.md,
    backgroundColor: COLORS.background,
    borderRadius: 12,
  },
  catalogName: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: COLORS.textPrimary,
  },
  catalogCount: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: COLORS.textSecondary,
  },
}); 