import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { client } from './lib/firebase/types';

interface ClientStore {
    client: client | null;
    setClient: (client: client) => void;
}

export const useClientStore = create<ClientStore>()(
    devtools(
        persist(
            (set) => ({
                client: null,
                setClient: (client: client | null) => set({ client }),
            }),
            {
                name: 'current-client',
            },
        ),
    ),
);

interface FormState {
    formData: {
        ideaHint: string;
        Ideas: string[];
        generatebyai: boolean;
        mediaFormat: string;
        beat: string;
        outlet: string;
        objective: string;
    };
    updateFormData: (data: Partial<FormState['formData']>) => void;
    resetFormData: () => void;
}

export const useFormStore = create<FormState>((set) => ({
    formData: {
        ideaHint: '',
        Ideas: [],
        generatebyai: false,
        mediaFormat: '',
        beat: '',
        outlet: '',
        objective: ''
    },
    updateFormData: (data) =>
        set((state) => ({
            formData: { ...state.formData, ...data },
        })),
    resetFormData: () =>
        set(() => ({
            formData: {
                ideaHint: '',
                Ideas: [],
                generatebyai: false,
                mediaFormat: '',
                beat: '',
                outlet: '',
                objective: ''
            },
        })),
}));
