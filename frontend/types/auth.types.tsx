import { Member, Trainer, Gym } from '@/types/types'



export interface AuthState {
    user: Gym | Member | Trainer | null;
    role: 'gym' | 'member' | 'trainer' | null;
    loading: boolean;
    error: string | null;
}