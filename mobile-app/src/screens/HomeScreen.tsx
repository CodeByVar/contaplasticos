import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { useAuth } from '../context/AuthContext';
import { colors, radius, spacing } from '../theme';
import { ROLE_LABELS, SHIFT_LABELS, type MainTabParamList } from '../types';

type Props = NativeStackScreenProps<MainTabParamList, 'Inicio'>;

const quickActions = [
  {
    id: 'stock',
    badge: 'S',
    badgeColor: colors.primary,
    title: 'Stock en Silos',
    description: 'Consulta de inventario por materia prima',
  },
  {
    id: 'entradas',
    badge: 'E',
    badgeColor: colors.success,
    title: 'Registrar Entrada',
    description: 'Registro en báscula de materia prima',
  },
  {
    id: 'solicitudes',
    badge: 'P',
    badgeColor: colors.warning,
    title: 'Solicitud de MP',
    description: 'Pedidos para extrusión / inyección',
  },
  {
    id: 'mermas',
    badge: 'M',
    badgeColor: colors.danger,
    title: 'Consumo y Merma',
    description: 'Registro de consumo desde planta',
  },
];

export default function HomeScreen({ navigation }: Props) {
  const { user } = useAuth();

  if (!user) return null;

  const firstName = user.name.split(' ')[0];
  const roleLabel = ROLE_LABELS[user.role] ?? user.role;
  const shiftLabel = SHIFT_LABELS[user.shift] ?? user.shift;

  const handlePress = (id: string) => {
    if (id === 'stock') {
      navigation.navigate('Stock');
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      <Text style={styles.greeting}>Hola, {firstName}</Text>
      <Text style={styles.subGreeting}>¿Qué vas a hacer hoy?</Text>

      <View style={styles.chipsRow}>
        <View style={[styles.chip, styles.chipPrimary]}>
          <Text style={styles.chipTextPrimary}>{roleLabel}</Text>
        </View>
        <View style={styles.chip}>
          <Text style={styles.chipText}>{shiftLabel}</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Accesos rápidos</Text>
      <View style={styles.grid}>
        {quickActions.map((action) => (
          <Pressable
            key={action.id}
            style={({ pressed }) => [
              styles.card,
              pressed && styles.cardPressed,
            ]}
            onPress={() => handlePress(action.id)}
          >
            <View
              style={[
                styles.badge,
                { backgroundColor: action.badgeColor },
              ]}
            >
              <Text style={styles.badgeText}>{action.badge}</Text>
            </View>
            <Text style={styles.cardTitle}>{action.title}</Text>
            <Text style={styles.cardDescription}>{action.description}</Text>
            {action.id !== 'stock' && (
              <Text style={styles.comingSoon}>Próximamente</Text>
            )}
          </Pressable>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.lg,
  },
  greeting: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  subGreeting: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  chipsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: radius.full,
    backgroundColor: colors.surfaceLight,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipPrimary: {
    backgroundColor: 'rgba(56, 189, 248, 0.12)',
    borderColor: colors.primary,
  },
  chipText: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '600',
  },
  chipTextPrimary: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '700',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: spacing.xl,
    marginBottom: spacing.md,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  card: {
    width: '47%',
    flexGrow: 1,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.md,
  },
  cardPressed: {
    opacity: 0.7,
  },
  badge: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  badgeText: {
    color: colors.background,
    fontSize: 18,
    fontWeight: '800',
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  cardDescription: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  comingSoon: {
    fontSize: 11,
    color: colors.warning,
    fontWeight: '600',
    marginTop: spacing.sm,
  },
});
