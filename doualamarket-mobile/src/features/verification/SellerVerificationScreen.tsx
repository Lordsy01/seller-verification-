import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import api from '../../shared/api/api';
import { useImagePicker } from '../../shared/hooks/useImagePicker';
import { useAuth } from '../auth/AuthContext';

type VerificationStatus = 'pending' | 'approved' | 'rejected';

interface VerificationRecord {
  status: VerificationStatus;
  adminNote?: string;
}

export default function SellerVerificationScreen() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { imageUri, pickFromLibrary, takePhoto, clearImage } = useImagePicker();

  const [checking, setChecking] = useState(true);
  const [existing, setExisting] = useState<VerificationRecord | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (authLoading) return;
    if (!user) { router.replace('/(auth)/login'); return; }
    if (user.role !== 'seller') { router.replace('/(tabs)/home'); return; }
    checkExisting();
  }, [user, authLoading]);

  const checkExisting = async () => {
    try {
      const res = await api.get('/verifications/me');
      setExisting(res.data);
    } catch (err) {
      // 404 just means no request yet — expected for a new seller
    } finally {
      setChecking(false);
    }
  };

  const handleSubmit = async () => {
    if (!imageUri) {
      setError('Please select or take a photo of your ID first.');
      return;
    }
    setError('');
    setSubmitting(true);

    // build multipart form data from the local file URI, same purpose as
    // the browser's FormData — the field name "document" must match
    // upload.single('document') on the backend
    const formData = new FormData();
    formData.append('document', {
      uri: imageUri,
      name: 'verification.jpg',
      type: 'image/jpeg',
    } as any);

    try {
      const res = await api.post('/verifications/submit', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setExisting(res.data.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Something went wrong.');
    } finally {
      setSubmitting(false);
    }
  };

  if (checking) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#145C3F" />
      </View>
    );
  }

  if (existing) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Vendor Verification</Text>
        <Text style={styles.subtitle}>You've already submitted a verification request.</Text>

        <View style={styles.statusBox}>
          <Text style={styles.statusLabel}>Status</Text>
          <Text style={[styles.statusValue, statusColor(existing.status)]}>
            {existing.status.toUpperCase()}
          </Text>
          {existing.adminNote ? <Text style={styles.note}>Note: {existing.adminNote}</Text> : null}
        </View>

        {existing.status === 'approved' && (
          <TouchableOpacity style={styles.button} onPress={() => router.replace('/(tabs)/home')}>
            <Text style={styles.buttonText}>Continue to App</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Vendor Verification</Text>
      <Text style={styles.subtitle}>
        Upload a government ID or business license to get verified as a vendor.
      </Text>

      {imageUri ? (
        <View style={styles.previewBox}>
          <Image source={{ uri: imageUri }} style={styles.previewImage} />
          <TouchableOpacity style={styles.removeBtn} onPress={clearImage}>
            <Ionicons name="close-circle" size={22} color="#BA1A1A" />
            <Text style={styles.removeText}>Remove</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.pickerRow}>
          <TouchableOpacity style={styles.pickerBtn} onPress={takePhoto}>
            <Ionicons name="camera-outline" size={28} color="#145C3F" />
            <Text style={styles.pickerBtnText}>Take Photo</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.pickerBtn} onPress={pickFromLibrary}>
            <Ionicons name="image-outline" size={28} color="#145C3F" />
            <Text style={styles.pickerBtnText}>Choose from Gallery</Text>
          </TouchableOpacity>
        </View>
      )}

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <TouchableOpacity
        style={[styles.button, (!imageUri || submitting) && styles.buttonDisabled]}
        onPress={handleSubmit}
        disabled={!imageUri || submitting}
      >
        {submitting ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Submit for Verification</Text>}
      </TouchableOpacity>
    </ScrollView>
  );
}

function statusColor(status: VerificationStatus) {
  if (status === 'approved') return { color: '#145C3F' };
  if (status === 'rejected') return { color: '#BA1A1A' };
  return { color: '#B8860B' };
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 24, paddingTop: 60, backgroundColor: '#F7F8FC' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 22, fontWeight: '700' },
  subtitle: { color: '#5B5F6B', marginTop: 6, marginBottom: 24, lineHeight: 20 },
  pickerRow: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  pickerBtn: {
    flex: 1, backgroundColor: '#fff', borderWidth: 1.5, borderColor: '#E3E5F0', borderStyle: 'dashed',
    borderRadius: 10, padding: 20, alignItems: 'center', gap: 8,
  },
  pickerBtnText: { fontSize: 12.5, fontWeight: '600', color: '#145C3F', textAlign: 'center' },
  previewBox: { alignItems: 'center', marginBottom: 20 },
  previewImage: { width: '100%', height: 220, borderRadius: 10, resizeMode: 'cover' },
  removeBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 10 },
  removeText: { color: '#BA1A1A', fontWeight: '600', fontSize: 13 },
  button: { backgroundColor: '#145C3F', borderRadius: 8, padding: 15, alignItems: 'center', marginTop: 8 },
  buttonDisabled: { opacity: 0.5 },
  buttonText: { color: '#fff', fontWeight: '600', fontSize: 15 },
  error: { color: '#BA1A1A', marginBottom: 14 },
  statusBox: { backgroundColor: '#fff', borderRadius: 10, padding: 18, marginTop: 8 },
  statusLabel: { fontSize: 12, color: '#5B5F6B', textTransform: 'uppercase', fontWeight: '600' },
  statusValue: { fontSize: 20, fontWeight: '800', marginTop: 4 },
  note: { marginTop: 10, color: '#5B5F6B', fontSize: 13 },
});