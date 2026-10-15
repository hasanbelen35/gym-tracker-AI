export type WorkoutLogStatus = "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
export type SetLogStatus = "MATCHED" | "MODIFIED" | "SKIPPED";

export interface WorkoutLog {
  id: number;
  publicId: string;
  memberId: number;
  workoutDayId: number | null;
  startedAt: string;
  completedAt: string | null;
  durationMinutes: number | null;
  status: WorkoutLogStatus;
  memberNote: string | null;
  aiFeedback: string | null;
  createdAt: string;
  updatedAt: string;
  exerciseLogs?: ExerciseLog[];
}

export interface ExerciseLog {
  id: number;
  publicId: string;
  workoutLogId: number;
  exerciseName: string;
  orderIndex: number;
  notes: string | null;
  setLogs?: ExerciseSetLog[];
}

export interface ExerciseSetLog {
  id: number;
  publicId: string;
  exerciseLogId: number;
  workoutSetId: number | null;
  setNumber: number;
  targetReps: string | null;
  targetWeight: number | null;
  targetRir: number | null;
  actualReps: number | null;
  actualWeight: number | null;
  actualRir: number | null;
  status: SetLogStatus;
}