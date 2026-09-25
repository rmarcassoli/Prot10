import React, { useState, useEffect } from 'react';
import { Text, View, TextInput, TouchableOpacity, ScrollView, SafeAreaView, ActivityIndicator, Alert } from 'react-native';

import { styles, onboardingSlides } from './theme';
import CalculatorTab from './CalculatorTab';
import HistoryTab from './HistoryTab';

if (!global.__PROT10_PERSISTED_DATABASE__) {
  global.__PROT10_PERSISTED_DATABASE__ = "[]";
}

const CalculatorIcon = ({ active }) => (
  <View style={{ width: 24, height: 24, justifyContent: 'center', alignItems: 'center', opacity: active ? 1 : 0.4 }}>
    <View style={{ width: 20, height: 24, borderRadius: 5, borderWidth: 2, borderColor: '#fff', padding: 2, justifyContent: 'space-between' }}>
      <View style={{ height: 4, backgroundColor: '#fff', borderRadius: 1 }} />
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <View style={{ width: 3, height: 3, backgroundColor: '#fff', borderRadius: 0.5 }} /><View style={{ width: 3, height: 3, backgroundColor: '#fff', borderRadius: 0.5 }} /><View style={{ width: 3, height: 3, backgroundColor: '#fff', borderRadius: 0.5 }} />
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <View style={{ width: 3, height: 3, backgroundColor: '#fff', borderRadius: 0.5 }} /><View style={{ width: 3, height: 3, backgroundColor: '#fff', borderRadius: 0.5 }} /><View style={{ width: 3, height: 3, backgroundColor: '#fff', borderRadius: 0.5 }} />
      </View>
    </View>
  </View>
);

const HistoryIcon = ({ active }) => (
  <View style={{ width: 24, height: 24, justifyContent: 'center', alignItems: 'center', opacity: active ? 1 : 0.4 }}>
    <View style={{ width: 20, height: 22, borderRadius: 4, borderWidth: 2, borderColor: '#fff', padding: 3, justifyContent: 'space-between' }}>
      <View style={{ width: 10, height: 2, backgroundColor: '#fff', borderRadius: 1 }} /><View style={{ width: 10, height: 2, backgroundColor: '#fff', borderRadius: 1 }} /><View style={{ width: 6, height: 2, backgroundColor: '#fff', borderRadius: 1 }} />
    </View>
    <View style={{ position: 'absolute', right: -1, bottom: -1, width: 8, height: 8, borderRadius: 4, backgroundColor: '#2563eb', borderWidth: 1, borderColor: '#1e293b' }} />
  </View>
);

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeTab, setActiveTab] = useState('calculator');

  const [foodName, setFoodName] = useState('');
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [dvPercent, setDvPercent] = useState('');
  
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);

  useEffect(() => { loadStoredData(); }, []);
  useEffect(() => { if (!isLoading && history.length >= 0) global.__PROT10_PERSISTED_DATABASE__ = JSON.stringify(history); }, [history, isLoading]);

  const loadStoredData = () => {
    try {
      const db = global.__PROT10_PERSISTED_DATABASE__;
      if (db && db !== "[]") { setHistory(JSON.parse(db)); setShowOnboarding(false); }
    } catch (e) { console.log(e); } finally { setIsLoading(false); }
  };

  const evaluateProtein = () => {
    const calNum = parseFloat(calories); const proNum = parseFloat(protein); const dvNum = parseFloat(dvPercent);
    if (isNaN(calNum) || isNaN(proNum)) { alert("Please enter at least Calories and Protein grams."); return; }
    const passesTenPercentRule = proNum >= (calNum / 10.0);
    let qualityStatus = !isNaN(dvNum) ? (dvNum >= (proNum * 2.0 * 0.9) ? 'high' : 'low') : 'unknown';
    let grade = '🔴 Protein Halo Trap'; let color = '#ef4444'; let feedback = 'Too many calories relative to protein.';
    if (passesTenPercentRule) {
      if (qualityStatus === 'low') { grade = '🟡 Quantity Over Quality'; color = '#eab308'; feedback = 'Meets density, but uses an incomplete source.'; }
      else { grade = '🟢 Prot10 Certified'; color = '#22c55e'; feedback = 'Excellent ratio with a complete protein source!'; }
    } else if (qualityStatus === 'high') { grade = '🟡 Balanced / Low Density'; color = '#eab308'; feedback = 'High quality source material, but calorie-dense.'; }
    setResult({ grade, color, feedback, ratio: calNum > 0 ? (proNum * 4 / calNum * 100).toFixed(0) : 0 });
  };

  const logToHistory = () => {
    if (!result) return;
    setHistory([{ id: Date.now().toString(), title: foodName.trim() || `Product #${history.length + 1}`, calories, protein, ratio: result.ratio, grade: result.grade, color: result.color }, ...history]);
    setFoodName(''); setCalories(''); setProtein(''); setDvPercent(''); setResult(null);
    Alert.alert("Success", "Product saved successfully!");
  };

  if (isLoading) return <View style={[styles.container, styles.center]}><ActivityIndicator size="large" color="#3b82f6" /></View>;

  if (showOnboarding) {
    const slide = onboardingSlides[currentSlide];
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.onboardingContainer}>
          <Text style={styles.iconText}>{slide.icon}</Text><Text style={styles.onboardingTitle}>{slide.title}</Text><Text style={styles.onboardingDescription}>{slide.description}</Text>
          <View style={styles.progressWrapper}>{onboardingSlides.map((_, idx) => <View key={idx} style={[styles.dot, currentSlide === idx && styles.activeDot]} />)}</View>
          <TouchableOpacity style={styles.onboardingButton} onPress={() => currentSlide < onboardingSlides.length - 1 ? setCurrentSlide(currentSlide + 1) : setShowOnboarding(false)}><Text style={styles.buttonText}>{currentSlide === onboardingSlides.length - 1 ? "Get Started" : "Next"}</Text></TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Text style={styles.headerTitle}>Prot10</Text>
          {activeTab === 'calculator' ? (
            <CalculatorTab foodName={foodName} setFoodName={setFoodName} calories={calories} setCalories={setCalories} protein={protein} setProtein={setProtein} dvPercent={dvPercent} setDvPercent={setDvPercent} evaluateProtein={evaluateProtein} result={result} logToHistory={logToHistory} />
          ) : (
            <HistoryTab history={history} setHistory={setHistory} setShowOnboarding={setShowOnboarding} />
          )}
        </ScrollView>
        <View style={{ flexDirection: 'row', height: 75, backgroundColor: '#131c2e', borderTopWidth: 1, borderColor: '#1e293b', justifyContent: 'space-around', alignItems: 'center', paddingBottom: 15 }}>
          <TouchableOpacity onPress={() => setActiveTab('calculator')} style={{ alignItems: 'center', flex: 1, paddingTop: 10 }}><CalculatorIcon active={activeTab === 'calculator'} /><Text style={{ color: activeTab === 'calculator' ? '#2563eb' : '#64748b', fontSize: 11, fontWeight: '700', marginTop: 5 }}>Calculator</Text></TouchableOpacity>
          <TouchableOpacity onPress={() => setActiveTab('history')} style={{ alignItems: 'center', flex: 1, paddingTop: 10 }}><HistoryIcon active={activeTab === 'history'} /><Text style={{ color: activeTab === 'history' ? '#2563eb' : '#64748b', fontSize: 11, fontWeight: '700', marginTop: 5 }}>History ({history.length})</Text></TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
