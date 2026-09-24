import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Image, LayoutAnimation, Platform, StyleSheet, Text, TouchableOpacity, UIManager, View } from 'react-native';
import { API_BASE_URL } from '../../shared/api/config';
import { Product } from '../../shared/types';
import { useSaved } from './useSaved';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function ProductCard({ product }: { product: Product }) {
  const router = useRouter();
  const { isSaved, toggleSaved } = useSaved(product._id);
  const [expanded, setExpanded] = useState(false);

  const imageUrl = `${API_BASE_URL.replace('/api', '')}/${product.image.replace(/\\/g, '/')}`;

  const toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded((e) => !e);
  };

  return (
    <View style={styles.card}>
      <View style={styles.imageWrap}>
        <Image source={{ uri: imageUrl }} style={styles.image} />
        <TouchableOpacity style={styles.saveBtn} onPress={() => toggleSaved()}>
          <Ionicons name={isSaved ? 'bookmark' : 'bookmark-outline'} size={18} color={isSaved ? '#F0C419' : '#fff'} />
        </TouchableOpacity>
      </View>

      <View style={styles.body}>
        <Text style={styles.title} numberOfLines={1}>{product.title}</Text>
        <Text style={styles.subtitle}>Verified DoualaMarket vendor</Text>

        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <Ionicons name="location-outline" size={14} color="#5B5F6B" />
            <Text style={styles.metaText}>Douala</Text>
          </View>
          <View style={styles.metaItem}>
            <Ionicons name="pricetag-outline" size={14} color="#5B5F6B" />
            <Text style={styles.metaText}>XAF {product.price.toLocaleString()}</Text>
          </View>
        </View>

        <View style={styles.tagRow}>
          <View style={styles.tag}><Text style={styles.tagText}>In Stock</Text></View>
        </View>

        {expanded && (
          <Text style={styles.desc} numberOfLines={4}>{product.description}</Text>
        )}

        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.viewBtn} onPress={() => router.push(`/product/${product._id}`)}>
            <Text style={styles.viewBtnText}>View Details</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.expandBtn} onPress={toggleExpand}>
            <Ionicons name={expanded ? 'chevron-up' : 'chevron-down'} size={20} color="#145C3F" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#fff', borderRadius: 16, marginBottom: 16, overflow: 'hidden', elevation: 2 },
  imageWrap: { width: '100%', height: 190, backgroundColor: '#EDEEF5' },
  image: { width: '100%', height: '100%' },
  saveBtn: {
    position: 'absolute', top: 10, right: 10,
    width: 34, height: 34, borderRadius: 17,
    backgroundColor: 'rgba(20,23,31,0.45)',
    justifyContent: 'center', alignItems: 'center',
  },
  body: { padding: 14 },
  title: { fontSize: 16, fontWeight: '800', color: '#14171F' },
  subtitle: { fontSize: 12.5, color: '#9AA0AC', marginTop: 2 },
  metaRow: { flexDirection: 'row', gap: 20, marginTop: 10 },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaText: { fontSize: 12.5, color: '#5B5F6B', fontWeight: '600' },
  tagRow: { flexDirection: 'row', gap: 8, marginTop: 12 },
  tag: { backgroundColor: '#EAF4EE', paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20 },
  tagText: { fontSize: 11.5, fontWeight: '700', color: '#145C3F' },
  desc: { fontSize: 12.5, color: '#5B5F6B', marginTop: 10, lineHeight: 18 },
  actionRow: { flexDirection: 'row', gap: 10, marginTop: 16 },
  viewBtn: { flex: 1, backgroundColor: '#145C3F', borderRadius: 12, height: 46, justifyContent: 'center', alignItems: 'center' },
  viewBtnText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  expandBtn: { width: 46, height: 46, borderRadius: 12, borderWidth: 1.5, borderColor: '#E3E5F0', justifyContent: 'center', alignItems: 'center' },
});