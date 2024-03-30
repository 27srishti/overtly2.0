import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { client, project } from './lib/firebase/types';

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
        topic: {
            idea: string,
            story: string,
        };
        mail: {
            content: string;
            email: string;
        };
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
        objective: '',
        topic: {
            idea: ``,
            story: ``,
        },
        mail: {
            content: '',
            email: '',
        }
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
                objective: '',
                topic: {
                    idea: ``,
                    story: ``,
                },
                mail: {
                    content: '',
                    email: '',
                }
            },
        })),
}));


interface projectStore {
    project: project | null;
    setproject: (project: project) => void;
}

export const useProjectStore = create<projectStore>()(
    devtools(
        persist(
            (set) => ({
                project: null,
                setproject: (project: project | null) => set({ project }),
            }),
            {
                name: 'current-project',
            },
        ),
    ),
);


export interface IdeasandMailStore {
    topic: {
        idea: string;
        story: string;
    }[];
    setTopic: (topic: IdeasandMailStore['topic']) => void;
    mail: {
        content: string;
        email: string;
    };
    setMail: (mail: IdeasandMailStore['mail']) => void;
}


export const IdeasandMailStore = create<IdeasandMailStore>((set) => ({
    topic: [],
    setTopic: (topic) => set({ topic }),
    mail: {
        content: '',
        email: '',
    },
    setMail: (newMail) => set((prev) => ({ ...prev, mail: newMail })),
}));

