import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList, TextInput, Alert } from 'react-native';
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';

export default function App() {
  const [hasPermission, setHasPermission] = useState(null);
  const [extractedData, setExtractedData] = useState([]);
  const [limit, setLimit] = useState('3000');

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      // ဒီနေရာမှာ ပုံထဲက ဂဏန်းတွေကို ခွဲထုတ်ပေးမယ့် Logic ပါဝင်မှာဖြစ်ပါတယ်
      processImage();
    }
  };

  const processImage = () => {
    // စမ်းသပ်ရန်အတွက် နမူနာစာရင်းများ (OCR ထည့်သွင်းပြီးပါက အလိုအလျောက်ပြောင်းလဲပါမည်)
    const dummyData = [
      { id: '1', number: '123', amount: 5000 },
      { id: '2', number: '456', amount: 2000 },
      { id: '3', number: '789', amount: 8000 },
    ];
    setExtractedData(dummyData);
  };

  const renderItem = ({ item }) => {
    const isOverLimit = item.amount > parseInt(limit);
    return (
      <View style={[styles.itemRow, isOverLimit ? styles.overLimit : styles.underLimit]}>
        <Text style={styles.cell}>{item.number}</Text>
        <Text style={styles.cell}>{item.amount}</Text>
        <Text style={styles.cell}>{item.amount / 100}R</Text>
        <Text style={styles.cell}>{isOverLimit ? 'ဒိုင်တင်' : 'ကိုယ်ယူ'}</Text>
      </View>
    );
  };

  if (hasPermission === null) return <View />;
  if (hasPermission === false) return <Text style={{ marginTop: 50, textAlign: 'center' }}>Camera access denied</Text>;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Money Splitter App</Text>
      
      <View style={styles.limitContainer}>
        <Text style={styles.limitText}>Limit (ကိုယ်ယူမည့်ပမာဏ): </Text>
        <TextInput 
          style={styles.input}
          keyboardType="numeric"
          value={limit}
          onChangeText={setLimit}
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={pickImage}>
        <Text style={styles.buttonText}>စာရင်းကို ဓာတ်ပုံရိုက်မည်</Text>
      </TouchableOpacity>

      <View style={styles.headerRow}>
        <Text style={styles.headerCell}>ဂဏန်း</Text>
        <Text style={styles.headerCell}>ပမာဏ</Text>
        <Text style={styles.headerCell}>R ဖိုး</Text>
        <Text style={styles.headerCell}>အခြေအနေ</Text>
      </View>

      <FlatList
        data={extractedData}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 60, paddingHorizontal: 15, backgroundColor: '#F5F5F5' },
  title: { fontSize: 26, fontWeight: 'bold', textAlign: 'center', marginBottom: 25, color: '#333' },
  limitContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 20, justifyContent: 'center', backgroundColor: '#fff', padding: 10, borderRadius: 8 },
  limitText: { fontSize: 16, color: '#555' },
  input: { borderBottomWidth: 2, borderBottomColor: '#007AFF', width: 100, textAlign: 'center', fontSize: 20, fontWeight: 'bold' },
  button: { backgroundColor: '#007AFF', paddingVertical: 15, borderRadius: 12, alignItems: 'center', marginBottom: 20, elevation: 3 },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  headerRow: { flexDirection: 'row', backgroundColor: '#333', padding: 12, borderRadius: 8, marginBottom: 5 },
  headerCell: { flex: 1, fontWeight: 'bold', textAlign: 'center', color: '#fff' },
  itemRow: { flexDirection: 'row', paddingVertical: 15, paddingHorizontal: 5, borderBottomWidth: 1, borderBottomColor: '#DDD', borderRadius: 5, marginBottom: 5 },
  cell: { flex: 1, textAlign: 'center', fontSize: 16, fontWeight: '500' },
  overLimit: { backgroundColor: '#FFCDD2' },
  underLimit: { backgroundColor: '#C8E6C9' }
});
