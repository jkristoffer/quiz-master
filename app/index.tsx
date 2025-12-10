import { Text, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import ScreenWrapper from '../components/ScreenWrapper';
import { Colors } from '../constants/Colors';

export default function Index() {
    return (
        <ScreenWrapper style={styles.container}>
            <Text style={styles.title}>BrainSpark</Text>
            <Text style={styles.subtitle}>Logic Puzzles for Kids</Text>
            <Link href="/quiz/1" style={styles.link}>
                <Text style={styles.linkText}>Start Phase 2 Quiz (Placeholder)</Text>
            </Link>
        </ScreenWrapper>
    );
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontFamily: 'Fredoka_700Bold',
        fontSize: 48,
        color: Colors.primary,
        marginBottom: 8,
        textAlign: 'center',
    },
    subtitle: {
        fontFamily: 'Fredoka_500Medium',
        fontSize: 24,
        color: Colors.text,
        marginBottom: 32,
        textAlign: 'center',
    },
    link: {
        backgroundColor: Colors.secondary,
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 999,
    },
    linkText: {
        color: Colors.white,
        fontFamily: 'Fredoka_600SemiBold',
        fontSize: 18,
    },
});
