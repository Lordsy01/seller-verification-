import { Ionicons } from '@expo/vector-icons';
import { usePathname, useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const TABS = [
    { key: 'home', label: 'Home', icon: 'home', route: '/(tabs)/home' },
    { key: 'saved', label: 'Saved', icon: 'bookmark', route: '/(tabs)/saved' },
    { key: 'chat', label: '', icon: 'chatbubble', route: '/(tabs)/chat', isCenter: true },
    { key: 'orders', label: 'Orders', icon: 'receipt', route: '/(tabs)/orders' },
    { key: 'profile', label: 'Profile', icon: 'person', route: '/(tabs)/profile' },
];

export default function CustomTabBar() {
    const router = useRouter();
    const pathname = usePathname();

    return (
        <View style={styles.wrapper}>
            <View style={styles.bar}>
                {TABS.map((tab) => {
                    const active = pathname.includes(tab.key);

                    if (tab.isCenter) {
                        return (
                            <TouchableOpacity
                                key={tab.key}
                                style={styles.centerButton}
                                onPress={() => router.push(tab.route as any)}
                                activeOpacity={0.85}
                            >
                                <Ionicons name={tab.icon as any} size={24} color="#fff" />
                            </TouchableOpacity>
                        );
                    }

                    return (
                        <TouchableOpacity
                            key={tab.key}
                            style={styles.tabItem}
                            onPress={() => router.push(tab.route as any)}
                            activeOpacity={0.7}
                        >
                            <Ionicons
                                name={(active ? tab.icon : `${tab.icon}-outline`) as any}
                                size={22}
                                color={active ? '#fff' : '#D9E6DF'}
                            />
                            <Text style={[styles.label, active && styles.labelActive]}>{tab.label}</Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: { position: 'absolute', bottom: 0, left: 0, right: 0, alignItems: 'center' },
    bar: {
        flexDirection: 'row',
        backgroundColor: '#145C3F',
        width: '94%',
        borderRadius: 24,
        paddingVertical: 10,
        paddingHorizontal: 8,
        marginBottom: 16,
        elevation: 8,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
    },
    tabItem: { flex: 1, alignItems: 'center', gap: 3, paddingTop: 2 },
    label: { fontSize: 10.5, color: '#D9E6DF', fontWeight: '600' },
    labelActive: { color: '#fff' },
    centerButton: {
        width: 52, height: 52, borderRadius: 26,
        backgroundColor: '#F0C419',
        justifyContent: 'center', alignItems: 'center',
        marginTop: -26,
        elevation: 6,
        shadowColor: '#000', shadowOpacity: 0.25, shadowRadius: 6, shadowOffset: { width: 0, height: 3 },
    },
});