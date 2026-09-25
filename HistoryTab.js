import React from 'react';
import { Text, View, TouchableOpacity, Alert } from 'react-native';
import { styles } from './theme';

export default function HistoryTab({ history, setHistory, setShowOnboarding }) {
  return (
    <View style={styles.historyContainer}>
      <View style={styles.historyHeader}>
        <Text style={styles.sectionLabel}>Saved History Log</Text>
        {history.length > 0 && (
          <TouchableOpacity onPress={() => Alert.alert("Clear", "Delete history?", [{ text: "Cancel" }, { text: "Delete", onPress: () => { setHistory([]); global.__PROT10_PERSISTED_DATABASE__ = "[]"; } }])}>
            <Text style={styles.clearHistoryText}>Clear All</Text>
          </TouchableOpacity>
        )}
      </View>

      {history.length === 0 ? (
        <Text style={{ color: '#475569', textAlign: 'center', marginTop: 40, fontSize: 16, fontWeight: '600' }}>
          No items saved yet. Use the calculator tab to evaluate food products!
        </Text>
      ) : (
        history.map((item) => (
          <View key={item.id} style={[styles.historyRow, { borderLeftColor: item.color }]}>
            <View style={styles.historyLeft}>
              <Text style={styles.historyItemTitle}>{item.title}</Text>
              <Text style={styles.historyItemSub}>{item.calories} cal  •  {item.protein}g protein</Text>
            </View>
            <View style={styles.historyRight}>
              <Text style={[styles.historyItemRatio, { color: item.color }]}>{item.ratio}%</Text>
              <Text style={styles.historyMiniBadge}>Prot Cal</Text>
            </View>
          </View>
        ))
      )}

      <TouchableOpacity style={[styles.debugButton, { marginTop: 60 }]} onPress={() => setShowOnboarding(true)}>
        <Text style={styles.debugButtonText}>🔄 Preview Onboarding Slides Again</Text>
      </TouchableOpacity>
    </View>
  );
}
