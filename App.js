import React, { useState, useEffect } from 'react';
import { Text, View, TouchableOpacity, SafeAreaView, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
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
            onPress={() => {
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
        <Text style={styles.headerTitle}>Prot10</Text>

        <View
          style={{
            flexDirection: 'row',
            backgroundColor: '#101827',
            borderRadius: 18,
            padding: 6,
            borderWidth: 1,
            borderColor: '#1e293b',
            marginBottom: 16,
            overflow: 'hidden'
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
              backgroundColor: activeTab === 'calculator' ? '#2563eb' : 'transparent'
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
              backgroundColor: activeTab === 'history' ? '#2563eb' : 'transparent'
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