import { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { apiCall } from '../services/api';

export default function Dashboard() {
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

  const todayStr = new Date().toISOString().split('T')[0];
  const todaysOrders = orders.filter((o: any) => o.created_at.startsWith(todayStr));
  const pendingOrders = orders.filter((o: any) => o.status === 'PENDING');
  const completedToday = todaysOrders.filter((o: any) => o.status === 'COMPLETED');

  return (
    <ScrollView style={styles.container} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
      <Text style={styles.header}>Overview</Text>
      
      <View style={styles.cardContainer}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Today's Orders</Text>
          <Text style={styles.cardNumber}>{todaysOrders.length}</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Pending</Text>
          <Text style={[styles.cardNumber, { color: '#f59e0b' }]}>{pendingOrders.length}</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Completed</Text>
          <Text style={[styles.cardNumber, { color: '#10b981' }]}>{completedToday.length}</Text>
        </View>
      </View>

      <Text style={styles.header}>Recent Orders</Text>
      {orders.slice(0, 5).map((order: any) => (
        <View key={order.id} style={styles.orderItem}>
          <View style={{flex: 1}}>
            <Text style={styles.orderCustomer}>{order.customer_name}</Text>
            <Text style={styles.orderReq}>{order.requirement} {order.quantity ? `(${order.quantity} ${order.unit})` : ''}</Text>
          </View>
          <View>
            <Text style={[styles.status, order.status === 'PENDING' ? styles.statusPending : styles.statusCompleted]}>
              {order.status}
            </Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc', padding: 15 },
  header: { fontSize: 20, fontWeight: 'bold', marginVertical: 15, color: '#0f172a' },
  cardContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  card: { backgroundColor: 'white', padding: 15, borderRadius: 10, width: '48%', marginBottom: 15, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5, elevation: 2 },
  cardTitle: { color: '#64748b', fontSize: 14, marginBottom: 10 },
  cardNumber: { fontSize: 28, fontWeight: 'bold', color: '#0f172a' },
  orderItem: { flexDirection: 'row', backgroundColor: 'white', padding: 15, borderRadius: 10, marginBottom: 10, alignItems: 'center' },
  orderCustomer: { fontWeight: 'bold', fontSize: 16, marginBottom: 4 },
  orderReq: { color: '#64748b' },
  status: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, fontSize: 12, fontWeight: 'bold', overflow: 'hidden' },
  statusPending: { backgroundColor: '#fef3c7', color: '#d97706' },
  statusCompleted: { backgroundColor: '#d1fae5', color: '#059669' }
});
