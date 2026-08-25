import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { scrapApi, getErrorMessage } from '../services/api';
import { colors, radius, spacing } from '../theme';
import type { RootStackParamList, ScrapCause } from '../types';
import { SCRAP_CAUSE_LABELS } from '../types';

type Nav = NativeStackNavigationProp<RootStackParamList, 'ScrapScreen'>;

const SCRAP_CAUSES: ScrapCause[] = [
  'ARRANQUE_MAQUINA',
  'CAMBIO_COLOR',
  'ATASCO',
  'DESCALIBRACION',
];

export default function ScrapScreen() {
  const navigation = useNavigation<Nav>();
  const insets = useSafeAreaInsets();

  const [productionOrderId, setProductionOrderId] = useState('');
  const [consumedKg, setConsumedKg] = useState('');
  const [producedGoodKg, setProducedGoodKg] = useState('');
  const [scrapRecoverableKg, setScrapRecoverableKg] = useState('');
  const [scrapDiscardKg, setScrapDiscardKg] = useState('');
  const [selectedCause, setSelectedCause] = useState<ScrapCause | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const consumed = parseFloat(consumedKg) || 0;
  const produced = parseFloat(producedGoodKg) || 0;
  const recoverable = parseFloat(scrapRecoverableKg) || 0;
  const discard = parseFloat(scrapDiscardKg) || 0;
  const totalScrap = recoverable + discard;
  const efficiency = consumed > 0 ? ((produced / consumed) * 100).toFixed(1) : '0.0';

  const handleSubmit = async () => {
    setError(null);

    if (!productionOrderId.trim()) {
      setError('Ingresa el ID de la orden de producción.');
      return;
    }
    const c = parseFloat(consumedKg);
    if (isNaN(c) || c <= 0) {
      setError('Ingresa la cantidad consumida en KG.');
      return;
    }
    const p = parseFloat(producedGoodKg);
    if (isNaN(p) || p < 0) {
      setError('Ingresa la cantidad producida en KG.');
      return;
    }
    const rec = parseFloat(scrapRecoverableKg) || 0;
    const dis = parseFloat(scrapDiscardKg) || 0;
    if (rec < 0 || dis < 0) {
      setError('Las cantidades de merma no pueden ser negativas.');
      return;
    }
    if (!selectedCause) {
      setError('Selecciona la causa de la merma.');
      return;
    }

    setIsSubmitting(true);
    try {
      await scrapApi.create({
        productionOrderId: productionOrderId.trim(),
        consumedRawMaterialKg: c,
        producedGoodKg: p,
        scrapRecoverableKg: rec,
        scrapDiscardKg: dis,
        cause: selectedCause,
      });
      Alert.alert(
        'Registro exitoso',
        'El consumo y merma se registraron correctamente.',
        [{ text: 'OK', onPress: () => navigation.goBack() }],
      );
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + spacing.xl },
        ]}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Orden de Producción</Text>
          <Text style={styles.label}>ID de la orden</Text>
          <TextInput
            style={styles.input}
            placeholder="OP-2026-440"
            placeholderTextColor={colors.textMuted}
            value={productionOrderId}
            onChangeText={setProductionOrderId}
            autoCapitalize="characters"
            editable={!isSubmitting}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pesos en KG</Text>

          <Text style={styles.label}>Materia prima consumida</Text>
          <TextInput
            style={styles.input}
            placeholder="1230"
            placeholderTextColor={colors.textMuted}
            value={consumedKg}
            onChangeText={setConsumedKg}
            keyboardType="numeric"
            editable={!isSubmitting}
          />

          <Text style={styles.label}>Producto bueno producido</Text>
          <TextInput
            style={styles.input}
            placeholder="1150"
            placeholderTextColor={colors.textMuted}
            value={producedGoodKg}
            onChangeText={setProducedGoodKg}
            keyboardType="numeric"
            editable={!isSubmitting}
          />

          <Text style={styles.label}>Merma recuperable (retales para molienda)</Text>
          <TextInput
            style={styles.input}
            placeholder="60"
            placeholderTextColor={colors.textMuted}
            value={scrapRecoverableKg}
            onChangeText={setScrapRecoverableKg}
            keyboardType="numeric"
            editable={!isSubmitting}
          />

          <Text style={styles.label}>Merma descartable (purgas contaminadas)</Text>
          <TextInput
            style={styles.input}
            placeholder="20"
            placeholderTextColor={colors.textMuted}
            value={scrapDiscardKg}
            onChangeText={setScrapDiscardKg}
            keyboardType="numeric"
            editable={!isSubmitting}
          />
        </View>

        {(consumed > 0 || produced > 0) && (
          <View style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Total merma</Text>
              <Text style={styles.summaryValue}>{totalScrap.toFixed(1)} KG</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Eficiencia</Text>
              <Text
                style={[
                  styles.summaryValue,
                  {
                    color:
                      parseFloat(efficiency) >= 90
                        ? colors.success
                        : parseFloat(efficiency) >= 75
                        ? colors.warning
                        : colors.danger,
                  },
                ]}
              >
                {efficiency}%
              </Text>
            </View>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Causa de merma</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
            {SCRAP_CAUSES.map((cause) => {
              const active = selectedCause === cause;
              return (
                <Pressable
                  key={cause}
                  style={({ pressed }) => [
                    styles.chip,
                    active && styles.chipActive,
                    pressed && { opacity: 0.7 },
                  ]}
                  onPress={() => setSelectedCause(cause)}
                >
                  <Text style={[styles.chipText, active && styles.chipTextActive]}>
                    {SCRAP_CAUSE_LABELS[cause]}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        {error && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        <Pressable
          style={({ pressed }) => [
            styles.submitButton,
            pressed && styles.submitButtonPressed,
            isSubmitting && styles.submitButtonDisabled,
          ]}
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color={colors.background} />
          ) : (
            <Text style={styles.submitButtonText}>Registrar consumo y merma</Text>
          )}
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.lg,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  input: {
    backgroundColor: colors.surfaceLight,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    fontSize: 15,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  chipScroll: {
    marginBottom: spacing.sm,
  },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
    borderRadius: radius.full,
    backgroundColor: colors.surfaceLight,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: spacing.sm,
  },
  chipActive: {
    backgroundColor: colors.danger,
    borderColor: colors.danger,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  chipTextActive: {
    color: colors.background,
  },
  summaryCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  summaryLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  summaryValue: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  errorBox: {
    backgroundColor: colors.dangerSoft,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.danger,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  errorText: {
    color: colors.danger,
    fontSize: 13,
    textAlign: 'center',
  },
  submitButton: {
    backgroundColor: colors.danger,
    borderRadius: radius.md,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  submitButtonPressed: {
    opacity: 0.8,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: colors.background,
    fontSize: 16,
    fontWeight: '700',
  },
});
