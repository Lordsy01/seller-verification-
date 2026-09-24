import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator, Image,
    Modal, StyleSheet,
    Text, TextInput, TouchableOpacity,
    View
} from 'react-native';
import api from '../../shared/api/api';
import { Product } from '../../shared/types';
import { useAuth } from '../auth/AuthContext';

type PaymentMethod = 'momo' | 'om';
type Stage = 'form' | 'pending' | 'paid' | 'failed';

interface Props {
  product: Product;
  quantity: number;
  onClose: () => void;
}

export default function BuyNowSheet({ product, quantity, onClose }: Props) {
  const { user } = useAuth();
  const router = useRouter();

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('momo');
  const [phone, setPhone] = useState('');
  const [stage, setStage] = useState<Stage>('form');
  const [error, setError] = useState('');
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const total = product.price * quantity;

  useEffect(() => () => { if (pollRef.current) clearInterval(pollRef.current); }, []);

  const handleSubmit = async () => {
    setError('');
    if (!user) { onClose(); router.replace('/(auth)/login'); return; }
    if (!/^237\d{9}$/.test(phone)) {
      setError('Enter a valid number in the format 237XXXXXXXXX');
      return;
    }

    try {
      const res = await api.post('/orders', {
        items: [{ productId: product._id, quantity, title: product.title }],
        phone,
        paymentMethod,
      });
      setStage('pending');
      startPolling(res.data.orderId);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to start payment.');
    }
  };

  const startPolling = (orderId: string) => {
    pollRef.current = setInterval(async () => {
      try {
        const res = await api.get(`/orders/${orderId}/status`);
        if (res.data.status === 'paid') {
          if (pollRef.current) clearInterval(pollRef.current);
          setStage('paid');
        } else if (res.data.status === 'failed') {
          if (pollRef.current) clearInterval(pollRef.current);
          setStage('failed');
          setError(res.data.message || 'Payment failed.');
        }
      } catch (err) {
        // transient network error — keep polling
      }
    }, 3000);
  };

  return (
    <Modal transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Text style={styles.closeBtnText}>✕</Text>
          </TouchableOpacity>

          {stage === 'form' && (
            <>
              <Text style={styles.title}>Buy Now</Text>

              <View style={styles.productRow}>
                <Image source={{ uri: product.image }} style={styles.productImage} />
                <View>
                  <Text style={styles.productTitle} numberOfLines={1}>{product.title}</Text>
                  <Text style={styles.productPrice}>
                    XAF {total.toLocaleString()}{quantity > 1 ? ` (${quantity} items)` : ''}
                  </Text>
                </View>
              </View>

              <View style={styles.methodRow}>
                <TouchableOpacity
                  style={[styles.methodBtn, paymentMethod === 'momo' && styles.methodBtnActive]}
                  onPress={() => setPaymentMethod('momo')}
                >
                  <Text style={[styles.methodBtnText, paymentMethod === 'momo' && styles.methodBtnTextActive]}>
                    MTN Mobile Money
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.methodBtn, paymentMethod === 'om' && styles.methodBtnActive]}
                  onPress={() => setPaymentMethod('om')}
                >
                  <Text style={[styles.methodBtnText, paymentMethod === 'om' && styles.methodBtnTextActive]}>
                    Orange Money
                  </Text>
                </TouchableOpacity>
              </View>

              <TextInput
                style={styles.input}
                placeholder="237677777777"
                keyboardType="phone-pad"
                value={phone}
                onChangeText={setPhone}
              />

              {error ? <Text style={styles.error}>{error}</Text> : null}

              <TouchableOpacity style={styles.payButton} onPress={handleSubmit}>
                <Text style={styles.payButtonText}>Pay XAF {total.toLocaleString()}</Text>
              </TouchableOpacity>
            </>
          )}

          {stage === 'pending' && (
            <View style={styles.statusBox}>
              <ActivityIndicator size="large" color="#145C3F" />
              <Text style={styles.statusTitle}>Approve on your phone</Text>
              <Text style={styles.statusText}>A prompt was sent to {phone}.</Text>
            </View>
          )}

          {stage === 'paid' && (
            <View style={styles.statusBox}>
              <Text style={styles.successIcon}>✓</Text>
              <Text style={styles.statusTitle}>Payment Successful</Text>
              <TouchableOpacity style={styles.payButton} onPress={onClose}>
                <Text style={styles.payButtonText}>Done</Text>
              </TouchableOpacity>
            </View>
          )}

          {stage === 'failed' && (
            <View style={styles.statusBox}>
              <Text style={styles.failedIcon}>✕</Text>
              <Text style={styles.statusTitle}>Payment Failed</Text>
              <Text style={styles.statusText}>{error}</Text>
              <TouchableOpacity style={styles.payButton} onPress={() => setStage('form')}>
                <Text style={styles.payButtonText}>Try Again</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  sheet: { backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 24, paddingBottom: 40 },
  closeBtn: { alignSelf: 'flex-end', padding: 4 },
  closeBtnText: { fontSize: 18, color: '#5B5F6B' },
  title: { fontSize: 18, fontWeight: '700', marginBottom: 16 },
  productRow: { flexDirection: 'row', gap: 12, alignItems: 'center', marginBottom: 20, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: '#E3E5F0' },
  productImage: { width: 56, height: 56, borderRadius: 8 },
  productTitle: { fontWeight: '600', fontSize: 13.5, maxWidth: 220 },
  productPrice: { color: '#145C3F', fontWeight: '700', marginTop: 2 },
  methodRow: { flexDirection: 'row', gap: 10, marginBottom: 14 },
  methodBtn: { flex: 1, borderWidth: 1.5, borderColor: '#E3E5F0', borderRadius: 8, padding: 12, alignItems: 'center' },
  methodBtnActive: { borderColor: '#145C3F', backgroundColor: '#EAF4EE' },
  methodBtnText: { fontSize: 12.5, fontWeight: '600', color: '#5B5F6B' },
  methodBtnTextActive: { color: '#145C3F' },
  input: { backgroundColor: '#F7F8FC', borderWidth: 1, borderColor: '#E3E5F0', borderRadius: 8, padding: 14, marginBottom: 14 },
  error: { color: '#BA1A1A', marginBottom: 10, fontSize: 13 },
  payButton: { backgroundColor: '#F0C419', borderRadius: 8, padding: 15, alignItems: 'center', marginTop: 4 },
  payButtonText: { fontWeight: '700', color: '#14171F' },
  statusBox: { alignItems: 'center', paddingVertical: 20 },
  statusTitle: { fontSize: 17, fontWeight: '700', marginTop: 14, marginBottom: 6 },
  statusText: { color: '#5B5F6B', textAlign: 'center', marginBottom: 16 },
  successIcon: { fontSize: 44, color: '#145C3F' },
  failedIcon: { fontSize: 44, color: '#BA1A1A' },
});