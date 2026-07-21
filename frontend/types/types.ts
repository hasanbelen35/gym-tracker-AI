export interface LeftNavDataType {
  name: string,
  route: string
}
// login page
export interface PortalData {
  icon: string;
  eyebrow: string;
  title: string;
  description: string;
  label: string;
  path: string;
}
// register page
export interface PortalDataRegister {
  icon: string;
  eyebrow: string;
  title: string;
  description: string;
  label: string;
  path: string;
}

// gym

export interface Gym {
  id: string | number;
  name: string;
}

// nav ıtem

export interface NavItem {
  name: string;
  route: string;
}

// auth slice
export interface GymSlice {
  id: number;
  name: string;
  email: string;
}

export interface Member {
  id: number;
  name: string;
  surname: string;
  email: string;
}
export interface AuthState {
  user: Gym | Member | null;
  role: 'gym' | 'member' | null;
  loading: boolean;
  error: string | null;
}
// gym session slice

export interface Session {
  id: number;
  memberId: number;
  memberName: string;
  checkIn: string;
  checkOut: string | null;
}

export interface GymSessionState {
  allSessions: Session[];
  activeSessions: Session[];
  loading: boolean;
  error: string | null;
}

// gym slice

export interface GymState {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  profile: any | null;
  loading: boolean;
  error: string | null;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  members: any[];
  membersLoading: boolean;
  membersError: string | null;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  trainers: any[];
  trainersLoading: boolean;
  trainersError: string | null;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  memberDetail: any | null;
  memberDetailLoading: boolean;
  memberDetailError: string | null;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  trainerDetail: any | null;
  trainerDetailLoading: boolean;
  trainerDetailError: string | null;

  assignmentLoading: boolean;
  assignmentError: string | null;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  pendingMembers: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  assignedMembers: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  unassignedMembers: any[];
  statusMembersLoading: boolean;
  statusMembersError: string | null;
}

// session slice
export interface SessionHistoryItem {
  id: number;
  memberId: number;
  gymId: number;
  checkIn: string;
  checkOut: string | null;
  duration: number;
  gym: {
    name: string;
  };
}

export interface SessionState {
  isActive: boolean;
  loading: boolean;
  error: string | null;
  history: SessionHistoryItem[];
}

// trainer slice 
export interface Member {
  publicId: string;
  name: string;
  surname: string;
  email: string;
  assignmentStatus: 'ASSIGNED' | 'PENDING' | 'UNASSIGNED';
  trainer?: {
    name: string;
    surname: string;
  };
}
export
  interface TrainerState {
  pendingMembers: Member[];
  approvedMembers: Member[];
  availableMembers: Member[];
  loading: boolean;
  error: string | null;
}


// member slice

export interface TrainerInfo {
  publicId: string;
  name: string;
  surname: string;
  email: string;
}

export interface MemberState {
  trainer: TrainerInfo | null;
  assignmentStatus: 'ASSIGNED' | 'PENDING' | 'UNASSIGNED' | null;
  loading: boolean;
  error: string | null;
}


// exercise 
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