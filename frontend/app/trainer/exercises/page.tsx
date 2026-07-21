
// TODO: TEST PAGE 
'use client'
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../../store/store"; 
import { 
  fetchExercises, 
  setSearchFilter, 
  setEquipmentFilter, 
  setCategoryFilter, 
  clearFilters 
} from "../../../store/slices/exerciseSlice";

export const ExerciseTestPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { exercises, loading, error, filters } = useSelector((state: RootState) => state.exercises);

  useEffect(() => {
    dispatch(fetchExercises(filters));
  }, [dispatch, filters]);

  return (
    <div style={{ maxWidth: "800px", margin: "40px auto", fontFamily: "sans-serif", padding: "20px" }}>
      <h2>🏋️ Egzersiz Havuzu Test Ekranı</h2>
      <p style={{ color: "#666" }}>1300&apos;lük havuzdan filtreleme ve arama testi</p>

      <div style={{ display: "flex", gap: "10px", marginBottom: "20px", flexWrap: "wrap" }}>
        <input
          type="text"
          placeholder="Hareket ara (örn: Bench, Squat)..."
          value={filters.search}
          onChange={(e) => dispatch(setSearchFilter(e.target.value))}
          style={{ padding: "10px", flex: "1 1 200px", borderRadius: "6px", border: "1px solid #ccc" }}
        />

        <input
          type="text"
          placeholder="Ekipman (örn: barbell, dumbbell)..."
          value={filters.equipment}
          onChange={(e) => dispatch(setEquipmentFilter(e.target.value))}
          style={{ padding: "10px", width: "180px", borderRadius: "6px", border: "1px solid #ccc" }}
        />

        <input
          type="text"
          placeholder="Kategori (örn: strength)..."
          value={filters.category}
          onChange={(e) => dispatch(setCategoryFilter(e.target.value))}
          style={{ padding: "10px", width: "180px", borderRadius: "6px", border: "1px solid #ccc" }}
        />

        <button
          onClick={() => dispatch(clearFilters())}
          style={{ padding: "10px 15px", background: "#ff4d4f", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer" }}
        >
          Sıfırla
        </button>
      </div>

      {loading && <p style={{ textAlign: "center", color: "#1890ff" }}>Yükleniyor...</p>}
      {error && <p style={{ color: "red", background: "#fff1f0", padding: "10px", borderRadius: "6px" }}>Hata: {error}</p>}

      {!loading && !error && (
        <div>
          <p style={{ fontSize: "14px", fontWeight: "bold", color: "#333" }}>
            Bulunan Egzersiz Sayısı: {exercises.length}
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "15px" }}>
            {exercises.map((ex) => (
              <div 
                key={ex.publicId} 
                style={{ background: "#f9f9f9", padding: "15px", borderRadius: "8px", border: "1px solid #e8e8e8" }}
              >
                <h4 style={{ margin: "0 0 8px 0", color: "#222" }}>{ex.name}</h4>
                <p style={{ margin: "4px 0", fontSize: "13px", color: "#555" }}>
                  <strong>Kas Grubu:</strong> {ex.targetMuscle || "Belirtilmemiş"}
                </p>
                <p style={{ margin: "4px 0", fontSize: "13px", color: "#555" }}>
                  <strong>Ekipman:</strong> {ex.equipment || "Yok"}
                </p>
                <p style={{ margin: "4px 0", fontSize: "13px", color: "#555" }}>
                  <strong>Kategori:</strong> {ex.category || "-"}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ExerciseTestPage;