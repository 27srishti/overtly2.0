import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { client } from './lib/firebase/types'

interface ClientStore {
    client: client | null;
    setClient: (client: client) => void;
}


const useClientStore = create<ClientStore>()(
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


export default useClientStore;