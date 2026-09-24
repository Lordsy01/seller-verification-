import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Image,
    KeyboardAvoidingView, Platform,
    ScrollView,
    StyleSheet,
    Text, TextInput, TouchableOpacity,
    View
} from 'react-native';
import api from '../../shared/api/api';
import { useImagePicker } from '../../shared/hooks/useImagePicker';
import { useAuth } from '../auth/AuthContext';

export default function PostProductScreen() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { imageUri, pickFromLibrary, takePhoto, clearImage } = useImagePicker();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { router.replace('/(auth)/login'); return; }
    if (user.role !== 'seller') { router.replace('/(tabs)/home'); return; }
    if (user.verificationStatus !== 'approved') { router.replace('/(seller)/verify-upload'); return; }
  }, [user, authLoading]);

  const handleSubmit = async () => {
    setError('');
    if (!imageUri) {
      setError('Please add a photo for your product.');
      return;
    }
    if (!title || !description || !price) {
      setError('Please fill in all fields.');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('price', price);
    formData.append('image', {
      uri: imageUri,
      name: 'product.jpg',
      type: 'image/jpeg',
    } as any);

    try {
      setSubmitting(true);
      await api.post('/gigs', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setSuccess('Product posted! Redirecting...');
      setTimeout(() => router.replace('/(tabs)/home'), 1200);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to post product.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Post a New Product</Text>
        <Text style={styles.subtitle}>List a product for buyers to discover</Text>

        <Text style={styles.label}>Product Title</Text>
        <TextInput
          style={styles.input}
          placeholder="Premium Ndolé Leaves - Bulk Pack"
          value={title}
          onChangeText={setTitle}
          maxLength={100}
        />

        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={4}
          maxLength={1000}
        />

        <Text style={styles.label}>Price (XAF)</Text>
        <TextInput
          style={styles.input}
          value={price}
          onChangeText={setPrice}
          keyboardType="numeric"
        />

        <Text style={styles.label}>Product Photo</Text>
        {imageUri ? (
          <View style={styles.previewBox}>
            <Image source={{ uri: imageUri }} style={styles.previewImage} />
            <TouchableOpacity style={styles.removeBtn} onPress={clearImage}>
              <Ionicons name="close-circle" size={20} color="#BA1A1A" />
              <Text style={styles.removeText}>Remove</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.pickerRow}>
            <TouchableOpacity style={styles.pickerBtn} onPress={takePhoto}>
              <Ionicons name="camera-outline" size={26} color="#145C3F" />
              <Text style={styles.pickerBtnText}>Take Photo</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.pickerBtn} onPress={pickFromLibrary}>
              <Ionicons name="image-outline" size={26} color="#145C3F" />
              <Text style={styles.pickerBtnText}>Choose from Gallery</Text>
            </TouchableOpacity>
          </View>
        )}

        {error ? <Text style={styles.error}>{error}</Text> : null}
        {success ? <Text style={styles.success}>{success}</Text> : null}

        <TouchableOpacity
          style={[styles.button, submitting && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={submitting}
        >
          {submitting ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Post Product</Text>}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 24, paddingTop: 50, backgroundColor: '#F7F8FC' },
  title: { fontSize: 22, fontWeight: '700' },
  subtitle: { color: '#5B5F6B', marginTop: 4, marginBottom: 20 },
  label: { fontSize: 12.5, fontWeight: '600', color: '#5B5F6B', marginBottom: 6, marginTop: 4 },
  input: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#E3E5F0', borderRadius: 8, padding: 13, marginBottom: 14, fontSize: 14.5 },
  textArea: { height: 100, textAlignVertical: 'top' },
  pickerRow: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  pickerBtn: {
    flex: 1, backgroundColor: '#fff', borderWidth: 1.5, borderColor: '#E3E5F0', borderStyle: 'dashed',
    borderRadius: 10, padding: 18, alignItems: 'center', gap: 6,
  },
  pickerBtnText: { fontSize: 11.5, fontWeight: '600', color: '#145C3F', textAlign: 'center' },
  previewBox: { alignItems: 'center', marginBottom: 16 },
  previewImage: { width: '100%', height: 180, borderRadius: 10 },
  removeBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 8 },
  removeText: { color: '#BA1A1A', fontWeight: '600', fontSize: 12.5 },
  button: { backgroundColor: '#145C3F', borderRadius: 8, padding: 15, alignItems: 'center', marginTop: 10 },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: '#fff', fontWeight: '600', fontSize: 15 },
  error: { color: '#BA1A1A', marginBottom: 10 },
  success: { color: '#145C3F', marginBottom: 10 },
});