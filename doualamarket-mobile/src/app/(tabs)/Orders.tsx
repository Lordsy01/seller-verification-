import { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import api from '../../shared/api/api';
import AppHeader from '../../shared/components/AppHeader';

interface OrderItem {
    _id: string;
    total: number;
    status: 'pending' | 'paid' | 'failed';
    createdAt: string;
    items: { title: string; quantity: number; price: number }[];
}

export default function Orders() {
    const [orders, setOrders] = useState<OrderItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/orders/mine').then((res) => setOrders(res.data)).finally(() => setLoading(false));
    }, []);

    const statusColor = (status: string) => {
        if (status === 'paid') return '#145C3F';
        if (status === 'failed') return '#BA1A1A';
        return '#B8860B';
    };

    return (
        <View style={styles.container}>
            <AppHeader title="My Orders" />
            <FlatList
                data={orders}
                keyExtractor={(item) => item._id}
                contentContainerStyle={styles.list}
                ListEmptyComponent={!loading ? <Text style={styles.empty}>No orders yet.</Text> : null}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <View style={styles.headerRow}>
                            <Text style={styles.orderId}>#{item._id.slice(-8).toUpperCase()}</Text>
                            <Text style={[styles.status, { color: statusColor(item.status) }]}>{item.status.toUpperCase()}</Text>
                        </View>
                        {item.items.map((it, i) => (
                            <Text key={i} style={styles.itemLine}>{it.title} × {it.quantity}</Text>
                        ))}
                        <Text style={styles.total}>Total: XAF {item.total.toLocaleString()}</Text>
                    </View>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F7F8FC' },
    list: { padding: 14, paddingBottom: 100 },
    empty: { textAlign: 'center', color: '#5B5F6B', marginTop: 40 },
    card: { backgroundColor: '#fff', borderRadius: 12, padding: 14, marginBottom: 12 },
    headerRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
    orderId: { fontWeight: '700', fontSize: 13 },
    status: { fontWeight: '800', fontSize: 11.5 },
    itemLine: { fontSize: 12.5, color: '#5B5F6B', marginBottom: 2 },
    total: { marginTop: 8, fontWeight: '700', color: '#145C3F' },
});