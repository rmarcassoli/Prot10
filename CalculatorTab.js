import React, { useRef, useState } from 'react';
import { Text, View, TextInput, TouchableOpacity, KeyboardAvoidingView, Keyboard, Platform, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './theme';

export default function CalculatorTab({
  foodName, setFoodName,
  calories, setCalories,
  protein, setProtein,
  dvPercent, setDvPercent,
  evaluateProtein, result, logToHistory
}) {
  const nameRef = useRef(null);
  const caloriesRef = useRef(null);
  const proteinRef = useRef(null);
  const dvRef = useRef(null);
  const [isEvaluationUnlocked, setIsEvaluationUnlocked] = useState(false);

  const focusNext = (nextRef) => {
    if (nextRef && nextRef.current) {
      nextRef.current.focus();
    } else {
      Keyboard.dismiss();
    }
  };

  const handleFieldChange = (setter, value) => {
    setter(value);
    setIsEvaluationUnlocked(false);
  };

  const finishEntry = () => {
    Keyboard.dismiss();
    setIsEvaluationUnlocked(true);
  };

  const renderField = ({ label, value, onChangeText, keyboardType, placeholder, inputRef, nextRef, isLast = false, optional = false }) => (
    <View>
      <Text style={styles.label}>
        {label}
        {optional && <Text style={styles.optional}>(Optional)</Text>}
      </Text>

      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <TextInput
          ref={inputRef}
          style={[styles.input, { flex: 1, marginBottom: 0 }]}
          placeholder={placeholder}
          placeholderTextColor="#475569"
          keyboardType={keyboardType}
          value={value}
          onChangeText={onChangeText}
          returnKeyType={"none"}
          blurOnSubmit={false}
          submitBehavior="blurAndSubmit"
          onSubmitEditing={Keyboard.dismiss}
        />

        <TouchableOpacity
          accessibilityRole="button"
          onPress={isLast ? finishEntry : () => focusNext(nextRef)}
          style={{
            width: 42,
            height: 42,
            marginLeft: 10,
            borderRadius: 12,
            backgroundColor: '#0b1120',
            borderWidth: 1,
            borderColor: '#1e293b',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Ionicons name={isLast ? 'checkmark' : 'chevron-forward'} size={18} color="#38bdf8" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 88 : 0}
      style={{ flex: 1 }}
    >
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 28 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <View style={{ flex: 1 }}>
          <Text style={styles.headerSubtitle}>Protein Integrity Tracker</Text>

          <View style={styles.card}>
            {renderField({
              label: 'Product Name',
              value: foodName,
              onChangeText: (value) => handleFieldChange(setFoodName, value),
              keyboardType: 'default',
              placeholder: 'e.g., Pure Whey, Fuel Bar',
              inputRef: nameRef,
              nextRef: caloriesRef,
              optional: true,
              isLast: false
            })}

            {renderField({
              label: 'Total Calories',
              value: calories,
              onChangeText: (value) => handleFieldChange(setCalories, value),
              keyboardType: 'numeric',
              placeholder: '0',
              inputRef: caloriesRef,
              nextRef: proteinRef,
              isLast: false
            })}

            {renderField({
              label: 'Protein (Grams)',
              value: protein,
              onChangeText: (value) => handleFieldChange(setProtein, value),
              keyboardType: 'numeric',
              placeholder: '0',
              inputRef: proteinRef,
              nextRef: dvRef,
              isLast: false
            })}

            {renderField({
              label: 'Protein % Daily Value (%DV)',
              value: dvPercent,
              onChangeText: (value) => handleFieldChange(setDvPercent, value),
              keyboardType: 'numeric',
              placeholder: '0',
              inputRef: dvRef,
              nextRef: null,
              optional: true,
              isLast: true
            })}

            <TouchableOpacity
              disabled={!isEvaluationUnlocked}
              onPress={evaluateProtein}
              style={[styles.button, { opacity: isEvaluationUnlocked ? 1 : 0.45 }]}
            >
              <Text style={[styles.buttonText, { color: isEvaluationUnlocked ? '#ffffff' : '#94a3b8' }]}>Evaluate Label</Text>
            </TouchableOpacity>
          </View>

          {result && (
            <View style={[styles.resultCard, { borderColor: result.color }]}>
              <Text style={[styles.resultGrade, { color: result.color }]}>{result.grade}</Text>
              <Text style={styles.resultText}>Calories from Protein: {result.ratio}%</Text>
              <Text style={styles.resultFeedback}>{result.feedback}</Text>
              <TouchableOpacity style={styles.logButton} onPress={logToHistory}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                  <Ionicons name="save-outline" size={16} color="#ffffff" style={{ marginRight: 8 }} />
                  <Text style={styles.logButtonText}>Save Item to History Log</Text>
                </View>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
