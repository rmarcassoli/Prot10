import { StyleSheet } from 'react-native';

export const onboardingSlides = [
  {
    title: "Welcome to Prot10",
    description: "Food marketing can be misleading. Prot10 helps you cut through the hype and decode the true density and quality of protein on any nutrition label.",
    icon: "🔍"
  },
  {
    title: "The 10% Density Rule",
    description: "True high-protein food should have at least 1 gram of protein for every 10 calories. If an item has 140 calories, it needs 14g of protein to pass our density check.",
    icon: "⚖️"
  },
  {
    title: "The Quality Check",
    description: "Grams only measure quantity. By entering the % Daily Value (%DV), Prot10 calculates if the source uses complete amino acids (like whey/soy) or cheap fillers (like collagen).",
    icon: "🧬"
  }
];

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  center: { justifyContent: 'center', alignItems: 'center' },
  scrollContainer: { padding: 24, alignItems: 'stretch' },
  headerTitle: { fontSize: 36, fontWeight: 'bold', color: '#fff', textAlign: 'center', marginTop: 20 },
  headerSubtitle: { fontSize: 16, color: '#94a3b8', textAlign: 'center', marginBottom: 30 },
  card: { backgroundColor: '#1e293b', padding: 20, borderRadius: 16, elevation: 4 },
  label: { color: '#94a3b8', fontSize: 14, fontWeight: '600', marginBottom: 8 },
  optional: { color: '#6b7280', fontStyle: 'italic' },
  input: { backgroundColor: '#0f172a', color: '#fff', padding: 14, borderRadius: 8, marginBottom: 20, fontSize: 16 },
  button: { backgroundColor: '#3b82f6', padding: 16, borderRadius: 8, alignItems: 'center', marginTop: 10 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  resultCard: { marginTop: 30, backgroundColor: '#1e293b', padding: 20, borderRadius: 16, borderWidth: 2, alignItems: 'center' },
  resultGrade: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
  resultText: { color: '#fff', fontSize: 16, marginBottom: 8 },
  resultFeedback: { color: '#94a3b8', fontSize: 14, textAlign: 'center', lineHeight: 20 },
  logButton: { backgroundColor: '#10b981', paddingVertical: 12, paddingHorizontal: 24, borderRadius: 8, marginTop: 15 },
  logButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
  historyContainer: { marginTop: 40 },
  historyHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  sectionLabel: { color: '#94a3b8', fontSize: 14, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1 },
  clearHistoryText: { color: '#ef4444', fontSize: 14, fontWeight: '500' },
  historyRow: { backgroundColor: '#1e293b', padding: 16, borderRadius: 12, marginBottom: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderWidth: 1, borderColor: '#334155', borderLeftWidth: 5 },
  historyLeft: { flex: 1 },
  historyItemTitle: { color: '#fff', fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
  historyItemSub: { color: '#94a3b8', fontSize: 13 },
  historyRight: { alignItems: 'center', marginLeft: 10 },
  historyItemRatio: { fontSize: 18, fontWeight: 'bold' },
  historyMiniBadge: { color: '#64748b', fontSize: 10, textTransform: 'uppercase', fontWeight: '700', marginTop: 2 },
  onboardingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 },
  iconText: { fontSize: 64, marginBottom: 24 },
  onboardingTitle: { fontSize: 28, fontWeight: 'bold', color: '#fff', textAlign: 'center', marginBottom: 16 },
  onboardingDescription: { fontSize: 16, color: '#94a3b8', textAlign: 'center', lineHeight: 24, marginBottom: 40 },
  progressWrapper: { flexDirection: 'row', marginBottom: 40 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#334155', marginHorizontal: 6 },
  activeDot: { backgroundColor: '#3b82f6', width: 24 },
  onboardingButton: { backgroundColor: '#3b82f6', paddingVertical: 16, paddingHorizontal: 48, borderRadius: 30, width: '100%', alignItems: 'center' },
  debugButton: { marginTop: 40, padding: 12, alignItems: 'center' },
  debugButtonText: { color: '#64748b', fontSize: 12, textDecorationLine: 'underline' }
});
