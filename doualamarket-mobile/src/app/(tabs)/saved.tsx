import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import ProductCard from '../../features/products/ProductCard';
import api from '../../shared/api/api';
import AppHeader from '../../shared/components/AppHeader';
import { Product } from '../../shared/types';

export default function Saved() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    const loadSaved = useCallback(async () => {
        setLoading(true);
        const raw = await AsyncStorage.getItem('savedProductIds');
        const ids: string[] = raw ? JSON.parse(raw) : [];
        if (ids.length === 0) {
            setProducts([]);
            setLoading(false);
            return;
        }
        try {
            const res = await api.get('/gigs');
            setProducts(res.data.filter((p: Product) => ids.includes(p._id)));
        } finally {
            setLoading(false);
        }
    }, []);

    // re-run every time this tab is focused, so unsaving on another screen reflects immediately
    useFocusEffect(useCallback(() => { loadSaved(); }, [loadSaved]));

    return (
        <View style={styles.container}>
            <AppHeader title="Saved Products" />
            <FlatList
                data={products}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => <ProductCard product={item} />}
                contentContainerStyle={styles.list}
                ListEmptyComponent={!loading ? <Text style={styles.empty}>No saved products yet.</Text> : null}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F7F8FC' },
    list: { paddingHorizontal: 14, paddingTop: 14, paddingBottom: 100 },
    empty: { textAlign: 'center', color: '#5B5F6B', marginTop: 40 },
});