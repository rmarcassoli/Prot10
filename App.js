import React, { useState, useEffect } from 'react';
import { Text, View, TextInput, TouchableOpacity, ScrollView, SafeAreaView, ActivityIndicator, Alert } from 'react-native';
import { styles, onboardingSlides } from './theme';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // Navigation Tab State ('calculator' or 'history')
  const [activeTab, setActiveTab] = useState('calculator');

  const [foodName, setFoodName] = useState('');
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [dvPercent, setDvPercent] = useState('');
  
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  const handleNextSlide = () => {
    if (currentSlide < onboardingSlides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      setShowOnboarding(false);
    }
  };

  const evaluateProtein = () => {
    const calNum = parseFloat(calories);
    const proNum = parseFloat(protein);
    const dvNum = parseFloat(dvPercent);

    if (isNaN(calNum) || isNaN(proNum)) {
      alert("Please enter at least Calories and Protein grams.");
      return;
    }

    const passesTenPercentRule = proNum >= (calNum / 10.0);
    let qualityStatus = !isNaN(dvNum) ? (dvNum >= (proNum * 2.0 * 0.9) ? 'high' : 'low') : 'unknown';

    let grade = '🔴 Protein Halo Trap';
    let color = '#ef4444';
    let feedback = 'Too many total calories relative to the actual protein provided.';

    if (passesTenPercentRule) {
      if (qualityStatus === 'low') {
        grade = '🟡 Quantity Over Quality';
        color = '#eab308';
        feedback = 'Meets the 10% calorie ratio, but features an incomplete protein source.';
      } else {
        grade = '🟢 Prot10 Certified';
        color = '#22c55e';
        feedback = 'Excellent protein-to-calorie ratio with a complete protein source!';
      }
    } else if (qualityStatus === 'high') {
      grade = '🟡 Balanced / Low Density';
      color = '#eab308';
      feedback = 'The protein source is excellent quality, but the food is calorie-dense.';
    }

    setResult({ grade, color, feedback, ratio: calNum > 0 ? (proNum * 4 / calNum * 100).toFixed(0) : 0 });
  };

  const logToHistory = () => {
    if (!result) return;
    const displayTitle = foodName.trim() || `Product #${history.length + 1}`;
    setHistory([{ id: Date.now().toString(), title: displayTitle, calories, protein, ratio: result.ratio, grade: result.grade, color: result.color }, ...history]);
    setFoodName(''); setCalories(''); setProtein(''); setDvPercent(''); setResult(null);
    Alert.alert("Success", "Product saved to History Log!");
  };

  if (isLoading) return <View style={[styles.container, styles.center]}><ActivityIndicator size="large" color="#3b82f6" /></View>;

  if (showOnboarding) {
    const slide = onboardingSlides[currentSlide];
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.onboardingContainer}>
          <Text style={styles.iconText}>{slide.icon}</Text>
          <Text style={styles.onboardingTitle}>{slide.title}</Text>
          <Text style={styles.onboardingDescription}>{slide.description}</Text>
          <View style={styles.progressWrapper}>
            {onboardingSlides.map((_, idx) => <View key={idx} style={[styles.dot, currentSlide === idx && styles.activeDot]} />)}
          </View>
          <TouchableOpacity style={styles.onboardingButton} onPress={handleNextSlide}>
            <Text style={styles.buttonText}>{currentSlide === onboardingSlides.length - 1 ? "Get Started" : "Next"}</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Text style={styles.headerTitle}>Prot10</Text>
          
          {/* SCREEN 1: CALCULATOR VIEW */}
          {activeTab === 'calculator' && (
            <View>
              <Text style={styles.headerSubtitle}>Protein Integrity Tracker</Text>
              <View style={styles.card}>
                <Text style={styles.label}>Product Name <Text style={styles.optional}>(Optional)</Text></Text>
                <TextInput style={styles.input} placeholder="e.g., Pure Whey, Fuel Bar" placeholderTextColor="#6b7280" value={foodName} onChangeText={setFoodName} />
                <Text style={styles.label}>Total Calories</Text>
                <TextInput style={styles.input} placeholder="0" placeholderTextColor="#6b7280" keyboardType="numeric" value={calories} onChangeText={setCalories} />
                <Text style={styles.label}>Protein (Grams)</Text>
                <TextInput style={styles.input} placeholder="0" placeholderTextColor="#6b7280" keyboardType="numeric" value={protein} onChangeText={setProtein} />
                <Text style={styles.label}>Protein % Daily Value (%DV) <Text style={styles.optional}>(Optional)</Text></Text>
                <TextInput style={styles.input} placeholder="0" placeholderTextColor="#6b7280" keyboardType="numeric" value={dvPercent} onChangeText={setDvPercent} />
                <TouchableOpacity style={styles.button} onPress={evaluateProtein}><Text style={styles.buttonText}>Evaluate Label</Text></TouchableOpacity>
              </View>
              
              {result && (
                <View style={[styles.resultCard, { borderColor: result.color }]}>
                  <Text style={[styles.resultGrade, { color: result.color }]}>{result.grade}</Text>
                  <Text style={styles.resultText}>Calories from Protein: {result.ratio}%</Text>
                  <Text style={styles.resultFeedback}>{result.feedback}</Text>
                  <TouchableOpacity style={styles.logButton} onPress={logToHistory}><Text style={styles.logButtonText}>💾 Save Item to History Log</Text></TouchableOpacity>
                </View>
              )}
            </View>
          )}

          {/* SCREEN 2: HISTORY LOG VIEW */}
          {activeTab === 'history' && (
            <View style={{ marginTop: 10 }}>
              <View style={styles.historyHeader}>
                <Text style={styles.sectionLabel}>Saved History Log</Text>
                {history.length > 0 && (
                  <TouchableOpacity onPress={() => Alert.alert("Clear", "Delete history?", [{ text: "Cancel" }, { text: "Delete", onPress: () => setHistory([]) }])}>
                    <Text style={styles.clearHistoryText}>Clear All</Text>
                  </TouchableOpacity>
                )}
              </View>

              {history.length === 0 ? (
                <Text style={{ color: '#64748b', textAlign: 'center', marginTop: 40, fontSize: 16 }}>No items saved yet. Use the calculator tab to evaluate food products!</Text>
              ) : (
                history.map((item) => (
                  <View key={item.id} style={[styles.historyRow, { borderLeftColor: item.color }]}>
                    <View style={styles.historyLeft}><Text style={styles.historyItemTitle}>{item.title}</Text><Text style={styles.historyItemSub}>{item.calories} cal  •  {item.protein}g protein</Text></View>
                    <View style={styles.historyRight}><Text style={[styles.historyItemRatio, { color: item.color }]}>{item.ratio}%</Text><Text style={styles.historyMiniBadge}>Prot Cal</Text></View>
                  </View>
                ))
              )}
              
              <TouchableOpacity style={[styles.debugButton, { marginTop: 60 }]} onPress={() => setShowOnboarding(true)}>
                <Text style={styles.debugButtonText}>🔄 Preview Onboarding Slides Again</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>

        {/* CUSTOM BOTTOM TAB NAVIGATION MENU BAR */}
        <View style={{ flexDirection: 'row', height: 75, backgroundColor: '#1e293b', borderTopWidth: 1, borderColor: '#334155', justifyContent: 'space-around', alignItems: 'center', paddingBottom: 15 }}>
          <TouchableOpacity onPress={() => setActiveTab('calculator')} style={{ alignItems: 'center', flex: 1, opacity: activeTab === 'calculator' ? 1 : 0.4 }}>
            <Text style={{ fontSize: 22, marginBottom: 2 }}>📊</Text>
            <Text style={{ color: '#fff', fontSize: 12, fontWeight: '600' }}>Calculator</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setActiveTab('history')} style={{ alignItems: 'center', flex: 1, opacity: activeTab === 'history' ? 1 : 0.4 }}>
            <Text style={{ fontSize: 22, marginBottom: 2 }}>📜</Text>
            <Text style={{ color: '#fff', fontSize: 12, fontWeight: '600' }}>History ({history.length})</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

