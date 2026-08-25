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

import { productionRequestsApi, rawMaterialsApi, getErrorMessage } from '../services/api';
import { colors, radius, spacing } from '../theme';
import type { ProductionRequestPayload, RawMaterial, RootStackParamList } from '../types';
import { PRODUCTION_LINES, MATERIAL_TYPE_LABELS } from '../types';

type Nav = NativeStackNavigationProp<RootStackParamList, 'ProductionRequestScreen'>;

interface MaterialItem {
  materialId: string;
  quantityKg: string;
}

export default function ProductionRequestScreen() {
  const navigation = useNavigation<Nav>();
  const insets = useSafeAreaInsets();

  const [materials, setMaterials] = useState<RawMaterial[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  const [orderCode, setOrderCode] = useState('');
  const [selectedLine, setSelectedLine] = useState('');
  const [targetProduct, setTargetProduct] = useState('');
  const [materialItems, setMaterialItems] = useState<MaterialItem[]>([
    { materialId: '', quantityKg: '' },
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    rawMaterialsApi.getAll()
      .then(setMaterials)
      .catch(() => {})
      .finally(() => setIsLoadingData(false));
  }, []);

  const addMaterialItem = () => {
    setMaterialItems((prev) => [...prev, { materialId: '', quantityKg: '' }]);
  };

  const removeMaterialItem = (index: number) => {
    if (materialItems.length <= 1) return;
    setMaterialItems((prev) => prev.filter((_, i) => i !== index));
  };

  const updateMaterialItem = (index: number, field: keyof MaterialItem, value: string) => {
    setMaterialItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)),
    );
  };

  const handleSubmit = async () => {
    setError(null);

    if (!orderCode.trim()) {
      setError('Ingresa el código de orden de producción.');
      return;
    }
    if (!selectedLine) {
      setError('Selecciona la línea de producción.');
      return;
    }
    if (!targetProduct.trim()) {
      setError('Ingresa el producto objetivo.');
      return;
    }

    const validMaterials = materialItems
      .filter((item) => item.materialId && item.quantityKg)
      .map((item) => ({
        materialId: item.materialId,
        quantityKg: parseFloat(item.quantityKg),
      }));

    if (validMaterials.length === 0) {
      setError('Agrega al menos un material con cantidad.');
      return;
    }

    const hasInvalid = validMaterials.some((m) => isNaN(m.quantityKg) || m.quantityKg <= 0);
    if (hasInvalid) {
      setError('Verifica que todas las cantidades sean válidas.');
      return;
    }

    setIsSubmitting(true);
    try {
      await productionRequestsApi.create({
        orderCode: orderCode.trim(),
        line: selectedLine,
        targetProduct: targetProduct.trim(),
        requiredMaterials: validMaterials,
      });
      Alert.alert(
        'Solicitud enviada',
        'La solicitud de materia prima se creó correctamente.',
        [{ text: 'OK', onPress: () => navigation.goBack() }],
      );
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingData) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Cargando materiales...</Text>
      </View>
    );
  }

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

          <Text style={styles.label}>Código de orden</Text>
          <TextInput
            style={styles.input}
            placeholder="OP-2026-440"
            placeholderTextColor={colors.textMuted}
            value={orderCode}
            onChangeText={setOrderCode}
            autoCapitalize="characters"
            editable={!isSubmitting}
          />

          <Text style={styles.label}>Línea de producción</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
            {PRODUCTION_LINES.map((line) => {
              const active = selectedLine === line.value;
              return (
                <Pressable
                  key={line.value}
                  style={({ pressed }) => [
                    styles.chip,
                    active && styles.chipActive,
                    pressed && { opacity: 0.7 },
                  ]}
                  onPress={() => setSelectedLine(line.value)}
                >
                  <Text style={[styles.chipText, active && styles.chipTextActive]}>
                    {line.label}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>

          <Text style={styles.label}>Producto objetivo</Text>
          <TextInput
            style={styles.input}
            placeholder="Bolsa Biodegradable 40x50"
            placeholderTextColor={colors.textMuted}
            value={targetProduct}
            onChangeText={setTargetProduct}
            editable={!isSubmitting}
          />
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Materiales requeridos</Text>
            <Pressable
              style={({ pressed }) => [styles.addButton, pressed && { opacity: 0.7 }]}
              onPress={addMaterialItem}
            >
              <Text style={styles.addButtonText}>+ Agregar</Text>
            </Pressable>
          </View>

          {materialItems.map((item, index) => (
            <View key={index} style={styles.materialCard}>
              <View style={styles.materialHeader}>
                <Text style={styles.materialNumber}>Material {index + 1}</Text>
                {materialItems.length > 1 && (
                  <Pressable onPress={() => removeMaterialItem(index)}>
                    <Text style={styles.removeText}>Eliminar</Text>
                  </Pressable>
                )}
              </View>

              <Text style={styles.label}>Materia prima</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
                {materials.map((m) => {
                  const active = item.materialId === m.id;
                  return (
                    <Pressable
                      key={m.id}
                      style={({ pressed }) => [
                        styles.chip,
                        active && styles.chipActive,
                        pressed && { opacity: 0.7 },
                      ]}
                      onPress={() => updateMaterialItem(index, 'materialId', m.id)}
                    >
                      <Text style={[styles.chipText, active && styles.chipTextActive]}>
                        {m.code}
                      </Text>
                    </Pressable>
                  );
                })}
              </ScrollView>

              <Text style={styles.label}>Cantidad (KG)</Text>
              <TextInput
                style={styles.input}
                placeholder="1200"
                placeholderTextColor={colors.textMuted}
                value={item.quantityKg}
                onChangeText={(v) => updateMaterialItem(index, 'quantityKg', v)}
                keyboardType="numeric"
                editable={!isSubmitting}
              />
            </View>
          ))}
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
            <Text style={styles.submitButtonText}>Enviar solicitud</Text>
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
  centered: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: spacing.md,
    fontSize: 13,
    color: colors.textSecondary,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: spacing.sm,
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
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  chipTextActive: {
    color: colors.background,
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
  materialCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  materialHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  materialNumber: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary,
  },
  removeText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.danger,
  },
  addButton: {
    backgroundColor: colors.surfaceLight,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: radius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
  },
  addButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
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
    backgroundColor: colors.warning,
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
