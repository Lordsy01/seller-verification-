import { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';
import api from '../../shared/api/api';
import AppHeader from '../../shared/components/AppHeader';
import { Product } from '../../shared/types';
import FilterModal, { Filters } from './FilterModal';
import ProductCard from './ProductCard';

export default function HomeScreen() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<Filters>({ sort: 'newest', minPrice: '', maxPrice: '' });

  const fetchProducts = async () => {
    try {
      const res = await api.get('/gigs');
      setProducts(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { fetchProducts().finally(() => setLoading(false)); }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchProducts();
    setRefreshing(false);
  }, []);

  const visibleProducts = useMemo(() => {
    let list = [...products];

    if (search.trim()) {
      list = list.filter((p) => p.title.toLowerCase().includes(search.trim().toLowerCase()));
    }

    const min = parseFloat(filters.minPrice);
    const max = parseFloat(filters.maxPrice);
    if (!isNaN(min)) list = list.filter((p) => p.price >= min);
    if (!isNaN(max)) list = list.filter((p) => p.price <= max);

    if (filters.sort === 'price_low') list.sort((a, b) => a.price - b.price);
    if (filters.sort === 'price_high') list.sort((a, b) => b.price - a.price);

    return list;
  }, [products, search, filters]);

  return (
    <View style={styles.container}>
      <AppHeader
        searchValue={search}
        onSearchChange={setSearch}
        onFilterPress={() => setShowFilters(true)}
      />
      {loading ? (
        <View style={styles.centered}><ActivityIndicator size="large" color="#145C3F" /></View>
      ) : (
        <FlatList
          data={visibleProducts}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => <ProductCard product={item} />}
          contentContainerStyle={styles.list}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#145C3F']} />}
          ListEmptyComponent={<Text style={styles.empty}>No products match your search.</Text>}
        />
      )}

      <FilterModal
        visible={showFilters}
        filters={filters}
        onApply={setFilters}
        onClose={() => setShowFilters(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7F8FC' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  list: { paddingHorizontal: 14, paddingTop: 14, paddingBottom: 110 },
  empty: { textAlign: 'center', color: '#5B5F6B', marginTop: 40 },
});