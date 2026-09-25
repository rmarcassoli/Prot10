import React from 'react';
import { Text, View, TextInput, TouchableOpacity } from 'react-native';
import { styles } from './theme';

export default function CalculatorTab({
  foodName, setFoodName,
  calories, setCalories,
  protein, setProtein,
  dvPercent, setDvPercent,
  evaluateProtein, result, logToHistory
}) {
  return (
    <View>
      <Text style={styles.headerSubtitle}>Protein Integrity Tracker</Text>
      <View style={styles.card}>
        <Text style={styles.label}>Product Name <Text style={styles.optional}>(Optional)</Text></Text>
        <TextInput style={styles.input} placeholder="e.g., Pure Whey, Fuel Bar" placeholderTextColor="#475569" value={foodName} onChangeText={setFoodName} />
        
        <Text style={styles.label}>Total Calories</Text>
        <TextInput style={styles.input} placeholder="0" placeholderTextColor="#475569" keyboardType="numeric" value={calories} onChangeText={setCalories} />
        
        <Text style={styles.label}>Protein (Grams)</Text>
        <TextInput style={styles.input} placeholder="0" placeholderTextColor="#475569" keyboardType="numeric" value={protein} onChangeText={setProtein} />
        
        <Text style={styles.label}>Protein % Daily Value (%DV) <Text style={styles.optional}>(Optional)</Text></Text>
        <TextInput style={styles.input} placeholder="0" placeholderTextColor="#475569" keyboardType="numeric" value={dvPercent} onChangeText={setDvPercent} />
        
        <TouchableOpacity style={styles.button} onPress={evaluateProtein}>
          <Text style={styles.buttonText}>Evaluate Label</Text>
        </TouchableOpacity>
      </View>
      
      {result && (
        <View style={[styles.resultCard, { borderColor: result.color }]}>
          <Text style={[styles.resultGrade, { color: result.color }]}>{result.grade}</Text>
          <Text style={styles.resultText}>Calories from Protein: {result.ratio}%</Text>
          <Text style={styles.resultFeedback}>{result.feedback}</Text>
          <TouchableOpacity style={styles.logButton} onPress={logToHistory}>
            <Text style={styles.logButtonText}>💾 Save Item to History Log</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
