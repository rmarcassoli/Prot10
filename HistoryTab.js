import React, { useState } from 'react';
import { Text, View, TouchableOpacity, Alert } from 'react-native';
import { styles } from './theme';

const VectorTrashIcon = () => (
  <View style={{ width: 24, height: 24, justifyContent: 'center', alignItems: 'center' }}>
    <View style={{ width: 18, height: 2, backgroundColor: '#ffffff', borderRadius: 1, marginBottom: 2 }} />
    <View style={{ position: 'absolute', top: 1, width: 6, height: 2, backgroundColor: '#ffffff', borderRadius: 1 }} />
    <View style={{ width: 14, height: 16, borderBottomLeftRadius: 3, borderBottomRightRadius: 3, borderWidth: 2, borderColor: '#ffffff', borderTopWidth: 0, paddingHorizontal: 2, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'stretch', paddingTop: 2, paddingBottom: 1 }}>
      <View style={{ width: 2, backgroundColor: '#ffffff', opacity: 0.6, borderRadius: 1 }} />
      <View style={{ width: 2, backgroundColor: '#ffffff', opacity: 0.6, borderRadius: 1 }} />
    </View>
  </View>
);

export default function HistoryTab({ history, setHistory, setShowOnboarding, setCurrentSlide }) {
  const [swipedItemId, setSwipedItemId] = useState(null);
  const [touchStartX, setTouchStartX] = useState(0);

  const handleTouchStart = (e) => {
    setTouchStartX(e.nativeEvent.pageX);
  };

  const handleTouchEnd = (e, itemId) => {
    const touchEndX = e.nativeEvent.pageX;
    const swipeDistance = touchStartX - touchEndX;

    if (swipeDistance > 40) {
      setSwipedItemId(itemId);
    } else if (swipeDistance < -40) {
      setSwipedItemId(null);
    }
  };

  const deleteItem = (id, title) => {
    Alert.alert(
      "Delete Item",
      `Are you sure you want to remove "${title}" from your history?`,
      [
        { text: "Cancel", style: "cancel", onPress: () => setSwipedItemId(null) },
        { 
          text: "Delete", 
          style: "destructive", 
          onPress: () => {
            const updatedHistory = history.filter(item => item.id !== id);
            setHistory(updatedHistory);
            global.__PROT10_PERSISTED_DATABASE__ = JSON.stringify(updatedHistory);
            setSwipedItemId(null);
          } 
        }
      ]
    );
  };

  const startPreview = () => {
    setCurrentSlide(0);
    setShowOnboarding(true);
  };

  return (
    <View style={styles.historyContainer}>
      <View style={styles.historyHeader}>
        <Text style={styles.sectionLabel}>Saved History Log</Text>
        {history.length > 0 && (
          <TouchableOpacity onPress={() => Alert.alert("Clear All", "Delete entire history?", [{ text: "Cancel" }, { text: "Delete All", onPress: () => { setHistory([]); global.__PROT10_PERSISTED_DATABASE__ = "[]"; } }])}>
            <Text style={styles.clearHistoryText}>Clear All</Text>
          </TouchableOpacity>
        )}
      </View>

      {history.length === 0 ? (
        <Text style={{ color: '#475569', textAlign: 'center', marginTop: 40, fontSize: 16, fontWeight: '600' }}>
          No items saved yet. Use the calculator tab to evaluate food products!
        </Text>
      ) : (
        history.map((item) => {
          const isOpened = swipedItemId === item.id;

          return (
            <View 
              key={item.id} 
              style={{ marginBottom: 12, height: 80, backgroundColor: '#f43f5e', borderRadius: 14, overflow: 'hidden', flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'stretch', borderWidth: 1, borderColor: '#1e293b' }}
              onStartShouldSetResponder={() => true}
              onResponderGrant={handleTouchStart}
              onResponderRelease={(e) => handleTouchEnd(e, item.id)}
            >
              <View style={[
                styles.historyRow, 
                { 
                  borderLeftColor: item.color, 
                  position: 'absolute', 
                  top: 0, 
                  left: isOpened ? -80 : 0, 
                  right: isOpened ? 80 : 0, 
                  bottom: 0, 
                  marginBottom: 0, 
                  borderRadius: 0, 
                  borderWidth: 0,
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingHorizontal: 16,
                  backgroundColor: '#131c2e',
                  zIndex: 2
                }
              ]}>
                <View style={styles.historyLeft}>
                  <Text style={styles.historyItemTitle} numberOfLines={1}>{item.title}</Text>
                  <Text style={styles.historyItemSub}>{item.calories} cal  •  {item.protein}g protein</Text>
                </View>
                <View style={styles.historyRight}>
                  <Text style={[styles.historyItemRatio, { color: item.color }]}>{item.ratio}%</Text>
                  <Text style={styles.historyMiniBadge}>Prot Cal</Text>
                </View>
              </View>

              <TouchableOpacity 
                onPress={() => deleteItem(item.id, item.title)}
                style={{ width: 80, justifyContent: 'center', alignItems: 'center', zIndex: 1 }}
              >
                <VectorTrashIcon />
              </TouchableOpacity>
            </View>
          );
        })
      )}

      <TouchableOpacity style={[styles.debugButton, { marginTop: 40 }]} onPress={startPreview}>
        <Text style={styles.debugButtonText}>🔄 Preview Onboarding Slides Again</Text>
      </TouchableOpacity>
    </View>
  );
}



