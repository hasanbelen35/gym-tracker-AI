// ==========================================
// API & ERROR TYPES
// ==========================================

interface ApiErrorDetail {
  field: string;
  message: string;
}

export interface ApiErrorResponse {
  success: boolean;
  error?: string;
  message?: string;
  details?: ApiErrorDetail[];
}

export interface PaginationInfo {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ==========================================
// NAVIGATION & PORTAL TYPES
// ==========================================

export interface LeftNavDataType {
  name: string;
  route: string;
}

export interface NavItem {
  name: string;
  route: string;
}

export interface PortalData {
  icon: string;
  eyebrow: string;
  title: string;
  description: string;
  label: string;
  path: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface PortalDataRegister extends PortalData {}

// ==========================================
// ENUMS & MEMBER PROFILE TYPES
// ==========================================

export type Goal = 'MUSCLE_GAIN' | 'FAT_LOSS' | 'STRENGTH' | 'GENERAL_FITNESS';
export type ExperienceLevel = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
export type EquipmentAccess = 'GYM' | 'HOME' | 'BODYWEIGHT';
export type ActivityLevel = 'SEDENTARY' | 'MODERATE' | 'ACTIVE';

export interface MemberProfileData {
  id?: number;
  memberId?: number;
  goal?: Goal | null;
  experienceLevel?: ExperienceLevel | null;
  workoutDaysPerWeek?: number | null;
  sessionDuration?: number | null;
  equipmentAccess?: EquipmentAccess | null;
  activityLevel?: ActivityLevel | null;
  additionalNotes?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface CompleteProfilePayload {
  age?: number;
  height?: number;
  weight?: number;
  gender?: 'MALE' | 'FEMALE';
  medicalNotes?: string;
  avatarUrl?: string;
  goal?: Goal;
  experienceLevel?: ExperienceLevel;
  workoutDaysPerWeek?: number;
  sessionDuration?: number;
  equipmentAccess?: EquipmentAccess;
  activityLevel?: ActivityLevel;
  additionalNotes?: string;
}

export interface UpdateMemberProfileData {
  name?: string;
  surname?: string;
  gender?: 'MALE' | 'FEMALE';
  phone?: string;
  age?: number;
  height?: number;
  weight?: number;
  medicalNotes?: string;
}

// ==========================================
// GYM & TRAINER TYPES
// ==========================================

export interface Gym {
  id: number | string;
  name: string;
  publicId?: string;
  email?: string;
  length?: number;
}

export interface Trainer {
  id: number;
  publicId: string;
  name: string;
  surname: string;
  email: string;
  phone?: string | null;
  age?: number | null;
  height?: number | null;
  weight?: number | null;
  gender?: 'MALE' | 'FEMALE' | 'OTHER' | null;
  avatarUrl?: string | null;
  isProfileCompleted?: boolean;
  gymId?: number;
  gym?: Gym;
  myMembers?: Member[];
  programs?: Program[];
  createdAt?: string;
}

export interface TrainerInfo {
  id: number;
  publicId: string;
  name: string;
  surname: string;
  email: string;
  avatarUrl?: string | null;
  myMembers?: Member[];
}

export interface CompleteTrainerProfileData {
  phone?: string;
  gender?: string;
  age?: number;
  height?: number;
  weight?: number;
  avatarUrl?: string;
}

// ==========================================
// SESSION & MEASUREMENT TYPES
// ==========================================

export interface Session {
  id?: number;
  publicId?: string;
  memberId?: number;
  memberName?: string;
  gymId?: number;
  checkIn: string;
  checkOut?: string | null;
  duration?: number | null;
  gym?: {
    name: string;
  };
}

export interface MemberMeasurement {
  id?: number;
  publicId: string;
  memberId?: number;
  bodyFatRate?: number | null;
  muscleMass?: number | null;
  chest?: number | null;
  waist?: number | null;
  arm?: number | null;
  hip?: number | null;
  shoulder?: number | null;
  photos?: string[];
  notes?: string | null;
  measuredAt?: string;
  createdAt?: string;
}

export interface CreateMeasurementPayload {
  bodyFatRate?: number;
  muscleMass?: number;
  chest?: number;
  waist?: number;
  arm?: number;
  hip?: number;
  shoulder?: number;
  photos?: string[];
  notes?: string;
}

export interface DeleteMeasurementArgs {
  trainerId: number;
  memberPublicId: string;
  measurementPublicId: string;
}

export interface AddMeasurementArgs {
  memberPublicId: string;
  measurementData: CreateMeasurementPayload;
}

// ==========================================
// PROGRAM & EXERCISE TYPES
// ==========================================

export interface Exercise {
  id: number;
  publicId: string;
  name: string;
  category?: string;
  bodyPart?: string;
  equipment?: string;
  targetMuscle?: string;
  instructions?: string;
  instruction_steps?: string;
  gifUrl?: string;
  createdAt?: string;
}

export interface SetInput {
  setNumber: number;
  reps: number | string;
  weight: number;
}

export interface ProgramExerciseInput {
  exercisePublicId: string;
  sets: SetInput[];
  order: number;
}
export interface ProgramDayInput {
  dayNumber?: number;  
  dayOrder?: number;   
  dayName: string;
  isRestDay?: boolean;
  exercises?: Exercise[];
  [key: string]: unknown;
}
export interface Program {
  id?: number;
  publicId?: string;
  title?: string;
  description?: string;
  type?: string;
  splitType?: string;
  isActive?: boolean;
  createdAt?: string;
  archivedAt?: string | null;
  days?: ProgramDayInput[] ;
  [key: string]: unknown;
}

// ==========================================
// DIET PROGRAM TYPES
// ==========================================

export type MealType = 'BREAKFAST' | 'LUNCH' | 'DINNER' | 'SNACK';

export interface MealItem {
  id?: number;
  publicId: string;
  mealId: number;
  foodName: string;
  amount: number;
  unit: string;
  calories?: number | null;
  protein?: number | null;
  carbs?: number | null;
  fat?: number | null;
  notes?: string | null;
}

export interface Meal {
  id?: number;
  publicId: string;
  dietDayId: number;
  mealType: MealType;
  mealTitle?: string | null;
  orderIndex: number;
  items?: MealItem[];
}

export interface DietDay {
  id?: number;
  publicId: string;
  dietProgramId: number;
  dayName: string;
  dayOrder: number;
  meals?: Meal[];
}

export interface DietProgram {
  id?: number;
  publicId: string;
  memberPublicId: string;
  trainerId: number;
  title: string;
  isActive: boolean;
  createdAt?: string;
  archivedAt?: string | null;
  days?: DietDay[];
}

// ==========================================
// MEMBER ENTITY TYPE
// ==========================================
// --- MEMBER INTERFACE ---
export interface Member {
  id: number;
  publicId: string;
  name: string;
  surname: string;
  email: string;
  phone?: string | null;
  birthDate?: string | null;
  age?: number | null;
  height?: number | null;
  weight?: number | null;
  gender?: 'MALE' | 'FEMALE' | string | null;
  avatarUrl?: string | null;
  medicalNotes?: string | null;
  assignmentStatus?: 'ASSIGNED' | 'PENDING' | 'UNASSIGNED';
  isProfileCompleted?: boolean;
  gymId?: number;
  gym?: Gym;
  trainerId?: number | null;
  trainer?: TrainerInfo | null;
  profile?: MemberProfileData | null;
  programs?: Program[];
  dietPrograms?: DietProgram[];
  sessions?: Session[];
  measurements?: MemberMeasurement[];
  createdAt?: string;
  updatedAt?: string;
}
export interface MemberProfileData {
  goal?: Goal | null;
  experienceLevel?: ExperienceLevel | null;
  workoutDaysPerWeek?: number | null;
  sessionDuration?: number | null;
  equipmentAccess?: EquipmentAccess | null;
  activityLevel?: ActivityLevel | null;
  additionalNotes?: string | null;
}

// ==========================================
// REDUX STATE SLICE TYPES
// ==========================================

export interface FetchMembersArgs {
  gymId: string;
  status: 'PENDING' | 'ASSIGNED' | 'UNASSIGNED';
}

export interface GymState {
  profile: Gym | null;
  loading: boolean;
  error: string | null;

  members: Member[];
  pagination: PaginationInfo | null;
  membersLoading: boolean;
  membersError: string | null;

  trainers: TrainerInfo[];
  trainersLoading: boolean;
  trainersError: string | null;

  memberDetail: Member | null;
  memberDetailLoading: boolean;
  memberDetailError: string | null;

  memberMeasurements: MemberMeasurement[];
  memberMeasurementsPagination: PaginationInfo | null;
  memberMeasurementsLoading: boolean;
  memberMeasurementsError: string | null;

  memberSessions: Session[];
  memberSessionsPagination: PaginationInfo | null;
  memberSessionsLoading: boolean;
  memberSessionsError: string | null;

  memberPrograms: Program[];
  memberProgramsPagination: PaginationInfo | null;
  memberProgramsLoading: boolean;
  memberProgramsError: string | null;

  trainerDetail: TrainerInfo | null;
  trainerDetailLoading: boolean;
  trainerDetailError: string | null;

  assignmentLoading: boolean;
  assignmentError: string | null;

  pendingMembers: Member[];
  assignedMembers: Member[];
  unassignedMembers: Member[];
  statusMembersLoading: boolean;
  statusMembersError: string | null;
}

export interface GymSessionState {
  allSessions: Session[];
  activeSessions: Session[];
  loading: boolean;
  error: string | null;
}

export interface SessionState {
  isActive: boolean;
  loading: boolean;
  error: string | null;
  history: Session[];
}

export interface MemberState {
  trainer: TrainerInfo | null;
  assignmentStatus: 'ASSIGNED' | 'PENDING' | 'UNASSIGNED' | null;
  profile: Member | null;
  programs: Program[];
  pagination: PaginationInfo;
  sessions: Session[];
  sessionsPagination: PaginationInfo;
  measurements: MemberMeasurement[];
  measurementsPagination: PaginationInfo;
  loading: boolean;
  error: string | null;
  workoutLogLoading: boolean;
  workoutLogSuccess: boolean;
}

export interface ExerciseState {
  exercises: Exercise[];
  loading: boolean;
  error: string | null;
  filters: {
    search: string;
    category: string;
    equipment: string;
    targetMuscle: string;
  };
}