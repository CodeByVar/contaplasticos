import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing } from '../theme';

export default function AlertsScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.placeholderCard}>
        <View style={[styles.badge, { backgroundColor: colors.danger }]}>
          <Text style={styles.badgeText}>A</Text>
        </View>
        <Text style={styles.title}>Alertas de Stock Crítico</Text>
        <Text style={styles.description}>
          Notificaciones cuando una materia prima baje de su stock mínimo,
          con niveles de severidad WARNING y CRITICAL.
        </Text>
        <Text style={styles.endpoint}>Endpoint: GET /api/alerts</Text>
        <Text style={styles.soon}>Disponible en Semana 2 del plan</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.lg,
    justifyContent: 'center',
  },
  placeholderCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.xl,
    alignItems: 'center',
  },
  badge: {
    width: 56,
    height: 56,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  badgeText: {
    color: colors.background,
    fontSize: 24,
    fontWeight: '800',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
    textAlign: 'center',
  },
  description: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.sm,
    lineHeight: 20,
  },
  endpoint: {
    fontSize: 12,
    color: colors.primary,
    marginTop: spacing.md,
  },
  soon: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.warning,
    marginTop: spacing.md,
  },
});
