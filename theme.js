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
  // Global Canvas Layout
  container: { flex: 1, backgroundColor: '#090d16' }, // Deeper space-black canvas
  center: { justifyContent: 'center', alignItems: 'center' },
  scrollContainer: { padding: 24, paddingBottom: 40 },
  
  // High-End Typography
  headerTitle: { fontSize: 38, fontWeight: '900', color: '#ffffff', textAlign: 'center', marginTop: 15, letterSpacing: -0.5 },
  headerSubtitle: { fontSize: 15, color: '#64748b', textAlign: 'center', marginBottom: 28, fontWeight: '500', letterSpacing: 0.3 },
  
  // Premium Form Cards
  card: { backgroundColor: '#131c2e', padding: 24, borderRadius: 20, borderWidth: 1, borderColor: '#1e293b', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 5 },
  label: { color: '#94a3b8', fontSize: 13, fontWeight: '700', marginBottom: 10, textTransform: 'uppercase', letterSpacing: 0.5 },
  optional: { color: '#475569', fontStyle: 'italic', textTransform: 'none' },
  
  // Sleek Glass Inputs
  input: { backgroundColor: '#090d16', color: '#ffffff', padding: 16, borderRadius: 12, marginBottom: 22, fontSize: 16, fontWeight: '600', borderWidth: 1, borderColor: '#1e293b' },
  
  // Vibrant CTA Buttons
  button: { backgroundColor: '#2563eb', padding: 18, borderRadius: 14, alignItems: 'center', marginTop: 8, shadowColor: '#2563eb', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 6 },
  buttonText: { color: '#ffffff', fontSize: 16, fontWeight: '800', letterSpacing: 0.3 },
  
  // Dynamic Score Display Cards
  resultCard: { marginTop: 28, backgroundColor: '#131c2e', padding: 24, borderRadius: 20, borderWidth: 1.5, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.4, shadowRadius: 12 },
  resultGrade: { fontSize: 24, fontWeight: '900', marginBottom: 12, letterSpacing: -0.3 },
  resultText: { color: '#ffffff', fontSize: 17, fontWeight: '700', marginBottom: 10 },
  resultFeedback: { color: '#94a3b8', fontSize: 14, textAlign: 'center', lineHeight: 22, fontWeight: '500', paddingHorizontal: 10 },
  logButton: { backgroundColor: '#059669', paddingVertical: 14, paddingHorizontal: 28, borderRadius: 12, marginTop: 20, shadowColor: '#059669', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.2, shadowRadius: 4 },
  logButtonText: { color: '#ffffff', fontWeight: '800', fontSize: 14, letterSpacing: 0.2 },

  // Timeline History Layout
  historyContainer: { marginTop: 10 },
  historyHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, paddingHorizontal: 4 },
  sectionLabel: { color: '#38bdf8', fontSize: 13, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 1 },
  clearHistoryText: { color: '#f43f5e', fontSize: 14, fontWeight: '700' },
  
  // Neomorphic History Rows
  historyRow: { backgroundColor: '#131c2e', padding: 18, borderRadius: 16, marginBottom: 14, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderWidth: 1, borderColor: '#1e293b', borderLeftWidth: 6 },
  historyLeft: { flex: 1, paddingRight: 10 },
  historyItemTitle: { color: '#ffffff', fontSize: 17, fontWeight: '700', marginBottom: 6 },
  historyItemSub: { color: '#64748b', fontSize: 14, fontWeight: '600' },
  historyRight: { alignItems: 'center', backgroundColor: '#090d16', paddingVertical: 8, paddingHorizontal: 14, borderRadius: 10, borderWidth: 1, borderColor: '#1e293b', minWidth: 70 },
  historyItemRatio: { fontSize: 18, fontWeight: '900' },
  historyMiniBadge: { color: '#475569', fontSize: 9, textTransform: 'uppercase', fontWeight: '800', marginTop: 2, letterSpacing: 0.3 },

  // Interactive Onboarding Layout
  onboardingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 36 },
  iconText: { fontSize: 72, marginBottom: 28 },
  onboardingTitle: { fontSize: 30, fontWeight: '900', color: '#ffffff', textAlign: 'center', marginBottom: 18, letterSpacing: -0.5 },
  onboardingDescription: { fontSize: 16, color: '#94a3b8', textAlign: 'center', lineHeight: 26, marginBottom: 44, fontWeight: '500' },
  progressWrapper: { flexDirection: 'row', marginBottom: 44 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#1e293b', marginHorizontal: 6 },
  activeDot: { backgroundColor: '#2563eb', width: 26 },
  onboardingButton: { backgroundColor: '#2563eb', paddingVertical: 18, borderRadius: 16, width: '100%', alignItems: 'center', shadowColor: '#2563eb', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 6 },
  
  // Minimalist Debug Elements
  debugButton: { marginTop: 45, padding: 12, alignItems: 'center' },
  debugButtonText: { color: '#475569', fontSize: 12, textDecorationLine: 'underline', fontWeight: '600' }
});

