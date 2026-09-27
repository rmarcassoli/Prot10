import React, { useRef, useState } from 'react';
import { Text, View, TextInput, TouchableOpacity, KeyboardAvoidingView, Keyboard, Platform, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
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

  const focusNext = async (nextRef) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
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

  const finishEntry = async () => {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
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
          selectionColor="#7dd3fc"
        />

        <TouchableOpacity
          accessibilityRole="button"
          onPress={isLast ? finishEntry : () => focusNext(nextRef)}
          activeOpacity={0.9}
          style={{
            width: 42,
            height: 42,
            marginLeft: 10,
            borderRadius: 12,
            backgroundColor: '#0a1220',
            borderWidth: 1,
            borderColor: '#2b3d5d',
            alignItems: 'center',
            justifyContent: 'center',
            shadowColor: '#38bdf8',
            shadowOffset: { width: 0, height: 3 },
            shadowOpacity: 0.10,
            shadowRadius: 6,
            elevation: 2
          }}
        >
          <Ionicons name={isLast ? 'checkmark' : 'chevron-forward'} size={18} color="#7dd3fc" />
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
          <Text style={styles.headerSubtitle}>Protein Quality Checker</Text>

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
              onPress={async () => {
                if (isEvaluationUnlocked) {
                  await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                  evaluateProtein();
                }
              }}
              style={[styles.button, { opacity: isEvaluationUnlocked ? 1 : 0.45, flexDirection: 'row', justifyContent: 'center', gap: 8 }]}
            >
              <Ionicons name="sparkles" size={16} color={isEvaluationUnlocked ? '#ffffff' : '#94a3b8'} />
              <Text style={[styles.buttonText, { color: isEvaluationUnlocked ? '#ffffff' : '#94a3b8' }]}>Evaluate Label</Text>
            </TouchableOpacity>
          </View>

          {/* Result modal handled in App.js */}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
