import { initializeApp, getApps, cert } from 'firebase-admin/app';



const firebaseAdminConfig = {
    credential: cert({
        projectId: process.env.projectId,
        clientEmail: process.env.clientEmail,
        privateKey: process.env.privateKey,
    })
}

export function customInitApp() {
    if (getApps().length <= 0) {
        initializeApp(firebaseAdminConfig);
    }
}


