import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { AuthProvider } from '@/hooks/useAuth';
import { OperationsProvider } from '@/hooks/useOperations';
import { InventoryProvider } from '@/hooks/useInventory';
import { RequestQueueProvider } from '@/hooks/useRequestQueue';

export default function RootLayout() {
  useFrameworkReady();

  return (
    <AuthProvider>
      <OperationsProvider>
        <InventoryProvider>
          <RequestQueueProvider>
            <>
              <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen name="+not-found" />
              </Stack>
              <StatusBar style="auto" />
            </>
          </RequestQueueProvider>
        </InventoryProvider>
      </OperationsProvider>
    </AuthProvider>
  );
}