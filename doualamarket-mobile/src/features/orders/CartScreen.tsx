import { useState } from 'react';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import AppHeader from '../../shared/components/AppHeader';
import CartCheckoutSheet from './CartCheckoutScreen.'
import { useCart } from './CartContext';

export default function CartScreen() {
  const { items, updateQuantity, removeItem, subtotal } = useCart();
  const [showCheckout, setShowCheckout] = useState(false);

  const deliveryFee = items.length > 0 ? 2500 : 0;
  const total = subtotal + deliveryFee;

  return (
    <View style={styles.container}>
      <AppHeader title="My Cart" />

      <FlatList
        data={items}
        keyExtractor={(item) => item.productId}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<Text style={styles.empty}>Your cart is empty.</Text>}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Image source={{ uri: item.image }} style={styles.itemImage} />
            <View style={styles.itemBody}>
              <Text style={styles.itemTitle} numberOfLines={1}>{item.title}</Text>
              <Text style={styles.itemPrice}>XAF {(item.price * item.quantity).toLocaleString()}</Text>
              <View style={styles.qtyRow}>
                <TouchableOpacity onPress={() => updateQuantity(item.productId, item.quantity - 1)} style={styles.qtyBtn}>
                  <Text style={styles.qtyBtnText}>−</Text>
                </TouchableOpacity>
                <Text style={styles.qtyValue}>{item.quantity}</Text>
                <TouchableOpacity onPress={() => updateQuantity(item.productId, item.quantity + 1)} style={styles.qtyBtn}>
                  <Text style={styles.qtyBtnText}>+</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => removeItem(item.productId)} style={styles.removeBtn}>
                  <Text style={styles.removeText}>Remove</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      />

      {items.length > 0 && (
        <View style={styles.footer}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>XAF {total.toLocaleString()}</Text>
          </View>
          <TouchableOpacity style={styles.checkoutBtn} onPress={() => setShowCheckout(true)}>
            <Text style={styles.checkoutBtnText}>Checkout with Mobile Money</Text>
          </TouchableOpacity>
        </View>
      )}

      {showCheckout && (
        <CartCheckoutSheet items={items} total={total} onClose={() => setShowCheckout(false)} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7F8FC' },
  list: { padding: 14, paddingBottom: 190 },
  empty: { textAlign: 'center', color: '#5B5F6B', marginTop: 40 },
  item: { flexDirection: 'row', gap: 12, backgroundColor: '#fff', borderRadius: 12, padding: 12, marginBottom: 12 },
  itemImage: { width: 64, height: 64, borderRadius: 8 },
  itemBody: { flex: 1 },
  itemTitle: { fontWeight: '700', fontSize: 13.5 },
  itemPrice: { color: '#145C3F', fontWeight: '700', marginTop: 2, fontSize: 13.5 },
  qtyRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 8 },
  qtyBtn: { width: 26, height: 26, borderRadius: 13, backgroundColor: '#F0F1F6', justifyContent: 'center', alignItems: 'center' },
  qtyBtnText: { fontWeight: '700', color: '#145C3F' },
  qtyValue: { fontWeight: '600', minWidth: 16, textAlign: 'center' },
  removeBtn: { marginLeft: 'auto' },
  removeText: { color: '#BA1A1A', fontSize: 12, fontWeight: '600' },
  footer: {
    position: 'absolute', bottom: 100, left: 0, right: 0,
    backgroundColor: '#fff', padding: 16, borderTopWidth: 1, borderTopColor: '#E3E5F0',
  },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  totalLabel: { fontWeight: '700' },
  totalValue: { fontWeight: '800', color: '#145C3F', fontSize: 16 },
  checkoutBtn: { backgroundColor: '#F0C419', borderRadius: 10, padding: 15, alignItems: 'center' },
  checkoutBtnText: { fontWeight: '700', color: '#14171F' },
});