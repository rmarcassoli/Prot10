import React, { useState, useEffect } from 'react';
import { Text, View, TouchableOpacity, SafeAreaView, ActivityIndicator, Alert, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { styles, onboardingSlides } from './theme';
import CalculatorTab from './CalculatorTab';
import HistoryTab from './HistoryTab';

const OnboardingIcon = ({ name }) => (
  <Ionicons name={name} size={42} color="#38bdf8" />
);

if (!global.__PROT10_PERSISTED_DATABASE__) {
  global.__PROT10_PERSISTED_DATABASE__ = "[]";
}

const CalculatorIcon = ({ active }) => (
  <Ionicons
    name={active ? 'calculator' : 'calculator-outline'}
    size={18}
    color={active ? '#ffffff' : '#94a3b8'}
  />
);

const HistoryIcon = ({ active }) => (
  <Ionicons
    name={active ? 'time' : 'time-outline'}
    size={18}
    color={active ? '#ffffff' : '#94a3b8'}
  />
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
      if (db && db !== "[]") {
        setHistory(JSON.parse(db));
        setShowOnboarding(false);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  };

  const evaluateProtein = () => {
    const calNum = parseFloat(calories);
    const proNum = parseFloat(protein);
    const dvNum = dvPercent !== '' && dvPercent !== null ? parseFloat(dvPercent) : null;

    if (isNaN(calNum) || isNaN(proNum) || calNum <= 0 || proNum <= 0) {
      alert("Please enter valid positive numbers for Calories and Protein.");
      return;
    }

    const passesTenPercentRule = proNum >= (calNum / 10.0);
    const ratio = (proNum * 4 / calNum * 100).toFixed(0);

    let qualityStatus = 'NO_DATA';
    let qualityLabel = 'Unverified Quality';

    if (dvNum !== null && !isNaN(dvNum)) {
      const requiredDV = proNum * 2.0 * 0.9;
      if (dvNum >= requiredDV) {
        qualityStatus = 'PASS';
        qualityLabel = 'Verified Complete Profile';
      } else {
        qualityStatus = 'FAIL';
        qualityLabel = 'Incomplete / Low Quality';
      }
    }

    let grade = 'LOW DENSITY';
    let color = '#ef4444';
    let feedback = `Only ${ratio}% of calories come from protein. Requires at least 10%.`;

    if (passesTenPercentRule) {
      switch (qualityStatus) {
        case 'PASS':
          grade = 'GOLD TIER';
          color = '#06b6d4';
          feedback = `${ratio}% protein calories. Excellent ratio with a verified complete protein source!`;
          break;
        case 'FAIL':
          grade = 'SILVER TIER';
          color = '#eab308';
          feedback = `${ratio}% protein calories. Meets density requirement, but utilizes a lower quality source.`;
          break;
        case 'NO_DATA':
        default:
          grade = 'PROT10 PASSED';
          color = '#22c55e';
          feedback = `${ratio}% protein calories. Meets density threshold. (%DV unverified).`;
          break;
      }
    }

    setResult({
      grade,
      color,
      feedback,
      ratio,
      qualityLabel
    });
  };

  const logToHistory = () => {
    if (!result) return;
    const nextEntry = {
      id: Date.now().toString(),
      title: foodName.trim() || `Product #${history.length + 1}`,
      calories,
      protein,
      ratio: result.ratio,
      grade: result.grade,
      color: result.color
    };
    setHistory([nextEntry, ...history]);
    setFoodName('');
    setCalories('');
    setProtein('');
    setDvPercent('');
    setResult(null);
    Alert.alert('Success', 'Product saved successfully!');
  };

  const closeResultModal = () => {
    setResult(null);
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#2563eb" />
        </View>
      </SafeAreaView>
    );
  }

  if (showOnboarding) {
    const slide = onboardingSlides[currentSlide];

    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.onboardingContainer}>
          <View style={styles.iconCircle}>
            <OnboardingIcon name={slide.iconName} />
          </View>
          <Text style={styles.onboardingTitle}>{slide.title}</Text>
          <Text style={styles.onboardingDescription}>{slide.description}</Text>

          <View style={styles.progressWrapper}>
            {onboardingSlides.map((_, idx) => (
              <View
                key={idx}
                style={[styles.dot, idx === currentSlide && styles.activeDot]}
              />
            ))}
          </View>

          <TouchableOpacity
            style={styles.onboardingButton}
            onPress={async () => {
              await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              if (currentSlide < onboardingSlides.length - 1) {
                setCurrentSlide(currentSlide + 1);
              } else {
                setShowOnboarding(false);
              }
            }}
          >
            <Text style={styles.buttonText}>
              {currentSlide === onboardingSlides.length - 1 ? 'Get Started' : 'Next'}
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flex: 1, paddingHorizontal: 18, paddingTop: 12, paddingBottom: 12 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
          <View style={{ flex: 1, alignItems: 'center' }}>
            <Text style={styles.headerTitle}>Prot10</Text>
          </View>

          <TouchableOpacity
            accessibilityRole="button"
            onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
            style={{
              width: 58,
              height: 58,
              borderRadius: 29,
              backgroundColor: '#0d1d2d',
              borderWidth: 1,
              borderColor: '#2a4668',
              justifyContent: 'center',
              alignItems: 'center',
              shadowColor: '#38bdf8',
              shadowOffset: { width: 0, height: 6 },
              shadowOpacity: 0.12,
              shadowRadius: 10,
              elevation: 4
            }}
          >
            <Ionicons name="bar-chart-outline" size={26} color="#7dd3fc" />
          </TouchableOpacity>
        </View>

        {result && (
          <Modal
            transparent
            visible={Boolean(result)}
            animationType="slide"
            onRequestClose={closeResultModal}
          >
            <View style={{ flex: 1, backgroundColor: 'rgba(2, 6, 23, 0.72)', justifyContent: 'center', alignItems: 'center', padding: 24 }}>
              <View style={{ width: '100%', maxWidth: 400, backgroundColor: '#131c2e', borderRadius: 24, borderWidth: 1, borderColor: '#1e293b', padding: 28, shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.35, shadowRadius: 20, elevation: 10 }}>
                <Text style={[styles.resultGrade, { color: result.color, textAlign: 'center' }]}>{result.grade}</Text>
                <Text style={[styles.resultText, { textAlign: 'center', marginBottom: 12 }]}>Calories from Protein: {result.ratio}%</Text>
                <Text style={[styles.resultFeedback, { marginBottom: 18 }]}>{result.feedback}</Text>
                <Text style={{ color: '#7dd3fc', fontSize: 13, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.8, textAlign: 'center', marginBottom: 20 }}>{result.qualityLabel}</Text>

                <View style={{ flexDirection: 'row', gap: 12 }}>
                  <TouchableOpacity
                    onPress={closeResultModal}
                    style={{ flex: 1, backgroundColor: '#1e293b', borderRadius: 12, paddingVertical: 14, alignItems: 'center', borderWidth: 1, borderColor: '#334155' }}
                  >
                    <Text style={{ color: '#e2e8f0', fontWeight: '800' }}>Close</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => {
                      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                      logToHistory();
                    }}
                    style={{ flex: 1, backgroundColor: '#059669', borderRadius: 12, paddingVertical: 14, alignItems: 'center', shadowColor: '#059669', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.25, shadowRadius: 6 }}
                  >
                    <Text style={{ color: '#ffffff', fontWeight: '800' }}>Save</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        )}

        <View
          style={{
            flexDirection: 'row',
            backgroundColor: '#07121d',
            borderRadius: 18,
            padding: 6,
            borderWidth: 1,
            borderColor: '#1d2f47',
            marginBottom: 16,
            overflow: 'hidden',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.25,
            shadowRadius: 12,
            elevation: 5
          }}
        >
          <TouchableOpacity
            onPress={() => setActiveTab('calculator')}
            style={{
              flex: 1,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              paddingVertical: 12,
              borderRadius: 12,
              backgroundColor: activeTab === 'calculator' ? '#0f2138' : 'transparent',
              borderWidth: activeTab === 'calculator' ? 1 : 0,
              borderColor: '#67e8f9'
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
              <CalculatorIcon active={activeTab === 'calculator'} />
              <Text style={{ color: '#ffffff', fontWeight: '700', marginLeft: 8 }}>Calculator</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setActiveTab('history')}
            style={{
              flex: 1,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              paddingVertical: 12,
              borderRadius: 12,
              backgroundColor: activeTab === 'history' ? '#0f2138' : 'transparent',
              borderWidth: activeTab === 'history' ? 1 : 0,
              borderColor: '#67e8f9'
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
              <HistoryIcon active={activeTab === 'history'} />
              <Text style={{ color: '#ffffff', fontWeight: '700', marginLeft: 8 }}>History ({history.length})</Text>
            </View>
          </TouchableOpacity>
        </View>

        {activeTab === 'calculator' ? (
          <CalculatorTab
            foodName={foodName}
            setFoodName={setFoodName}
            calories={calories}
            setCalories={setCalories}
            protein={protein}
            setProtein={setProtein}
            dvPercent={dvPercent}
            setDvPercent={setDvPercent}
            evaluateProtein={evaluateProtein}
            result={result}
            logToHistory={logToHistory}
          />
        ) : (
          <HistoryTab
            history={history}
            setHistory={setHistory}
            setShowOnboarding={setShowOnboarding}
            setCurrentSlide={setCurrentSlide}
          />
        )}
      </View>
    </SafeAreaView>
  );
}