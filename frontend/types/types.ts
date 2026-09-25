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
export interface PortalDataRegister extends PortalData { }

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
  publicId?: string;
  name: string;
  surname: string;
  email?: string;
  myMembers?: Member[];
}

export interface Session {
  id?: number;
  memberId?: number;
  memberName?: string;
  gymId?: number;
  checkIn: string;
  checkOut?: string | null;
  duration?: number;
  gym?: {
    name: string;
  };
}

export interface Gym {
  length: number;
  id: number | string;
  name: string;
  publicId?: string;
  email?: string;
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
  dayNumber: number;
  dayName: string;
  exercises: ProgramExerciseInput[];
}

export interface Program {
  id?: number;
  publicId?: string;
  title?: string;
  description?: string;
  exercises?: Exercise[];
  days?: ProgramDayInput[];
  [key: string]: unknown;
}

// diet program
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
  gymId?: number;
  gym?: Gym;
  trainerId?: number | null;
  trainer?: TrainerInfo | null;
  programs?: Program[];
  dietPrograms?: DietProgram[]; 
  sessions?: Session[];
  measurements?: MemberMeasurement[];
  createdAt?: string;
}

export interface Exercise {
  id: number;
  publicId: string;
  name: string;
  category?: string;
  bodyPart?: string;
  equipment?: string;
  targetMuscle?: string;
  instructions?: string;
  gifUrl?: string;
}

export interface GymState {
  profile: Gym | null;
  loading: boolean;
  error: string | null;

  members: Member[];
  membersLoading: boolean;
  membersError: string | null;

  trainers: TrainerInfo[];
  trainersLoading: boolean;
  trainersError: string | null;

  memberDetail: Member | null;
  memberDetailLoading: boolean;
  memberDetailError: string | null;

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
  profile: {
    name?: string;
    surname?: string;
    email?: string;
    age?: number | null;
    height?: number | null;
    weight?: number | null;
    phone?: string | null;
    medicalNotes?: string | null;
    gender?: 'MALE' | 'FEMALE' | null;
    avatarUrl?: string | null;
    assignmentStatus?: 'ASSIGNED' | 'PENDING' | 'UNASSIGNED';
    gym?: {
      name: string;
    };
    trainer?: TrainerInfo | null;
    sessions?: Session[];
    [key: string]: unknown;
  } | null;
  loading: boolean;
  error: string | null;
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

export interface FetchMembersArgs {
  gymId: string;
  status: 'PENDING' | 'ASSIGNED' | 'UNASSIGNED';
}

export interface AddMeasurementArgs {
  memberPublicId: string;
  measurementData: CreateMeasurementPayload;
}

export interface CompleteTrainerProfileData {
  phone?: string;
  gender?: string;
  age?: number;
  height?: number;
  weight?: number;
  avatarUrl?: string;
}