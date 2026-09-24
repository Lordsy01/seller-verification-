import { useEffect, useState } from 'react';
import { FlatList, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import api from '../../shared/api/api';
import AppHeader from '../../shared/components/AppHeader';

interface MessageItem {
    _id: string;
    body: string;
    reply?: string;
    status: 'open' | 'replied';
    createdAt: string;
    product?: { title: string };
}

export default function Chat() {
    const [messages, setMessages] = useState<MessageItem[]>([]);
    const [text, setText] = useState('');
    const [sending, setSending] = useState(false);

    const loadMessages = () => {
        api.get('/messages/mine').then((res) => setMessages(res.data));
    };

    useEffect(() => { loadMessages(); }, []);

    const handleSend = async () => {
        if (!text.trim()) return;
        setSending(true);
        try {
            await api.post('/messages', { body: text });
            setText('');
            loadMessages();
        } finally {
            setSending(false);
        }
    };

    return (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <View style={styles.container}>
                <AppHeader title="Messages" />
                <FlatList
                    data={messages}
                    keyExtractor={(item) => item._id}
                    contentContainerStyle={styles.list}
                    inverted={false}
                    ListEmptyComponent={<Text style={styles.empty}>No messages yet. Send us one below.</Text>}
                    renderItem={({ item }) => (
                        <View style={styles.bubbleGroup}>
                            <View style={styles.myBubble}>
                                <Text style={styles.myBubbleText}>{item.body}</Text>
                            </View>
                            {item.reply ? (
                                <View style={styles.replyBubble}>
                                    <Text style={styles.replyLabel}>DoualaMarket</Text>
                                    <Text style={styles.replyText}>{item.reply}</Text>
                                </View>
                            ) : (
                                <Text style={styles.pending}>Awaiting reply...</Text>
                            )}
                        </View>
                    )}
                />
                <View style={styles.inputRow}>
                    <TextInput
                        style={styles.input}
                        placeholder="Type a message..."
                        value={text}
                        onChangeText={setText}
                    />
                    <TouchableOpacity style={styles.sendBtn} onPress={handleSend} disabled={sending}>
                        <Text style={styles.sendBtnText}>Send</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F7F8FC' },
    list: { padding: 14, paddingBottom: 110 },
    empty: { textAlign: 'center', color: '#5B5F6B', marginTop: 40 },
    bubbleGroup: { marginBottom: 18 },
    myBubble: { alignSelf: 'flex-end', backgroundColor: '#145C3F', borderRadius: 14, borderBottomRightRadius: 4, padding: 12, maxWidth: '80%' },
    myBubbleText: { color: '#fff', fontSize: 13.5 },
    replyBubble: { alignSelf: 'flex-start', backgroundColor: '#fff', borderRadius: 14, borderBottomLeftRadius: 4, padding: 12, maxWidth: '80%', marginTop: 8 },
    replyLabel: { fontSize: 10.5, fontWeight: '700', color: '#145C3F', marginBottom: 3 },
    replyText: { fontSize: 13.5, color: '#14171F' },
    pending: { fontSize: 11.5, color: '#9AA0AC', marginTop: 6, alignSelf: 'flex-end' },
    inputRow: { flexDirection: 'row', gap: 8, padding: 12, paddingBottom: 100, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#E3E5F0' },
    input: { flex: 1, backgroundColor: '#F0F1F6', borderRadius: 20, paddingHorizontal: 16, height: 42 },
    sendBtn: { backgroundColor: '#145C3F', borderRadius: 20, paddingHorizontal: 18, justifyContent: 'center' },
    sendBtnText: { color: '#fff', fontWeight: '700', fontSize: 13 },
});