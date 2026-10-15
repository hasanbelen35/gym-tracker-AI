import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/store";
import {
    addMemberMeasurement,
    deleteMemberMeasurement,
    fetchMemberMeasurements
} from "@/store/slices/trainerSlice";
import { CreateMeasurementPayload } from "@/types/types";
import { useAuth } from "@/hooks/useAuth";
import { INITIAL_FORM_STATE } from "../constants/measurement.config";

export const useMeasurementManager = (memberPublicId: string) => {
    const dispatch = useAppDispatch();
    const { user } = useAuth();

    const { measurements, measurementsLoading } = useAppSelector(
        (state) => state.trainer
    );

    const [selectedId, setSelectedId] = useState<number | string | null>(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [formLoading, setFormLoading] = useState(false);
    const [formData, setFormData] = useState<CreateMeasurementPayload>(INITIAL_FORM_STATE);
    const [formError, setFormError] = useState<string | null>(null);

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [deleteError, setDeleteError] = useState<string | null>(null);

    useEffect(() => {
        if (memberPublicId) {
            dispatch(fetchMemberMeasurements(memberPublicId));
        }
    }, [dispatch, memberPublicId]);

    const safeMeasurements = Array.isArray(measurements) ? measurements : [];

    const selectedMeasurement =
        safeMeasurements.find((m) => m.id === selectedId) ||
        safeMeasurements[0] ||
        null;

    const openAddModal = () => {
        setFormError(null);
        setIsAddModalOpen(true);
    };

    const closeAddModal = () => {
        setFormError(null);
        setIsAddModalOpen(false);
    };

    const selectMeasurement = (id: number | string) => {
        setDeleteError(null);
        setSelectedId(id);
    };

    const openDeleteModal = () => {
        setDeleteError(null);
        setIsDeleteModalOpen(true);
    };

    const closeDeleteModal = () => {
        setIsDeleteModalOpen(false);
    };

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;

        setFormData((prev) => {
            if (name === 'photos') {
                return {
                    ...prev,
                    photos: value
                        ? value.split(',').map((item) => item.trim()).filter(Boolean)
                        : []
                };
            }

            if (name === 'notes') {
                return { ...prev, notes: value };
            }

            const numericValue = value === "" ? 0 : Number(value);
            return { ...prev, [name]: Math.max(0, numericValue) };
        });
    };

    const handleAddMeasurementSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!memberPublicId) return;

        setFormError(null);
        setFormLoading(true);
        try {
            const sanitizedFormData: CreateMeasurementPayload = {
                ...formData,
                bodyFatRate: Math.max(0, Number(formData.bodyFatRate) || 0),
                muscleMass: Math.max(0, Number(formData.muscleMass) || 0),
                chest: Math.max(0, Number(formData.chest) || 0),
                waist: Math.max(0, Number(formData.waist) || 0),
                arm: Math.max(0, Number(formData.arm) || 0),
                hip: Math.max(0, Number(formData.hip) || 0),
                shoulder: Math.max(0, Number(formData.shoulder) || 0),
            };

            const resultAction = await dispatch(
                addMemberMeasurement({
                    memberPublicId,
                    measurementData: sanitizedFormData
                })
            );

            if (addMemberMeasurement.fulfilled.match(resultAction)) {
                setIsAddModalOpen(false);
                setFormData(INITIAL_FORM_STATE);
            } else if (addMemberMeasurement.rejected.match(resultAction)) {
                setFormError((resultAction.payload as string) || "Ölçüm eklenirken bir hata oluştu.");
            }
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : "Ölçüm eklenirken beklenmeyen bir hata oluştu.";
            setFormError(message);
        } finally {
            setFormLoading(false);
        }
    };

    const handleDeleteConfirm = async () => {
        if (!selectedMeasurement || !memberPublicId || !user?.id) return;

        setDeleteError(null);
        const measurementPublicId = String(
            selectedMeasurement.publicId ?? selectedMeasurement.id
        );

        setDeleteLoading(true);
        try {
            const resultAction = await dispatch(
                deleteMemberMeasurement({
                    trainerId: user.id,
                    memberPublicId,
                    measurementPublicId,
                })
            );

            if (deleteMemberMeasurement.fulfilled.match(resultAction)) {
                setIsDeleteModalOpen(false);
                setSelectedId(null);
            } else if (deleteMemberMeasurement.rejected.match(resultAction)) {
                setIsDeleteModalOpen(false);
                setDeleteError((resultAction.payload as string) || "Ölçüm silinirken bir hata oluştu.");
            }
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : "Ölçüm silinirken beklenmeyen bir hata oluştu.";
            setIsDeleteModalOpen(false);
            setDeleteError(message);
        } finally {
            setDeleteLoading(false);
        }
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return "-";
        return new Date(dateString).toLocaleDateString('tr-TR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    return {
        safeMeasurements,
        measurementsLoading,
        selectedMeasurement,
        selectedId,
        selectMeasurement,
        isAddModalOpen,
        openAddModal,
        closeAddModal,
        formLoading,
        formData,
        formError,
        isDeleteModalOpen,
        openDeleteModal,
        closeDeleteModal,
        deleteLoading,
        deleteError,
        handleInputChange,
        handleAddMeasurementSubmit,
        handleDeleteConfirm,
        formatDate,
    };
};