import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import api from '../../shared/api/api';
import { API_BASE_URL } from '../../shared/api/config';
import { Product } from '../../shared/types';
import BuyNowSheet from '../orders/BuyNowSheet';

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [showBuy, setShowBuy] = useState(false);

  useEffect(() => {
    api.get(`/gigs/${id}`)
      .then((res) => setProduct(res.data))
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <View style={styles.centered}><ActivityIndicator size="large" color="#145C3F" /></View>;
  }

  if (notFound || !product) {
    return (
      <View style={styles.centered}>
        <Text>Product not found.</Text>
      </View>
    );
  }

  const imageUrl = `${API_BASE_URL.replace('/api', '')}/${product.image.replace(/\\/g, '/')}`;

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={styles.container}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color="#14171F" />
        </TouchableOpacity>

        <Image source={{ uri: imageUrl }} style={styles.image} />

        <View style={styles.body}>
          <Text style={styles.title}>{product.title}</Text>
          <Text style={styles.price}><Text style={styles.priceCurrency}>XAF </Text>{product.price.toLocaleString()}</Text>
          <Text style={styles.desc}>{product.description}</Text>

          <View style={styles.qtyRow}>
            <Text style={styles.qtyLabel}>Quantity</Text>
            <View style={styles.qtyControl}>
              <TouchableOpacity onPress={() => setQuantity((q) => Math.max(1, q - 1))} style={styles.qtyBtn}>
                <Text style={styles.qtyBtnText}>−</Text>
              </TouchableOpacity>
              <Text style={styles.qtyValue}>{quantity}</Text>
              <TouchableOpacity onPress={() => setQuantity((q) => q + 1)} style={styles.qtyBtn}>
                <Text style={styles.qtyBtnText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.vendorBox}>
            <View style={styles.vendorAvatar}>
              <Text style={styles.vendorInitial}>{product.seller?.name?.[0] || 'V'}</Text>
            </View>
            <View>
              <Text style={styles.vendorName}>{product.seller?.name}</Text>
              {product.seller?.verificationStatus === 'approved' && (
                <View style={styles.verifiedRow}>
                  <Ionicons name="checkmark-circle" size={13} color="#145C3F" />
                  <Text style={styles.verifiedText}>Verified Vendor</Text>
                </View>
              )}
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.buyButton} onPress={() => setShowBuy(true)}>
          <Text style={styles.buyButtonText}>Buy Now</Text>
        </TouchableOpacity>
      </View>

      {showBuy && (
        <BuyNowSheet
          product={{ ...product, image: imageUrl }}
          quantity={quantity}
          onClose={() => setShowBuy(false)}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7F8FC' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  backBtn: {
    position: 'absolute', top: 44, left: 16, zIndex: 10,
    backgroundColor: '#fff', borderRadius: 20, width: 38, height: 38,
    justifyContent: 'center', alignItems: 'center', elevation: 3,
  },
  image: { width: '100%', height: 320, backgroundColor: '#EDEEF5' },
  body: { padding: 20 },
  title: { fontSize: 20, fontWeight: '800' },
  price: { fontSize: 22, fontWeight: '800', color: '#145C3F', marginTop: 8 },
  priceCurrency: { fontSize: 12, fontWeight: '600', color: '#5B5F6B' },
  desc: { color: '#5B5F6B', marginTop: 14, lineHeight: 20 },
  qtyRow: { flexDirection: 'row', alignItems: 'center', gap: 16, marginTop: 20 },
  qtyLabel: { fontWeight: '600' },
  qtyControl: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 8, paddingHorizontal: 4 },
  qtyBtn: { padding: 10 },
  qtyBtnText: { fontSize: 18, fontWeight: '700', color: '#145C3F' },
  qtyValue: { fontWeight: '600', minWidth: 24, textAlign: 'center' },
  vendorBox: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#fff', borderRadius: 10, padding: 14, marginTop: 24 },
  vendorAvatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#145C3F', justifyContent: 'center', alignItems: 'center' },
  vendorInitial: { color: '#fff', fontWeight: '700' },
  vendorName: { fontWeight: '700', fontSize: 13.5 },
  verifiedRow: { flexDirection: 'row', alignItems: 'center', gap: 3, marginTop: 2 },
  verifiedText: { color: '#145C3F', fontSize: 11.5, fontWeight: '600' },
  footer: { padding: 16, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#E3E5F0' },
  buyButton: { backgroundColor: '#F0C419', borderRadius: 10, padding: 16, alignItems: 'center' },
  buyButtonText: { fontWeight: '700', fontSize: 15, color: '#14171F' },
});