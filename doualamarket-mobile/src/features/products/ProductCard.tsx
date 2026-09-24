import { useRouter } from 'expo-router';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { API_BASE_URL } from '../../shared/api/config';
import { Product } from '../../shared/types';

export default function ProductCard({ product }: { product: Product }) {
  const router = useRouter();
  const imageUrl = `${API_BASE_URL.replace('/api', '')}/${product.image.replace(/\\/g, '/')}`;

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`/product/${product._id}`)}
      activeOpacity={0.85}
    >
      <Image source={{ uri: imageUrl }} style={styles.image} />
      <View style={styles.body}> 
        <Text style={styles.vendor} numberOfLines={1}>{product.seller?.name}</Text>
        <Text style={styles.title} numberOfLines={2}>{product.title}</Text>
        <Text style={styles.price}>
          <Text style={styles.priceCurrency}>XAF </Text>
          {product.price.toLocaleString()}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: { flex: 1, backgroundColor: '#fff', borderRadius: 12, overflow: 'hidden', margin: 6, elevation: 2 },
  image: { width: '100%', height: 130, backgroundColor: '#EDEEF5' },
  body: { padding: 10 },
  vendor: { fontSize: 11, color: '#5B5F6B' },
  title: { fontSize: 13, fontWeight: '600', marginTop: 2, minHeight: 34 },
  price: { fontSize: 15, fontWeight: '800', color: '#145C3F', marginTop: 6 },
  priceCurrency: { fontSize: 10, fontWeight: '600', color: '#5B5F6B' },
});