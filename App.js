import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, SafeAreaView, ActivityIndicator } from 'react-native';

export default function App() {
  // Application States
  const [isLoading, setIsLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Calculator States
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [dvPercent, setDvPercent] = useState('');
  const [result, setResult] = useState(null);

  const onboardingSlides = [
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

  // Check state on startup
  useEffect(() => {
    checkOnboardingStatus();
  }, []);

  const checkOnboardingStatus = () => {
    // Direct operational state check bypassing physical download crashes
    setIsLoading(false);
  };

  const handleNextSlide = () => {
    if (currentSlide < onboardingSlides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      setShowOnboarding(false);
    }
  };

  const resetOnboardingDebug = () => {
    setCurrentSlide(0);
    setShowOnboarding(true);
    setResult(null);
  };

  const evaluateProtein = () => {
    const calNum = parseFloat(calories);
    const proNum = parseFloat(protein);
    const dvNum = parseFloat(dvPercent);

    if (isNaN(calNum) || isNaN(proNum)) {
      alert("Please enter at least Calories and Protein grams.");
      return;
    }

    const targetProtein = calNum / 10.0;
    const passesTenPercentRule = proNum >= targetProtein;

    let qualityStatus = 'unknown';
    if (!isNaN(dvNum)) {
      const expectedDV = proNum * 2.0;
      qualityStatus = dvNum >= (expectedDV * 0.9) ? 'high' : 'low';
    }

    let grade = '🔴 Protein Halo Trap';
    let color = '#ef4444';
    let feedback = 'Too many total calories relative to the actual amount of protein provided.';

    if (passesTenPercentRule) {
      if (qualityStatus === 'low') {
        grade = '🟡 Quantity Over Quality';
        color = '#eab308';
        feedback = 'Meets the 10% calorie ratio, but the low %DV indicates an incomplete protein source.';
      } else {
        grade = '🟢 Prot10 Certified';
        color = '#22c55e';
        feedback = 'Excellent protein-to-calorie ratio with a highly digestible, complete protein source!';
      }
    } else {
      if (qualityStatus === 'high') {
        grade = '🟡 Balanced / Low Density';
        color = '#eab308';
        feedback = 'The protein source is excellent quality, but the food item itself is highly calorie-dense.';
      }
    }

    setResult({
      grade,
      color,
      feedback,
      ratio: calNum > 0 ? (proNum * 4 / calNum * 100).toFixed(0) : 0
    });
  };

  if (isLoading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  if (showOnboarding) {
    const slide = onboardingSlides[currentSlide];
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.onboardingContainer}>
          <Text style={styles.iconText}>{slide.icon}</Text>
          <Text style={styles.onboardingTitle}>{slide.title}</Text>
          <Text style={styles.onboardingDescription}>{slide.description}</Text>
          
          <View style={styles.progressWrapper}>
            {onboardingSlides.map((_, idx) => (
              <View key={idx} style={[styles.dot, currentSlide === idx && styles.activeDot]} />
            ))}
          </View>

          <TouchableOpacity style={styles.onboardingButton} onPress={handleNextSlide}>
            <Text style={styles.buttonText}>
              {currentSlide === onboardingSlides.length - 1 ? "Get Started" : "Next"}
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.headerTitle}>Prot10</Text>
        <Text style={styles.headerSubtitle}>Protein Integrity Tracker</Text>

        <View style={styles.card}>
          <Text style={styles.label}>Total Calories</Text>
          <TextInput 
            style={styles.input} 
            placeholder="e.g., 140" 
            placeholderTextColor="#6b7280"
            keyboardType="numeric"
            value={calories}
            onChangeText={setCalories}
          />

          <Text style={styles.label}>Protein (Grams)</Text>
          <TextInput 
            style={styles.input} 
            placeholder="e.g., 15" 
            placeholderTextColor="#6b7280"
            keyboardType="numeric"
            value={protein}
            onChangeText={setProtein}
          />

          <Text style={styles.label}>Protein % Daily Value (%DV) <Text style={styles.optional}>(Optional)</Text></Text>
          <TextInput 
            style={styles.input} 
            placeholder="e.g., 30" 
            placeholderTextColor="#6b7280"
            keyboardType="numeric"
            value={dvPercent}
            onChangeText={setDvPercent}
          />

          <TouchableOpacity style={styles.button} onPress={evaluateProtein}>
            <Text style={styles.buttonText}>Evaluate Label</Text>
          </TouchableOpacity>
        </View>

        {result && (
          <View style={[styles.resultCard, { borderColor: result.color }]}>
            <Text style={[styles.resultGrade, { color: result.color }]}>{result.grade}</Text>
            <Text style={styles.resultText}>Calories from Protein: {result.ratio}%</Text>
            <Text style={styles.resultFeedback}>{result.feedback}</Text>
          </View>
        )}

        <TouchableOpacity style={styles.debugButton} onPress={resetOnboardingDebug}>
          <Text style={styles.debugButtonText}>🔄 Preview Onboarding Slides Again</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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

