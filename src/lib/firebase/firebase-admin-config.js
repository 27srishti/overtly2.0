import { initializeApp, getApps, cert } from 'firebase-admin/app';



const firebaseAdminConfig = {
    credential: cert({
        project_id: process.env.projectId,
        client_email: process.env.clientEmail,
        private_key: process.env.privateKey,
    })
}

export function customInitApp() {
    if (getApps().length <= 0) {
        initializeApp(firebaseAdminConfig);
    }
}


