import { StyleSheet } from 'react-native';

export const onboardingSlides = [
  {
    title: "Welcome to Prot10",
    description: "Food marketing can be misleading. Prot10 helps you cut through the hype and decode the true density and quality of protein on any nutrition label.",
    iconName: 'search',
    iconType: 'Ionicons'
  },
  {
    title: "The 10% Density Rule",
    description: "True high-protein food should have at least 1 gram of protein for every 10 calories. If an item has 140 calories, it needs 14g of protein to pass our density check.",
    iconName: 'bar-chart',
    iconType: 'Ionicons'
  },
  {
    title: "The Quality Check",
    description: "Grams only measure quantity. By entering the % Daily Value (%DV), Prot10 calculates if the source uses complete amino acids (like whey/soy) or cheap fillers (like collagen).",
    iconName: 'fitness',
    iconType: 'Ionicons'
  }
];

export const styles = StyleSheet.create({
  // Global Canvas Layout
  container: { flex: 1, backgroundColor: '#090d16' }, // Deeper space-black canvas
  center: { justifyContent: 'center', alignItems: 'center' },
  scrollContainer: { padding: 24, paddingBottom: 40 },
  
  // High-End Typography
  headerTitle: { fontSize: 38, fontWeight: '900', color: '#f8fafc', textAlign: 'center', marginTop: 6, letterSpacing: -1.1 },
  headerEyebrow: { fontSize: 12, color: '#d4af37', textAlign: 'center', marginTop: 4, marginBottom: 2, fontWeight: '800', letterSpacing: 1.8, textTransform: 'uppercase' },
  headerSubtitle: { fontSize: 15, color: '#cfe3ff', textAlign: 'center', marginBottom: 28, fontWeight: '600', letterSpacing: 0.3 },
  
  // Premium Form Cards
  card: { backgroundColor: '#0b1422', padding: 24, borderRadius: 24, borderWidth: 1, borderColor: '#1f2f44', shadowColor: '#01060d', shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.42, shadowRadius: 22, elevation: 10 },
  label: { color: '#a9bbd3', fontSize: 12, fontWeight: '700', marginBottom: 10, textTransform: 'uppercase', letterSpacing: 0.9 },
  optional: { color: '#72839b', fontStyle: 'italic', textTransform: 'none' },
  
  // Sleek Glass Inputs
  input: { backgroundColor: '#050d18', color: '#ffffff', padding: 16, borderRadius: 14, marginBottom: 22, fontSize: 16, fontWeight: '600', borderWidth: 1, borderColor: '#1d2d3f', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.18, shadowRadius: 4 },
  
  // Vibrant CTA Buttons
  button: { backgroundColor: '#0c1a2b', borderWidth: 1, borderColor: '#7dd3fc', padding: 18, borderRadius: 14, alignItems: 'center', marginTop: 8, shadowColor: '#38bdf8', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.2, shadowRadius: 10 },
  buttonText: { color: '#f8fafc', fontSize: 16, fontWeight: '800', letterSpacing: 0.3 },
  
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
  historyRow: { backgroundColor: '#0d1a2b', padding: 18, borderRadius: 18, marginBottom: 14, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderWidth: 1, borderColor: '#243649', borderLeftWidth: 6 },
  historyLeft: { flex: 1, paddingRight: 10 },
  historyItemTitle: { color: '#ffffff', fontSize: 17, fontWeight: '700', marginBottom: 6 },
  historyItemSub: { color: '#a7b8d6', fontSize: 14, fontWeight: '600' },
  historyRight: { alignItems: 'center', backgroundColor: '#050d18', paddingVertical: 8, paddingHorizontal: 14, borderRadius: 10, borderWidth: 1, borderColor: '#1d2f47', minWidth: 70 },
  historyItemRatio: { fontSize: 18, fontWeight: '900' },
  historyMiniBadge: { color: '#8aa1c5', fontSize: 9, textTransform: 'uppercase', fontWeight: '800', marginTop: 2, letterSpacing: 0.3 },

  // Interactive Onboarding Layout
  onboardingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 36 },
  iconCircle: {
    width: 120,
    height: 120,
    borderRadius: 36,
    backgroundColor: '#0e1b2a',
    borderWidth: 1,
    borderColor: '#2d4b6d',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 28,
    shadowColor: '#67e8f9',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.22,
    shadowRadius: 18,
    elevation: 7
  },
  onboardingTitle: { fontSize: 30, fontWeight: '900', color: '#f8fafc', textAlign: 'center', marginBottom: 18, letterSpacing: -0.5 },
  onboardingDescription: { fontSize: 16, color: '#d8e4f7', textAlign: 'center', lineHeight: 26, marginBottom: 44, fontWeight: '500' },
  progressWrapper: { flexDirection: 'row', marginBottom: 44 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#1f2d3d', marginHorizontal: 6 },
  activeDot: { backgroundColor: '#d4af37', width: 26 },
  onboardingButton: { backgroundColor: '#0f172a', borderWidth: 1, borderColor: '#d4af37', paddingVertical: 18, borderRadius: 16, width: '100%', alignItems: 'center', shadowColor: '#d4af37', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.2, shadowRadius: 8 },
  
  // Minimalist Debug Elements
  debugButton: { marginTop: 45, padding: 12, alignItems: 'center' },
  debugButtonText: { color: '#475569', fontSize: 12, textDecorationLine: 'underline', fontWeight: '600' }
});

