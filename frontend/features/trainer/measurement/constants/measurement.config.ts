import { CreateMeasurementPayload } from "@/types/types";

export interface MeasurementConfigField {
    key: keyof CreateMeasurementPayload | 'photos';
    label: string;
    unit: string;
    type: 'number' | 'text';
    colSpan?: boolean;
}

export const MEASUREMENT_CONFIG: MeasurementConfigField[] = [
    { key: 'bodyFatRate', label: 'Yağ Oranı', unit: '%', type: 'number' },
    { key: 'muscleMass', label: 'Kas Kütlesi', unit: 'kg', type: 'number' },
    { key: 'chest', label: 'Göğüs', unit: 'cm', type: 'number' },
    { key: 'waist', label: 'Bel', unit: 'cm', type: 'number' },
    { key: 'arm', label: 'Kol', unit: 'cm', type: 'number' },
    { key: 'hip', label: 'Kalça', unit: 'cm', type: 'number' },
    { key: 'shoulder', label: 'Omuz', unit: 'cm', colSpan: true, type: 'number' },
    { key: 'photos', label: 'Fotoğraf URL (Virgülle ayırın)', unit: '', colSpan: true, type: 'text' },
];

export const INITIAL_FORM_STATE: CreateMeasurementPayload = {
    bodyFatRate: 0,
    muscleMass: 0,
    chest: 0,
    waist: 0,
    arm: 0,
    hip: 0,
    shoulder: 0,
    photos: [],
    notes: "",
};