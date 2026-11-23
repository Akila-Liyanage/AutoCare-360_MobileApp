import React, { useMemo, useRef, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  GARAGE_VEHICLE_RECORDS,
  GarageVehicleRecord,
} from './GarageVehicleRecordsScreen';
import { formatLkr, parseCostAmount } from './AddMaintenanceStep2Screen';

export type QuotationLineItem = {
  id: string;
  description: string;
  quantity: string;
  unitPrice: string;
};

export type QuotationFormData = {
  vehicleId: string;
  vehicleLabel: string;
  owner: string;
  contact: string;
  quotationNumber: string;
  date: string;
  validUntil: string;
  serviceType: string;
  items: QuotationLineItem[];
  tax: string;
  discount: string;
  notes: string;
};

export type PreparedQuotation = QuotationFormData & {
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  total: number;
  preparedAt: string;
};

export interface GenerateQuotationScreenProps {
  selectedVehicle?: GarageVehicleRecord | null;
  initialDraft?: QuotationFormData | null;
  onBackPress?: (currentDraft: QuotationFormData) => void;
  onNotificationsPress?: () => void;
  onMenuPress?: () => void;
  onSaveDraftPress?: (draft: QuotationFormData) => void;
  onGenerateQuotationPress?: (prepared: PreparedQuotation) => void;
  onGaragePress?: () => void;
  onVehiclesPress?: () => void;
  onJobsPress?: () => void;
  onBillingPress?: () => void;
}

type FieldErrors = Partial<
  Record<
    | 'vehicleLabel'
    | 'owner'
    | 'quotationNumber'
    | 'date'
    | 'validUntil'
    | 'serviceType'
    | 'itemsGeneral'
    | 'tax'
    | 'discount',
    string
  >
>;

type LineItemErrors = Record<
  string,
  {
    description?: string;
    quantity?: string;
    unitPrice?: string;
  }
>;

const OWNER_CONTACTS: Record<string, string> = {
  'veh-wp-abc-1234': '077 123 4567',
  'veh-wp-cbd-5521': '077 458 9210',
  'veh-wp-cde-9080': '071 892 3401',
};

const SERVICE_TYPE_OPTIONS: string[] = [
  'Periodic engine service',
  'Engine Oil & Filter Swap',
  'Brake System Inspection & Service',
  'Dual Clutch Fluid Replacement',
  'Full Hybrid Diagnostic Scan',
];

const INITIAL_LINE_ITEMS: QuotationLineItem[] = [
  {
    id: 'quote-item-1',
    description: 'Engine oil & filter replacement',
    quantity: '1',
    unitPrice: 'LKR 24,500',
  },
  {
    id: 'quote-item-2',
    description: 'Air filter replacement',
    quantity: '1',
    unitPrice: 'LKR 8,900',
  },
  {
    id: 'quote-item-3',
    description: 'Brake inspection & cleaning',
    quantity: '1',
    unitPrice: 'LKR 6,500',
  },
];

const DEFAULT_NOTES =
  'Includes labour and listed replacement parts. Additional work will require owner approval.';

function formatVehicleLabel(vehicle: GarageVehicleRecord): string {
  return `${vehicle.registration} · ${vehicle.model}`;
}

function parsePositiveQuantity(raw: string): number | null {
  const trimmed = raw.trim();
  if (!trimmed || !/^\d+(\.\d+)?$/.test(trimmed)) {
    return null;
  }
  const value = Number(trimmed);
  if (!Number.isFinite(value) || value <= 0) {
    return null;
  }
  return value;
}

export const GenerateQuotationScreen: React.FC<
  GenerateQuotationScreenProps
> = ({
  selectedVehicle,
  initialDraft,
  onBackPress,
  onNotificationsPress,
  onMenuPress,
  onSaveDraftPress,
  onGenerateQuotationPress,
  onGaragePress,
  onVehiclesPress,
  onJobsPress,
  onBillingPress,
}) => {
  const defaultVehicle = selectedVehicle ?? GARAGE_VEHICLE_RECORDS[0];
  const nextItemCounter = useRef<number>(
    (initialDraft?.items.length ?? INITIAL_LINE_ITEMS.length) + 1
  );

  const [vehicleId, setVehicleId] = useState<string>(
    initialDraft?.vehicleId ?? defaultVehicle.id
  );
  const [vehicleLabel, setVehicleLabel] = useState<string>(
    initialDraft?.vehicleLabel ?? formatVehicleLabel(defaultVehicle)
  );
  const [owner, setOwner] = useState<string>(
    initialDraft?.owner ?? defaultVehicle.owner
  );
  const [contact, setContact] = useState<string>(
    initialDraft?.contact ?? OWNER_CONTACTS[defaultVehicle.id] ?? '077 123 4567'
  );

  const [quotationNumber, setQuotationNumber] = useState<string>(
    initialDraft?.quotationNumber ?? 'QT-2026-091'
  );
  const [date, setDate] = useState<string>(initialDraft?.date ?? '23 Sep 2026');
  const [validUntil, setValidUntil] = useState<string>(
    initialDraft?.validUntil ?? '30 Sep 2026'
  );
  const [serviceType, setServiceType] = useState<string>(
    initialDraft?.serviceType ?? 'Periodic engine service'
  );

  const [items, setItems] = useState<QuotationLineItem[]>(
    initialDraft?.items && initialDraft.items.length > 0
      ? initialDraft.items
      : INITIAL_LINE_ITEMS
  );

  const [tax, setTax] = useState<string>(initialDraft?.tax ?? 'LKR 0');
  const [discount, setDiscount] = useState<string>(
    initialDraft?.discount ?? 'LKR 0'
  );
  const [notes, setNotes] = useState<string>(
    initialDraft?.notes ?? DEFAULT_NOTES
  );

  const [openDropdown, setOpenDropdown] = useState<
    'vehicle' | 'serviceType' | null
  >(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [itemErrors, setItemErrors] = useState<LineItemErrors>({});
  const [draftSaved, setDraftSaved] = useState<boolean>(false);
  const [preparedNotice, setPreparedNotice] = useState<boolean>(false);

  const totals = useMemo(() => {
    let subtotal = 0;
    let validItemCount = 0;

    items.forEach((item) => {
      const qty = parsePositiveQuantity(item.quantity);
      const unit = parseCostAmount(item.unitPrice);
      if (qty !== null && unit !== null) {
        subtotal += qty * unit;
        if (item.description.trim()) {
          validItemCount += 1;
        }
      }
    });

    const taxParsed = parseCostAmount(tax);
    const discountParsed = parseCostAmount(discount);
    const taxAmount = taxParsed ?? 0;
    const discountAmount = discountParsed ?? 0;
    const total = Math.max(0, subtotal + taxAmount - discountAmount);

    return {
      subtotal,
      taxParsed,
      discountParsed,
      taxAmount,
      discountAmount,
      total,
      validItemCount,
    };
  }, [items, tax, discount]);

  const clearFieldError = (key: keyof FieldErrors) => {
    setFieldErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const clearItemFieldError = (
    itemId: string,
    key: 'description' | 'quantity' | 'unitPrice'
  ) => {
    setItemErrors((prev) => {
      const row = prev[itemId];
      if (!row || !row[key]) return prev;
      const nextRow = { ...row };
      delete nextRow[key];
      const next = { ...prev };
      if (Object.keys(nextRow).length === 0) {
        delete next[itemId];
      } else {
        next[itemId] = nextRow;
      }
      return next;
    });
  };

  const buildFormData = (): QuotationFormData => ({
    vehicleId,
    vehicleLabel: vehicleLabel.trim(),
    owner: owner.trim(),
    contact: contact.trim(),
    quotationNumber: quotationNumber.trim(),
    date: date.trim(),
    validUntil: validUntil.trim(),
    serviceType: serviceType.trim(),
    items,
    tax: tax.trim(),
    discount: discount.trim(),
    notes,
  });

  const handleSelectVehicle = (record: GarageVehicleRecord) => {
    setVehicleId(record.id);
    setVehicleLabel(formatVehicleLabel(record));
    setOwner(record.owner);
    setContact(OWNER_CONTACTS[record.id] ?? '077 123 4567');
    setOpenDropdown(null);
    setDraftSaved(false);
    setPreparedNotice(false);
    clearFieldError('vehicleLabel');
    clearFieldError('owner');
  };

  const handleSelectServiceType = (option: string) => {
    setServiceType(option);
    setOpenDropdown(null);
    setDraftSaved(false);
    setPreparedNotice(false);
    clearFieldError('serviceType');
  };

  const handleUpdateItem = (
    itemId: string,
    field: 'description' | 'quantity' | 'unitPrice',
    value: string
  ) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, [field]: value } : item
      )
    );
    setDraftSaved(false);
    setPreparedNotice(false);
    clearItemFieldError(itemId, field);
    clearFieldError('itemsGeneral');
  };

  const handleAddItem = () => {
    const newId = `quote-item-${nextItemCounter.current}`;
    nextItemCounter.current += 1;
    setItems((prev) => [
      ...prev,
      {
        id: newId,
        description: '',
        quantity: '1',
        unitPrice: '',
      },
    ]);
    setDraftSaved(false);
    setPreparedNotice(false);
    clearFieldError('itemsGeneral');
  };

  const handleRemoveItem = (itemId: string) => {
    setItems((prev) => {
      if (prev.length <= 1) return prev;
      return prev.filter((item) => item.id !== itemId);
    });
    setItemErrors((prev) => {
      if (!prev[itemId]) return prev;
      const next = { ...prev };
      delete next[itemId];
      return next;
    });
    setDraftSaved(false);
    setPreparedNotice(false);
  };

  const handleTaxChange = (value: string) => {
    setTax(value);
    setDraftSaved(false);
    setPreparedNotice(false);
    if (value.trim() && parseCostAmount(value) === null) {
      setFieldErrors((prev) => ({
        ...prev,
        tax: 'Enter a valid non-negative tax amount (e.g. LKR 0).',
      }));
    } else {
      clearFieldError('tax');
    }
  };

  const handleDiscountChange = (value: string) => {
    setDiscount(value);
    setDraftSaved(false);
    setPreparedNotice(false);
    if (value.trim() && parseCostAmount(value) === null) {
      setFieldErrors((prev) => ({
        ...prev,
        discount: 'Enter a valid non-negative discount (e.g. LKR 0).',
      }));
    } else {
      clearFieldError('discount');
    }
  };

  const validateForm = (): boolean => {
    const nextFieldErrors: FieldErrors = {};
    const nextItemErrors: LineItemErrors = {};

    if (!vehicleLabel.trim()) {
      nextFieldErrors.vehicleLabel = 'Please select a vehicle.';
    }
    if (!owner.trim()) {
      nextFieldErrors.owner = 'Owner name is required.';
    }
    if (!quotationNumber.trim()) {
      nextFieldErrors.quotationNumber = 'Quotation number is required.';
    }
    if (!date.trim()) {
      nextFieldErrors.date = 'Quotation date is required.';
    }
    if (!validUntil.trim()) {
      nextFieldErrors.validUntil = 'Valid-until date is required.';
    }
    if (!serviceType.trim()) {
      nextFieldErrors.serviceType = 'Service type is required.';
    }

    if (items.length === 0) {
      nextFieldErrors.itemsGeneral = 'Add at least one service line item.';
    } else {
      let validRows = 0;
      items.forEach((item) => {
        const rowErr: {
          description?: string;
          quantity?: string;
          unitPrice?: string;
        } = {};
        if (!item.description.trim()) {
          rowErr.description = 'Description is required.';
        }
        if (parsePositiveQuantity(item.quantity) === null) {
          rowErr.quantity = 'Qty > 0';
        }
        if (parseCostAmount(item.unitPrice) === null) {
          rowErr.unitPrice = 'Valid amount';
        }
        if (Object.keys(rowErr).length > 0) {
          nextItemErrors[item.id] = rowErr;
        } else {
          validRows += 1;
        }
      });

      if (validRows === 0) {
        nextFieldErrors.itemsGeneral =
          'At least one complete, valid line item is required.';
      }
    }

    if (!tax.trim() || parseCostAmount(tax) === null) {
      nextFieldErrors.tax = 'Enter a valid non-negative tax amount.';
    }
    if (!discount.trim() || parseCostAmount(discount) === null) {
      nextFieldErrors.discount = 'Enter a valid non-negative discount.';
    }

    setFieldErrors(nextFieldErrors);
    setItemErrors(nextItemErrors);

    return (
      Object.keys(nextFieldErrors).length === 0 &&
      Object.keys(nextItemErrors).length === 0
    );
  };

  const handleSaveDraft = () => {
    setOpenDropdown(null);
    setDraftSaved(true);
    onSaveDraftPress?.(buildFormData());
  };

  const handleGenerateQuotation = () => {
    setOpenDropdown(null);
    if (!validateForm()) {
      setPreparedNotice(false);
      return;
    }

    const baseData = buildFormData();
    const prepared: PreparedQuotation = {
      ...baseData,
      subtotal: totals.subtotal,
      taxAmount: totals.taxAmount,
      discountAmount: totals.discountAmount,
      total: totals.total,
      preparedAt: new Date().toISOString(),
    };

    setPreparedNotice(true);
    setDraftSaved(false);
    onGenerateQuotationPress?.(prepared);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* 1. HEADER */}
      <View style={styles.headerBar}>
        <Image
          source={require('../../assets/autocare-logo.png')}
          style={styles.headerLogo}
          resizeMode="contain"
          accessible
          accessibilityLabel="AutoCare 360 Logo"
        />

        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.headerIconButton}
            onPress={() => onNotificationsPress?.()}
            activeOpacity={0.7}
            accessibilityLabel="Notifications"
          >
            <Ionicons name="notifications-outline" size={21} color="#0f172a" />
            <View style={styles.notificationDot} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.headerIconButton}
            onPress={() => onMenuPress?.()}
            activeOpacity={0.7}
            accessibilityLabel="Menu"
          >
            <Ionicons name="menu-outline" size={24} color="#0f172a" />
          </TouchableOpacity>
        </View>
      </View>

      {/* SCROLLABLE BODY */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* 2. BACK + PAGE INTRO */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => onBackPress?.(buildFormData())}
          activeOpacity={0.7}
          accessibilityLabel="Back to Garage Overview"
        >
          <Ionicons name="chevron-back" size={18} color="#0056A2" />
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>

        <View style={styles.pageIntro}>
          <Text style={styles.eyebrow}>BR3 / GARAGE SERVICE MANAGEMENT</Text>
          <Text style={styles.pageTitle}>Generate quotation</Text>
          <Text style={styles.pageSubtitle}>
            Create a service quotation and share it with the vehicle owner.
          </Text>
        </View>

        {/* 3. VEHICLE & CUSTOMER CARD */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.cardIconBox}>
              <Ionicons name="car-sport-outline" size={17} color="#0056A2" />
            </View>
            <Text style={styles.cardTitle}>Vehicle &amp; customer</Text>
          </View>

          <View style={styles.divider} />

          {/* Vehicle selector */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Vehicle</Text>
            <TouchableOpacity
              style={[
                styles.selectorBox,
                fieldErrors.vehicleLabel ? styles.inputErrorBorder : null,
              ]}
              onPress={() =>
                setOpenDropdown((prev) =>
                  prev === 'vehicle' ? null : 'vehicle'
                )
              }
              activeOpacity={0.8}
              accessibilityLabel="Select vehicle"
            >
              <Text style={styles.selectorText} numberOfLines={1}>
                {vehicleLabel}
              </Text>
              <Ionicons
                name={openDropdown === 'vehicle' ? 'chevron-up' : 'chevron-down'}
                size={18}
                color="#64748b"
              />
            </TouchableOpacity>
            {fieldErrors.vehicleLabel ? (
              <Text style={styles.errorText}>{fieldErrors.vehicleLabel}</Text>
            ) : null}

            {openDropdown === 'vehicle' ? (
              <View style={styles.dropdownMenu}>
                {GARAGE_VEHICLE_RECORDS.map((record, idx) => {
                  const label = formatVehicleLabel(record);
                  const isSelected = record.id === vehicleId;
                  return (
                    <TouchableOpacity
                      key={record.id}
                      style={[
                        styles.dropdownOption,
                        idx < GARAGE_VEHICLE_RECORDS.length - 1
                          ? styles.dropdownOptionBorder
                          : null,
                        isSelected ? styles.dropdownOptionSelected : null,
                      ]}
                      onPress={() => handleSelectVehicle(record)}
                      activeOpacity={0.75}
                    >
                      <View style={styles.dropdownOptionTextCol}>
                        <Text
                          style={[
                            styles.dropdownOptionText,
                            isSelected ? styles.dropdownOptionTextSelected : null,
                          ]}
                        >
                          {label}
                        </Text>
                        <Text style={styles.dropdownOptionSubtext}>
                          {record.owner} ·{' '}
                          {OWNER_CONTACTS[record.id] ?? '077 123 4567'}
                        </Text>
                      </View>
                      {isSelected ? (
                        <Ionicons name="checkmark" size={17} color="#0056A2" />
                      ) : null}
                    </TouchableOpacity>
                  );
                })}
              </View>
            ) : null}
          </View>

          {/* Owner & Contact (read-only styled) */}
          <View style={styles.twoColRow}>
            <View style={styles.halfCol}>
              <Text style={styles.fieldLabel}>Owner</Text>
              <View style={styles.readOnlyBox}>
                <Ionicons name="person-outline" size={15} color="#64748b" />
                <Text style={styles.readOnlyText} numberOfLines={1}>
                  {owner}
                </Text>
              </View>
              {fieldErrors.owner ? (
                <Text style={styles.errorText}>{fieldErrors.owner}</Text>
              ) : null}
            </View>

            <View style={styles.halfCol}>
              <Text style={styles.fieldLabel}>Contact</Text>
              <View style={styles.readOnlyBox}>
                <Ionicons name="call-outline" size={15} color="#64748b" />
                <Text style={styles.readOnlyText} numberOfLines={1}>
                  {contact}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* 4. QUOTATION DETAILS CARD */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.cardIconBox}>
              <Ionicons name="document-text-outline" size={17} color="#0056A2" />
            </View>
            <Text style={styles.cardTitle}>Quotation details</Text>
          </View>

          <View style={styles.divider} />

          {/* Quotation number */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Quotation number</Text>
            <View
              style={[
                styles.inputBox,
                fieldErrors.quotationNumber ? styles.inputErrorBorder : null,
              ]}
            >
              <Ionicons
                name="pricetag-outline"
                size={16}
                color="#64748b"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.textInput}
                value={quotationNumber}
                onChangeText={(text) => {
                  setQuotationNumber(text);
                  setDraftSaved(false);
                  setPreparedNotice(false);
                  clearFieldError('quotationNumber');
                }}
                placeholder="QT-2026-091"
                placeholderTextColor="#94a3b8"
                accessibilityLabel="Quotation number"
              />
            </View>
            {fieldErrors.quotationNumber ? (
              <Text style={styles.errorText}>{fieldErrors.quotationNumber}</Text>
            ) : null}
          </View>

          {/* Date & Valid until */}
          <View style={[styles.twoColRow, styles.fieldGroup]}>
            <View style={styles.halfCol}>
              <Text style={styles.fieldLabel}>Date</Text>
              <View
                style={[
                  styles.inputBox,
                  fieldErrors.date ? styles.inputErrorBorder : null,
                ]}
              >
                <TextInput
                  style={styles.textInput}
                  value={date}
                  onChangeText={(text) => {
                    setDate(text);
                    setDraftSaved(false);
                    setPreparedNotice(false);
                    clearFieldError('date');
                  }}
                  placeholder="23 Sep 2026"
                  placeholderTextColor="#94a3b8"
                  accessibilityLabel="Quotation date"
                />
              </View>
              {fieldErrors.date ? (
                <Text style={styles.errorText}>{fieldErrors.date}</Text>
              ) : null}
            </View>

            <View style={styles.halfCol}>
              <Text style={styles.fieldLabel}>Valid until</Text>
              <View
                style={[
                  styles.inputBox,
                  fieldErrors.validUntil ? styles.inputErrorBorder : null,
                ]}
              >
                <TextInput
                  style={styles.textInput}
                  value={validUntil}
                  onChangeText={(text) => {
                    setValidUntil(text);
                    setDraftSaved(false);
                    setPreparedNotice(false);
                    clearFieldError('validUntil');
                  }}
                  placeholder="30 Sep 2026"
                  placeholderTextColor="#94a3b8"
                  accessibilityLabel="Valid until date"
                />
              </View>
              {fieldErrors.validUntil ? (
                <Text style={styles.errorText}>{fieldErrors.validUntil}</Text>
              ) : null}
            </View>
          </View>

          {/* Service type selector */}
          <View style={styles.fieldGroupLast}>
            <Text style={styles.fieldLabel}>Service type</Text>
            <TouchableOpacity
              style={[
                styles.selectorBox,
                fieldErrors.serviceType ? styles.inputErrorBorder : null,
              ]}
              onPress={() =>
                setOpenDropdown((prev) =>
                  prev === 'serviceType' ? null : 'serviceType'
                )
              }
              activeOpacity={0.8}
              accessibilityLabel="Select service type"
            >
              <Text style={styles.selectorText} numberOfLines={1}>
                {serviceType}
              </Text>
              <Ionicons
                name={
                  openDropdown === 'serviceType' ? 'chevron-up' : 'chevron-down'
                }
                size={18}
                color="#64748b"
              />
            </TouchableOpacity>
            {fieldErrors.serviceType ? (
              <Text style={styles.errorText}>{fieldErrors.serviceType}</Text>
            ) : null}

            {openDropdown === 'serviceType' ? (
              <View style={styles.dropdownMenu}>
                {SERVICE_TYPE_OPTIONS.map((option, idx) => {
                  const isSelected = option === serviceType;
                  return (
                    <TouchableOpacity
                      key={option}
                      style={[
                        styles.dropdownOption,
                        idx < SERVICE_TYPE_OPTIONS.length - 1
                          ? styles.dropdownOptionBorder
                          : null,
                        isSelected ? styles.dropdownOptionSelected : null,
                      ]}
                      onPress={() => handleSelectServiceType(option)}
                      activeOpacity={0.75}
                    >
                      <Text
                        style={[
                          styles.dropdownOptionText,
                          isSelected ? styles.dropdownOptionTextSelected : null,
                        ]}
                      >
                        {option}
                      </Text>
                      {isSelected ? (
                        <Ionicons name="checkmark" size={17} color="#0056A2" />
                      ) : null}
                    </TouchableOpacity>
                  );
                })}
              </View>
            ) : null}
          </View>
        </View>

        {/* 5. SERVICE ITEMS CARD */}
        <View style={styles.card}>
          <View style={styles.cardHeaderSpread}>
            <View style={styles.cardHeaderRow}>
              <View style={styles.cardIconBox}>
                <Ionicons name="list-outline" size={17} color="#0056A2" />
              </View>
              <Text style={styles.cardTitle}>Service items</Text>
            </View>
            <View style={styles.countPill}>
              <Text style={styles.countPillText}>
                {items.length} {items.length === 1 ? 'item' : 'items'}
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.lineItemsList}>
            {items.map((item, idx) => {
              const rowErr = itemErrors[item.id];
              const qtyNum = parsePositiveQuantity(item.quantity);
              const unitNum = parseCostAmount(item.unitPrice);
              const lineAmount =
                qtyNum !== null && unitNum !== null
                  ? formatLkr(qtyNum * unitNum)
                  : '—';

              return (
                <View key={item.id} style={styles.lineItemCard}>
                  <View style={styles.lineItemHeaderRow}>
                    <Text style={styles.lineItemIndex}>Item {idx + 1}</Text>
                    {items.length > 1 ? (
                      <TouchableOpacity
                        style={styles.removeRowButton}
                        onPress={() => handleRemoveItem(item.id)}
                        activeOpacity={0.75}
                        accessibilityLabel={`Remove item ${idx + 1}`}
                      >
                        <Ionicons
                          name="trash-outline"
                          size={13}
                          color="#dc2626"
                        />
                        <Text style={styles.removeRowText}>Remove</Text>
                      </TouchableOpacity>
                    ) : null}
                  </View>

                  {/* Description */}
                  <View style={styles.lineItemField}>
                    <Text style={styles.miniLabel}>Description</Text>
                    <TextInput
                      style={[
                        styles.compactInput,
                        rowErr?.description ? styles.inputErrorBorder : null,
                      ]}
                      value={item.description}
                      onChangeText={(text) =>
                        handleUpdateItem(item.id, 'description', text)
                      }
                      placeholder="Service or part description"
                      placeholderTextColor="#94a3b8"
                      accessibilityLabel={`Item ${idx + 1} description`}
                    />
                    {rowErr?.description ? (
                      <Text style={styles.errorText}>{rowErr.description}</Text>
                    ) : null}
                  </View>

                  {/* Qty + Unit Price */}
                  <View style={styles.itemNumbersRow}>
                    <View style={styles.qtyCol}>
                      <Text style={styles.miniLabel}>Qty</Text>
                      <TextInput
                        style={[
                          styles.compactInput,
                          rowErr?.quantity ? styles.inputErrorBorder : null,
                        ]}
                        value={item.quantity}
                        onChangeText={(text) =>
                          handleUpdateItem(item.id, 'quantity', text)
                        }
                        keyboardType="numeric"
                        placeholder="1"
                        placeholderTextColor="#94a3b8"
                        accessibilityLabel={`Item ${idx + 1} quantity`}
                      />
                      {rowErr?.quantity ? (
                        <Text style={styles.errorText}>{rowErr.quantity}</Text>
                      ) : null}
                    </View>

                    <View style={styles.unitCol}>
                      <Text style={styles.miniLabel}>Unit</Text>
                      <TextInput
                        style={[
                          styles.compactInput,
                          rowErr?.unitPrice ? styles.inputErrorBorder : null,
                        ]}
                        value={item.unitPrice}
                        onChangeText={(text) =>
                          handleUpdateItem(item.id, 'unitPrice', text)
                        }
                        placeholder="LKR 0"
                        placeholderTextColor="#94a3b8"
                        accessibilityLabel={`Item ${idx + 1} unit price`}
                      />
                      {rowErr?.unitPrice ? (
                        <Text style={styles.errorText}>{rowErr.unitPrice}</Text>
                      ) : null}
                    </View>
                  </View>

                  {/* Calculated Line Amount */}
                  <View style={styles.lineAmountBar}>
                    <Text style={styles.lineAmountLabel}>Amount</Text>
                    <Text style={styles.lineAmountValue}>{lineAmount}</Text>
                  </View>
                </View>
              );
            })}
          </View>

          {fieldErrors.itemsGeneral ? (
            <Text style={styles.errorText}>{fieldErrors.itemsGeneral}</Text>
          ) : null}

          <TouchableOpacity
            style={styles.addItemButton}
            onPress={handleAddItem}
            activeOpacity={0.8}
          >
            <Text style={styles.addItemButtonText}>+ Add item</Text>
          </TouchableOpacity>
        </View>

        {/* 6. COST SUMMARY CARD */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.cardIconBox}>
              <Ionicons name="calculator-outline" size={17} color="#0056A2" />
            </View>
            <Text style={styles.cardTitle}>Cost summary</Text>
          </View>

          <View style={styles.divider} />

          {/* Subtotal */}
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>
              {formatLkr(totals.subtotal)}
            </Text>
          </View>

          {/* Editable Tax & Discount */}
          <View style={styles.twoColRow}>
            <View style={styles.halfCol}>
              <Text style={styles.fieldLabel}>Tax</Text>
              <View
                style={[
                  styles.inputBox,
                  fieldErrors.tax ? styles.inputErrorBorder : null,
                ]}
              >
                <TextInput
                  style={styles.textInput}
                  value={tax}
                  onChangeText={handleTaxChange}
                  placeholder="LKR 0"
                  placeholderTextColor="#94a3b8"
                  accessibilityLabel="Tax amount"
                />
              </View>
              {fieldErrors.tax ? (
                <Text style={styles.errorText}>{fieldErrors.tax}</Text>
              ) : null}
            </View>

            <View style={styles.halfCol}>
              <Text style={styles.fieldLabel}>Discount</Text>
              <View
                style={[
                  styles.inputBox,
                  fieldErrors.discount ? styles.inputErrorBorder : null,
                ]}
              >
                <TextInput
                  style={styles.textInput}
                  value={discount}
                  onChangeText={handleDiscountChange}
                  placeholder="LKR 0"
                  placeholderTextColor="#94a3b8"
                  accessibilityLabel="Discount amount"
                />
              </View>
              {fieldErrors.discount ? (
                <Text style={styles.errorText}>{fieldErrors.discount}</Text>
              ) : null}
            </View>
          </View>

          {/* Total */}
          <View style={styles.totalSummaryBox}>
            <View style={styles.totalTopRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>{formatLkr(totals.total)}</Text>
            </View>
            <Text style={styles.totalHint}>
              Subtotal + Tax − Discount (clamped at LKR 0 minimum)
            </Text>
          </View>
        </View>

        {/* 7. NOTES CARD */}
        <View style={styles.card}>
          <Text style={styles.notesLabel}>Notes</Text>
          <TextInput
            style={styles.notesInput}
            value={notes}
            onChangeText={(text) => {
              setNotes(text);
              setDraftSaved(false);
              setPreparedNotice(false);
            }}
            multiline
            textAlignVertical="top"
            placeholder={DEFAULT_NOTES}
            placeholderTextColor="#94a3b8"
            accessibilityLabel="Quotation notes"
          />
        </View>

        {/* 8. COMPACT LOCAL QUOTATION PREVIEW */}
        <View style={styles.previewCard}>
          <View style={styles.previewHeaderRow}>
            <View style={styles.previewBadge}>
              <Ionicons name="eye-outline" size={13} color="#0056A2" />
              <Text style={styles.previewBadgeText}>QUOTATION PREVIEW</Text>
            </View>
            <Text style={styles.previewNumber}>
              {quotationNumber || 'QT-2026-091'}
            </Text>
          </View>

          <Text style={styles.previewVehicle}>{vehicleLabel}</Text>
          <Text style={styles.previewMeta}>
            {owner} · Valid until {validUntil || '—'} · {totals.validItemCount}{' '}
            {totals.validItemCount === 1 ? 'item' : 'items'}
          </Text>

          <View style={styles.previewDivider} />

          <View style={styles.previewTotalRow}>
            <Text style={styles.previewTotalLabel}>Estimated total</Text>
            <Text style={styles.previewTotalValue}>
              {formatLkr(totals.total)}
            </Text>
          </View>
        </View>

        {/* 9. PRIMARY ACTIONS */}
        <View style={styles.actionsSection}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleGenerateQuotation}
            activeOpacity={0.85}
          >
            <Ionicons name="document-text-outline" size={17} color="#ffffff" />
            <Text style={styles.primaryButtonText}>Generate quotation</Text>
          </TouchableOpacity>

          {preparedNotice ? (
            <View style={styles.preparedStatusBox}>
              <Ionicons name="checkmark-circle" size={16} color="#0056A2" />
              <Text style={styles.preparedStatusText}>
                Quotation prepared locally — backend submission not performed.
              </Text>
            </View>
          ) : null}

          <TouchableOpacity
            style={styles.saveDraftButton}
            onPress={handleSaveDraft}
            activeOpacity={0.8}
          >
            <Ionicons name="bookmark-outline" size={16} color="#0056A2" />
            <Text style={styles.saveDraftButtonText}>Save draft</Text>
          </TouchableOpacity>

          {draftSaved ? (
            <View style={styles.draftHintRow}>
              <Ionicons name="checkmark-circle" size={14} color="#15803d" />
              <Text style={styles.draftHintText}>Draft saved locally</Text>
            </View>
          ) : null}
        </View>
      </ScrollView>

      {/* 10. GARAGE BOTTOM NAVIGATION (BILLING ACTIVE) */}
      <View style={styles.bottomTabBar}>
        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => onGaragePress?.()}
          activeOpacity={0.7}
          accessibilityLabel="Garage"
        >
          <Ionicons name="construct-outline" size={20} color="#64748b" />
          <Text style={styles.tabLabel}>Garage</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => onVehiclesPress?.()}
          activeOpacity={0.7}
          accessibilityLabel="Vehicles"
        >
          <Ionicons name="car-outline" size={20} color="#64748b" />
          <Text style={styles.tabLabel}>Vehicles</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => onJobsPress?.()}
          activeOpacity={0.7}
          accessibilityLabel="Jobs"
        >
          <Ionicons name="clipboard-outline" size={20} color="#64748b" />
          <Text style={styles.tabLabel}>Jobs</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => onBillingPress?.()}
          activeOpacity={0.7}
          accessibilityLabel="Billing"
        >
          <Ionicons name="receipt" size={20} color="#0056A2" />
          <Text style={[styles.tabLabel, styles.tabLabelActive]}>Billing</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  headerBar: {
    height: 58,
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  headerLogo: {
    height: 36,
    width: 152,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  headerIconButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  notificationDot: {
    position: 'absolute',
    top: 7,
    right: 8,
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#16a34a',
    borderWidth: 1,
    borderColor: '#ffffff',
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 24,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 2,
    paddingVertical: 4,
    paddingRight: 8,
    marginBottom: 10,
  },
  backButtonText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#0056A2',
  },
  pageIntro: {
    marginBottom: 16,
  },
  eyebrow: {
    fontSize: 10.5,
    fontWeight: '700',
    letterSpacing: 0.9,
    color: '#0056A2',
    marginBottom: 4,
  },
  pageTitle: {
    fontSize: 24,
    lineHeight: 30,
    fontWeight: '800',
    color: '#0f172a',
    letterSpacing: -0.3,
    marginBottom: 5,
  },
  pageSubtitle: {
    fontSize: 13,
    lineHeight: 19,
    color: '#475569',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 16,
    marginBottom: 14,
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
  },
  cardHeaderSpread: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  cardIconBox: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: '#ebf5ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 15.5,
    fontWeight: '800',
    color: '#0f172a',
    flexShrink: 1,
  },
  countPill: {
    backgroundColor: '#ebf5ff',
    borderWidth: 1,
    borderColor: '#bfdbfe',
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 999,
  },
  countPillText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#0056A2',
  },
  divider: {
    height: 1,
    backgroundColor: '#f1f5f9',
    marginVertical: 13,
  },
  fieldGroup: {
    marginBottom: 13,
  },
  fieldGroupLast: {
    marginBottom: 0,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 6,
  },
  miniLabel: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#475569',
    marginBottom: 5,
  },
  twoColRow: {
    flexDirection: 'row',
    gap: 10,
  },
  halfCol: {
    flex: 1,
    minWidth: 0,
  },
  selectorBox: {
    minHeight: 46,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 10,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  selectorText: {
    flex: 1,
    fontSize: 13.5,
    fontWeight: '600',
    color: '#0f172a',
  },
  readOnlyBox: {
    height: 44,
    backgroundColor: '#f1f5f9',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 10,
    paddingHorizontal: 11,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  readOnlyText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
  },
  inputBox: {
    height: 44,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 10,
    paddingHorizontal: 11,
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputIcon: {
    marginRight: 7,
  },
  textInput: {
    flex: 1,
    height: '100%',
    fontSize: 13.5,
    fontWeight: '600',
    color: '#0f172a',
    padding: 0,
  },
  compactInput: {
    height: 40,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 9,
    paddingHorizontal: 10,
    fontSize: 13,
    fontWeight: '600',
    color: '#0f172a',
  },
  inputErrorBorder: {
    borderColor: '#dc2626',
    backgroundColor: '#fef2f2',
  },
  errorText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#dc2626',
    marginTop: 4,
  },
  dropdownMenu: {
    marginTop: 6,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 10,
    overflow: 'hidden',
  },
  dropdownOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 11,
    paddingHorizontal: 12,
    gap: 8,
  },
  dropdownOptionBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  dropdownOptionSelected: {
    backgroundColor: '#eff6ff',
  },
  dropdownOptionTextCol: {
    flex: 1,
    minWidth: 0,
  },
  dropdownOptionText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0f172a',
    flexShrink: 1,
  },
  dropdownOptionTextSelected: {
    color: '#0056A2',
    fontWeight: '700',
  },
  dropdownOptionSubtext: {
    fontSize: 11.5,
    color: '#64748b',
    marginTop: 2,
  },
  lineItemsList: {
    gap: 12,
  },
  lineItemCard: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    padding: 12,
  },
  lineItemHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  lineItemIndex: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0056A2',
  },
  removeRowButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 7,
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  removeRowText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#dc2626',
  },
  lineItemField: {
    marginBottom: 10,
  },
  itemNumbersRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
  },
  qtyCol: {
    width: 78,
  },
  unitCol: {
    flex: 1,
    minWidth: 0,
  },
  lineAmountBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  lineAmountLabel: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#64748b',
  },
  lineAmountValue: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0f172a',
  },
  addItemButton: {
    marginTop: 12,
    height: 42,
    backgroundColor: '#ebf5ff',
    borderWidth: 1,
    borderColor: '#bfdbfe',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addItemButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0056A2',
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 13,
  },
  summaryLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
  },
  summaryValue: {
    fontSize: 14.5,
    fontWeight: '800',
    color: '#0f172a',
  },
  totalSummaryBox: {
    backgroundColor: '#ebf5ff',
    borderWidth: 1,
    borderColor: '#bfdbfe',
    borderRadius: 12,
    padding: 13,
    marginTop: 14,
  },
  totalTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 3,
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#004684',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#003566',
  },
  totalHint: {
    fontSize: 11,
    color: '#475569',
    fontWeight: '500',
  },
  notesLabel: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 8,
  },
  notesInput: {
    minHeight: 84,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    lineHeight: 19,
    color: '#0f172a',
  },
  previewCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#bfdbfe',
    padding: 15,
    marginBottom: 16,
  },
  previewHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 8,
  },
  previewBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#ebf5ff',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
  },
  previewBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#0056A2',
    letterSpacing: 0.5,
  },
  previewNumber: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#0f172a',
  },
  previewVehicle: {
    fontSize: 14.5,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 2,
  },
  previewMeta: {
    fontSize: 12,
    color: '#475569',
  },
  previewDivider: {
    height: 1,
    backgroundColor: '#e2e8f0',
    marginVertical: 10,
  },
  previewTotalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  previewTotalLabel: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#475569',
  },
  previewTotalValue: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0056A2',
  },
  actionsSection: {
    gap: 10,
    marginBottom: 4,
  },
  primaryButton: {
    height: 48,
    backgroundColor: '#0056A2',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    shadowColor: '#0056A2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 3,
  },
  primaryButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#ffffff',
  },
  preparedStatusBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ebf5ff',
    borderWidth: 1,
    borderColor: '#bfdbfe',
    borderRadius: 11,
    paddingVertical: 10,
    paddingHorizontal: 12,
    gap: 8,
  },
  preparedStatusText: {
    flex: 1,
    fontSize: 12.5,
    lineHeight: 17,
    fontWeight: '700',
    color: '#004684',
  },
  saveDraftButton: {
    height: 46,
    backgroundColor: '#ffffff',
    borderWidth: 1.2,
    borderColor: '#0056A2',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  saveDraftButtonText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#0056A2',
  },
  draftHintRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    paddingTop: 2,
  },
  draftHintText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#15803d',
  },
  bottomTabBar: {
    height: 56,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    gap: 2,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748b',
  },
  tabLabelActive: {
    color: '#0056A2',
    fontWeight: '700',
  },
});
