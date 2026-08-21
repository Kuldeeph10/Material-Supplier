import { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { apiCall } from '../services/api';

export default function Orders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchOrders = async () => {
    try {
      const data = await apiCall('/orders');
      setOrders(data || []);
    } catch (e: any) {
      console.log(e);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchOrders();
    }, [])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchOrders();
    setRefreshing(false);
  };

  const handleStatusUpdate = async (id: any, status: any) => {
    try {
      await apiCall(`/orders/${id}/update`, {
        method: 'PATCH',
        body: JSON.stringify({ status })
      });
      fetchOrders();
    } catch (e: any) {
      alert("Failed to update");
    }
  };

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.orderCard}>
      <View style={styles.orderHeader}>
        <Text style={styles.orderId}>#{item.id}</Text>
        <Text style={[styles.status, item.status === 'PENDING' ? styles.statusPending : styles.statusCompleted]}>
          {item.status}
        </Text>
      </View>
      
      <Text style={styles.customerName}>{item.customer_name}</Text>
      <Text style={styles.customerPhone}>{item.customer_phone}</Text>
      
      <View style={styles.divider} />
      
      <Text style={styles.requirement}>{item.requirement} {item.quantity ? `(${item.quantity} ${item.unit})` : ''}</Text>
      {item.location ? <Text style={styles.location}>📍 {item.location}</Text> : null}
      {item.notes ? <Text style={styles.notes}>📝 {item.notes}</Text> : null}

      {item.status === 'PENDING' && (
        <View style={styles.actions}>
          <TouchableOpacity style={[styles.btn, styles.btnComplete]} onPress={() => handleStatusUpdate(item.id, 'COMPLETED')}>
            <Text style={styles.btnTextComplete}>Mark Complete</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList 
        data={orders}
        keyExtractor={item => item.id.toString()}
        renderItem={renderItem}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc', padding: 15 },
  orderCard: { backgroundColor: 'white', padding: 15, borderRadius: 10, marginBottom: 15, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5, elevation: 2 },
  orderHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  orderId: { fontWeight: 'bold', color: '#64748b' },
  customerName: { fontSize: 18, fontWeight: 'bold', color: '#0f172a' },
  customerPhone: { color: '#64748b', marginBottom: 10 },
  divider: { height: 1, backgroundColor: '#e2e8f0', marginVertical: 10 },
  requirement: { fontSize: 16, fontWeight: '500', marginBottom: 5 },
  location: { color: '#64748b', fontSize: 13, marginBottom: 2 },
  notes: { color: '#64748b', fontSize: 13, fontStyle: 'italic', marginBottom: 10 },
  actions: { flexDirection: 'row', marginTop: 15 },
  btn: { padding: 10, borderRadius: 8, alignItems: 'center', flex: 1 },
  btnComplete: { backgroundColor: '#d1fae5', borderWidth: 1, borderColor: '#10b981' },
  btnTextComplete: { color: '#059669', fontWeight: 'bold' },
  status: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, fontSize: 12, fontWeight: 'bold', overflow: 'hidden' },
  statusPending: { backgroundColor: '#fef3c7', color: '#d97706' },
  statusCompleted: { backgroundColor: '#d1fae5', color: '#059669' }
});
