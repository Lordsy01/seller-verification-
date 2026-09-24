import { Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export type SortOption = 'newest' | 'price_low' | 'price_high';

export interface Filters {
    sort: SortOption;
    minPrice: string;
    maxPrice: string;
}

interface Props {
    visible: boolean;
    filters: Filters;
    onApply: (filters: Filters) => void;
    onClose: () => void;
}

const SORT_OPTIONS: { key: SortOption; label: string }[] = [
    { key: 'newest', label: 'Newest' },
    { key: 'price_low', label: 'Price: Low to High' },
    { key: 'price_high', label: 'Price: High to Low' },
];

export default function FilterModal({ visible, filters, onApply, onClose }: Props) {
    const setSort = (sort: SortOption) => onApply({ ...filters, sort });
    const setMinPrice = (minPrice: string) => onApply({ ...filters, minPrice });
    const setMaxPrice = (maxPrice: string) => onApply({ ...filters, maxPrice });

    const handleReset = () => onApply({ sort: 'newest', minPrice: '', maxPrice: '' });

    return (
        <Modal transparent animationType="slide" visible={visible} onRequestClose={onClose}>
            <View style={styles.backdrop}>
                <TouchableOpacity style={styles.backdropTouch} onPress={onClose} />
                <View style={styles.sheet}>
                    <Text style={styles.title}>Filter & Sort</Text>

                    <Text style={styles.label}>Sort by</Text>
                    <View style={styles.optionsGroup}>
                        {SORT_OPTIONS.map((opt) => (
                            <TouchableOpacity
                                key={opt.key}
                                style={[styles.option, filters.sort === opt.key && styles.optionActive]}
                                onPress={() => setSort(opt.key)}
                            >
                                <Text style={[styles.optionText, filters.sort === opt.key && styles.optionTextActive]}>
                                    {opt.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <Text style={styles.label}>Price range (XAF)</Text>
                    <View style={styles.priceRow}>
                        <TextInput
                            style={styles.priceInput}
                            placeholder="Min"
                            keyboardType="numeric"
                            value={filters.minPrice}
                            onChangeText={setMinPrice}
                        />
                        <Text style={styles.priceDash}>—</Text>
                        <TextInput
                            style={styles.priceInput}
                            placeholder="Max"
                            keyboardType="numeric"
                            value={filters.maxPrice}
                            onChangeText={setMaxPrice}
                        />
                    </View>

                    <View style={styles.actionRow}>
                        <TouchableOpacity style={styles.resetBtn} onPress={handleReset}>
                            <Text style={styles.resetBtnText}>Reset</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.applyBtn} onPress={onClose}>
                            <Text style={styles.applyBtnText}>Apply</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
    backdropTouch: { flex: 1 },
    sheet: { backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 24, paddingBottom: 40 },
    title: { fontSize: 18, fontWeight: '800', marginBottom: 18 },
    label: { fontSize: 12.5, fontWeight: '700', color: '#5B5F6B', marginBottom: 10, marginTop: 4, textTransform: 'uppercase' },
    optionsGroup: { gap: 8, marginBottom: 6 },
    option: { paddingVertical: 12, paddingHorizontal: 14, borderRadius: 10, borderWidth: 1.5, borderColor: '#E3E5F0' },
    optionActive: { borderColor: '#145C3F', backgroundColor: '#EAF4EE' },
    optionText: { fontSize: 13.5, fontWeight: '600', color: '#5B5F6B' },
    optionTextActive: { color: '#145C3F' },
    priceRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
    priceInput: { flex: 1, backgroundColor: '#F7F8FC', borderWidth: 1, borderColor: '#E3E5F0', borderRadius: 8, padding: 12 },
    priceDash: { color: '#9AA0AC' },
    actionRow: { flexDirection: 'row', gap: 12, marginTop: 22 },
    resetBtn: { flex: 1, borderWidth: 1.5, borderColor: '#E3E5F0', borderRadius: 10, padding: 14, alignItems: 'center' },
    resetBtnText: { fontWeight: '700', color: '#5B5F6B' },
    applyBtn: { flex: 1, backgroundColor: '#145C3F', borderRadius: 10, padding: 14, alignItems: 'center' },
    applyBtnText: { fontWeight: '700', color: '#fff' },
});