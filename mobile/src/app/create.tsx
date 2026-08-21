import { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { router } from 'expo-router';
import { apiCall } from '../services/api';

export default function CreateOrder() {
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_phone: '',
    requirement: '',
    quantity: '',
    unit: '',
    location: '',
    notes: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!formData.customer_name || !formData.customer_phone || !formData.requirement) {
      Alert.alert('Error', 'Please fill in the required fields (*)');
      return;
    }

    setLoading(true);
    try {
      await apiCall('/orders', {
        method: 'POST',
        body: JSON.stringify(formData)
      });
      Alert.alert('Success', 'Order created successfully!');
      setFormData({
        customer_name: '', customer_phone: '', requirement: '', 
        quantity: '', unit: '', location: '', notes: ''
      });
      router.push('/orders');
    } catch (e: any) {
      Alert.alert('Error', e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <Text style={styles.sectionTitle}>Customer Info</Text>
      <TextInput style={styles.input} placeholder="Customer Name *" value={formData.customer_name} onChangeText={t => setFormData({...formData, customer_name: t})} />
      <TextInput style={styles.input} placeholder="Phone Number *" keyboardType="phone-pad" value={formData.customer_phone} onChangeText={t => setFormData({...formData, customer_phone: t})} />

      <Text style={styles.sectionTitle}>Order Details</Text>
      <TextInput style={styles.input} placeholder="Requirement (e.g. Sand) *" value={formData.requirement} onChangeText={t => setFormData({...formData, requirement: t})} />
      
      <View style={{flexDirection: 'row', gap: 10}}>
        <TextInput style={[styles.input, {flex: 1}]} placeholder="Quantity" keyboardType="numeric" value={formData.quantity} onChangeText={t => setFormData({...formData, quantity: t})} />
        <TextInput style={[styles.input, {flex: 1}]} placeholder="Unit (e.g. Tractor)" value={formData.unit} onChangeText={t => setFormData({...formData, unit: t})} />
      </View>
      
      <TextInput style={styles.input} placeholder="Delivery Location" value={formData.location} onChangeText={t => setFormData({...formData, location: t})} />
      <TextInput style={[styles.input, {height: 80, textAlignVertical: 'top'}]} placeholder="Notes" multiline value={formData.notes} onChangeText={t => setFormData({...formData, notes: t})} />

      <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? 'Creating...' : 'Create Order'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc', padding: 15 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#4f46e5', marginTop: 15, marginBottom: 10 },
  input: { backgroundColor: 'white', padding: 15, borderRadius: 8, marginBottom: 12, borderWidth: 1, borderColor: '#e2e8f0' },
  button: { backgroundColor: '#4f46e5', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 20 },
  buttonText: { color: 'white', fontWeight: 'bold', fontSize: 16 }
});
