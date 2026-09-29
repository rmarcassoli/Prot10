import React, { useState, useEffect } from 'react';
import { Text, View, TouchableOpacity, SafeAreaView, ActivityIndicator, Alert, Modal, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { styles, onboardingSlides } from './theme';
import CalculatorTab from './CalculatorTab';
import HistoryTab from './HistoryTab';

const OnboardingIcon = ({ name }) => {
  if (name === 'prot10') {
    return (
      <Image
        source={require('./assets/icon.png')}
        style={{ width: 72, height: 72, resizeMode: 'contain' }}
      />
    );
  }

  if (name === 'ten-percent') {
    return (
      <View
        style={{
          width: 72,
          height: 72,
          borderRadius: 22,
          backgroundColor: '#0d1d2d',
          borderWidth: 1.5,
          borderColor: '#7dd3fc',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Text style={{ color: '#7dd3fc', fontSize: 28, fontWeight: '900', letterSpacing: -1 }}>10%</Text>
      </View>
    );
  }

  if (name === 'dv-check') {
    return (
      <View
        style={{
          width: 72,
          height: 72,
          borderRadius: 22,
          backgroundColor: '#0d1d2d',
          borderWidth: 1.5,
          borderColor: '#7dd3fc',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
        }}
      >
        <Text style={{ color: '#7dd3fc', fontSize: 18, fontWeight: '900', letterSpacing: -0.3 }}>DV</Text>
        <Ionicons
          name="checkmark-circle"
          size={22}
          color="#34d399"
          style={{ position: 'absolute', right: 8, bottom: 8 }}
        />
      </View>
    );
  }

  if (name === 'stoplight') {
    return (
      <View
        style={{
          width: 82,
          height: 72,
          borderRadius: 22,
          backgroundColor: '#0d1d2d',
          borderWidth: 1.5,
          borderColor: '#7dd3fc',
          justifyContent: 'center',
          alignItems: 'center',
          paddingVertical: 8,
        }}
      >
        <View style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
          <View style={{ width: 16, height: 16, borderRadius: 8, backgroundColor: '#ef4444' }} />
          <View style={{ width: 16, height: 16, borderRadius: 8, backgroundColor: '#eab308' }} />
          <View style={{ width: 16, height: 16, borderRadius: 8, backgroundColor: '#22c55e' }} />
        </View>
      </View>
    );
  }

  return <Ionicons name={name} size={42} color="#38bdf8" />;
};

if (!global.__PROT10_PERSISTED_DATABASE__) {
  global.__PROT10_PERSISTED_DATABASE__ = "[]";
}

const STORAGE_KEYS = {
  history: 'prot10_history',
  onboarding: 'prot10_skip_onboarding',
};

const persistHistory = async (nextHistory) => {
  const safeHistory = Array.isArray(nextHistory) ? nextHistory : [];
  global.__PROT10_PERSISTED_DATABASE__ = JSON.stringify(safeHistory);
  await AsyncStorage.setItem(STORAGE_KEYS.history, JSON.stringify(safeHistory));
};

const persistOnboardingPreference = async (shouldSkipOnboarding) => {
  await AsyncStorage.setItem(STORAGE_KEYS.onboarding, JSON.stringify(Boolean(shouldSkipOnboarding)));
};

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
  const [skipOnboarding, setSkipOnboarding] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeTab, setActiveTab] = useState('calculator');

  const [foodName, setFoodName] = useState('');
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [dvPercent, setDvPercent] = useState('');

  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [showHowItWorks, setShowHowItWorks] = useState(false);

  useEffect(() => { loadStoredData(); }, []);
  useEffect(() => {
    if (!isLoading) {
      persistHistory(history);
    }
  }, [history, isLoading]);

  const loadStoredData = async () => {
    try {
      const [savedHistory, savedOnboardingPreference] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.history),
        AsyncStorage.getItem(STORAGE_KEYS.onboarding)
      ]);

      if (savedHistory) {
        const parsedHistory = JSON.parse(savedHistory);
        setHistory(Array.isArray(parsedHistory) ? parsedHistory : []);
      } else if (global.__PROT10_PERSISTED_DATABASE__ && global.__PROT10_PERSISTED_DATABASE__ !== '[]') {
        setHistory(JSON.parse(global.__PROT10_PERSISTED_DATABASE__));
      }

      const shouldSkipOnboarding = savedOnboardingPreference ? JSON.parse(savedOnboardingPreference) : false;
      setSkipOnboarding(Boolean(shouldSkipOnboarding));
      setShowOnboarding(!shouldSkipOnboarding);
    } catch (e) {
      console.log(e);
      setHistory([]);
      setShowOnboarding(true);
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
    let qualityLabel = 'Unverified';

    if (dvNum !== null && !isNaN(dvNum)) {
      const requiredDV = proNum * 2.0 * 0.9;
      if (dvNum >= requiredDV) {
        qualityStatus = 'PASS';
        qualityLabel = 'Verified Quality';
      } else {
        qualityStatus = 'FAIL';
        qualityLabel = 'Needs Improvement';
      }
    }

    let grade = 'RED';
    let color = '#ef4444';
    let feedback = `Only ${ratio}% of calories come from protein. This falls below the 10% density threshold.`;

    if (passesTenPercentRule) {
      switch (qualityStatus) {
        case 'PASS':
          grade = 'GREEN';
          color = '#22c55e';
          feedback = `${ratio}% protein calories. This meets the density rule and passes the quality check.`;
          break;
        case 'FAIL':
          grade = 'YELLOW';
          color = '#eab308';
          feedback = `${ratio}% protein calories. It meets density, but the protein quality is weaker than the verified standard.`;
          break;
        case 'NO_DATA':
        default:
          grade = 'GREEN';
          color = '#22c55e';
          feedback = `${ratio}% protein calories. It meets the density threshold, but the protein quality is still unverified.`;
          break;
      }
    }

    if (grade === 'RED') {
      qualityLabel = 'Low Quality';
    }
    if (grade === 'YELLOW') {
      qualityLabel = 'Needs Improvement';
    }
    if (grade === 'GREEN') {
      qualityLabel = 'Verified Quality';
    }

    if (qualityLabel === 'Unverified') {
      qualityLabel = 'Verified Quality';
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
            style={styles.checkboxRow}
            onPress={() => setSkipOnboarding((current) => !current)}
            activeOpacity={0.8}
          >
            <View style={[styles.checkbox, skipOnboarding && styles.checkboxChecked]}>
              {skipOnboarding && <Ionicons name="checkmark" size={14} color="#06141f" />}
            </View>
            <Text style={styles.checkboxText}>Don’t show onboarding again</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.onboardingButton}
            onPress={async () => {
              await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              if (currentSlide < onboardingSlides.length - 1) {
                setCurrentSlide(currentSlide + 1);
              } else {
                await persistOnboardingPreference(skipOnboarding);
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
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8, paddingHorizontal: 2 }}>
          <View style={{ width: 58, height: 58 }} />

          <View style={{ flex: 1, alignItems: 'center' }}>
            <Text style={styles.headerTitle}>Prot10</Text>
          </View>

          <TouchableOpacity
            accessibilityRole="button"
            onPress={async () => {
              await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setShowHowItWorks(true);
            }}
            style={{
              width: 58,
              height: 58,
              borderRadius: 29,
              backgroundColor: '#0b1422',
              borderWidth: 1,
              borderColor: '#223a52',
              justifyContent: 'center',
              alignItems: 'center',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.12,
              shadowRadius: 5,
              elevation: 2
            }}
          >
            <Ionicons name="information-circle-outline" size={20} color="#a7b7cf" />
          </TouchableOpacity>
        </View>

        <Modal
          transparent
          visible={showHowItWorks}
          animationType="slide"
          onRequestClose={() => setShowHowItWorks(false)}
        >
          <View style={{ flex: 1, backgroundColor: 'rgba(2, 6, 23, 0.72)', justifyContent: 'center', alignItems: 'center', padding: 24 }}>
            <View style={{ width: '100%', maxWidth: 420, backgroundColor: '#0d1827', borderRadius: 24, borderWidth: 1, borderColor: '#1f2f46', padding: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.4, shadowRadius: 20, elevation: 10 }}>
              <Text style={{ color: '#d4af37', fontSize: 12, fontWeight: '800', letterSpacing: 1.2, textTransform: 'uppercase', marginBottom: 8 }}>How it works</Text>
              <Text style={{ color: '#f8fafc', fontSize: 28, fontWeight: '900', marginBottom: 18 }}>Protein Quality Checker</Text>

              <View style={{ gap: 12 }}>
                <View style={{ backgroundColor: '#101d30', borderRadius: 14, padding: 14, borderWidth: 1, borderColor: '#22314d' }}>
                  <Text style={{ color: '#7dd3fc', fontWeight: '800', marginBottom: 4 }}>1. Density rule</Text>
                  <Text style={{ color: '#dfeafc', lineHeight: 20 }}>A product should have at least 1 gram of protein for every 10 calories to meet the base density check.</Text>
                </View>

                <View style={{ backgroundColor: '#101d30', borderRadius: 14, padding: 14, borderWidth: 1, borderColor: '#22314d' }}>
                  <Text style={{ color: '#7dd3fc', fontWeight: '800', marginBottom: 4 }}>2. Quality rule</Text>
                  <Text style={{ color: '#dfeafc', lineHeight: 20 }}>Add the % Daily Value to estimate whether the protein source is a complete profile or a weaker filler source.</Text>
                </View>

                <View style={{ backgroundColor: '#101d30', borderRadius: 14, padding: 14, borderWidth: 1, borderColor: '#22314d' }}>
                  <Text style={{ color: '#7dd3fc', fontWeight: '800', marginBottom: 4 }}>3. Save results</Text>
                  <Text style={{ color: '#dfeafc', lineHeight: 20 }}>When the label is reviewed, save it to your history log for quick comparisons later.</Text>
                </View>
              </View>

              <TouchableOpacity
                onPress={() => setShowHowItWorks(false)}
                style={{ marginTop: 20, backgroundColor: '#0e1a2e', borderRadius: 12, paddingVertical: 14, alignItems: 'center', borderWidth: 1, borderColor: '#d4af37' }}
              >
                <Text style={{ color: '#f8fafc', fontWeight: '800' }}>Got it</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {result && (
          <Modal
            transparent
            visible={Boolean(result)}
            animationType="slide"
            onRequestClose={closeResultModal}
          >
            <View style={{ flex: 1, backgroundColor: 'rgba(2, 6, 23, 0.72)', justifyContent: 'center', alignItems: 'center', padding: 24 }}>
              <View style={{ width: '100%', maxWidth: 400, backgroundColor: '#101b2d', borderRadius: 26, borderWidth: 1, borderColor: '#1f3551', padding: 28, shadowColor: '#000', shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.35, shadowRadius: 20, elevation: 10 }}>
                <View style={{ alignItems: 'center', marginBottom: 12 }}>
                  <Text style={[styles.resultGrade, { color: result.color, textAlign: 'center' }]}>{result.grade}</Text>
                </View>
                <Text style={[styles.resultText, { textAlign: 'center', marginBottom: 12 }]}>Calories from Protein: {result.ratio}%</Text>
                <Text style={[styles.resultFeedback, { marginBottom: 18 }]}>{result.feedback}</Text>
                <View style={{ backgroundColor: '#0d1827', borderRadius: 12, borderWidth: 1, borderColor: '#22314d', paddingVertical: 10, marginBottom: 18 }}>
                  <Text style={{ color: '#7dd3fc', fontSize: 13, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.8, textAlign: 'center' }}>{result.qualityLabel}</Text>
                </View>

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
            backgroundColor: '#081720',
            borderRadius: 18,
            padding: 6,
            borderWidth: 1,
            borderColor: '#1d2f47',
            marginBottom: 16,
            overflow: 'hidden',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.2,
            shadowRadius: 10,
            elevation: 4
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
              borderColor: '#4ac7f2'
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
              borderColor: '#4ac7f2'
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
            setSkipOnboarding={setSkipOnboarding}
          />
        )}
      </View>
    </SafeAreaView>
  );
}