import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface Props {
    title?: string;
    searchValue?: string;
    onSearchChange?: (text: string) => void;
    onFilterPress?: () => void;
}

export default function AppHeader({ title = 'Available Products', searchValue, onSearchChange, onFilterPress }: Props) {
    return (
        <View style={styles.container}>
            <View style={styles.topRow}>
                <View style={styles.logoRow}>
                    <View style={styles.logoBadge}>
                        <Ionicons name="storefront" size={16} color="#fff" />
                    </View>
                    <Text style={styles.logo}>DoualaMarket</Text>
                </View>
            </View>

            <Text style={styles.sectionTitle}>{title}</Text>

            <View style={styles.searchRow}>
                <View style={styles.searchBox}>
                    <Ionicons name="search" size={18} color="#5B5F6B" />
                    <TextInput
                        placeholder="Search products..."
                        style={styles.searchInput}
                        placeholderTextColor="#9AA0AC"
                        value={searchValue}
                        onChangeText={onSearchChange}
                    />
                </View>
                <TouchableOpacity style={styles.filterBtn} onPress={onFilterPress}>
                    <Ionicons name="options" size={18} color="#fff" />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { backgroundColor: '#fff', paddingTop: 50, paddingHorizontal: 16, paddingBottom: 14 },
    topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
    logoRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    logoBadge: { width: 26, height: 26, borderRadius: 8, backgroundColor: '#145C3F', justifyContent: 'center', alignItems: 'center' },
    logo: { fontSize: 18, fontWeight: '800', color: '#145C3F' },
    sectionTitle: { fontSize: 15, fontWeight: '700', color: '#14171F', marginBottom: 10 },
    searchRow: { flexDirection: 'row', gap: 10 },
    searchBox: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#F0F1F6', borderRadius: 12, paddingHorizontal: 14, height: 46 },
    searchInput: { flex: 1, fontSize: 14, color: '#14171F' },
    filterBtn: { width: 46, height: 46, borderRadius: 12, backgroundColor: '#145C3F', justifyContent: 'center', alignItems: 'center' },
});