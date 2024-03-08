import { initializeApp, getApps, cert } from 'firebase-admin/app';



const firebaseAdminConfig = {
    credential: cert({
        projectId: "pr-ai-99",
        clientEmail: "firebase-adminsdk-k6zmd@pr-ai-99.iam.gserviceaccount.com",
        privateKey: "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC01Sx/oMqBBbgy\n8GlFjXcEv9gbGPJSjydEeTvCoPQVoESbvpEKLOVlRPVQwsromqYT900RVrKqbJsk\nii6RgjWABhBPn142vhdBeec3hfYrblFni03BGT2DD5E2n3oYvG1th5nevgV+GALH\nWNCRxwwPp9ooaebkGYJ4E2dRf2fEUeXfSwzVryqoYLo9UWhz8R7sVFZbDgTPoYr2\nhkovYfAMuG4ACS0Vgf0QoA9Z0oAhltKUxH73Pa0Mze8J4wiQ0uZIP98lAD7Lw2YD\nu7B4PgBIC0bzCtEd7yMxSruFRr0n4CVuCpSPc9k2zbSxRPJq69999rG10lXL0nOj\nhPIuc73nAgMBAAECggEAD6c4T9/yR5LgLACljDC/sbiNk2Lobv8XThUUeDeIiWqz\nJawsT+4s+UQr3A7Qk6v3XlkU4cBYfOojz9jqSQw1Z1yfAtVvyVtRFgjgW+0LrxzA\njS8AzwtJSNQLJOhPIF8HNej8B8z5Gr4nV2w3uba6M4y7FK5+HxaaNZywX9ygddzf\nwRzwRZfqTOpMmMqRrNwD3mhfy3dgoZn/In69vZuQVsU0zcrAoYKfllkrm3SkEksO\n7JgofkgJu29Th1dx9ZYLAX4LyUXOe3UnSyDbOtrYEEK27KbsOrmnZP3hLysPXhM/\nGFXN7guv/U1DVjLIB1sdeGmDSpLKukG0yVOW2rSccQKBgQDafa7f7dE0Oeyio4nX\n4eTMyhPCN/pnpizDuGRGvryW1BYKw6y3/kFB5+2HiUP7+3g19cbzJFuu4ZKeBebD\n2VCc5zO201Q2oFMwUzFO5uyp6FrO2xiupHmqmk7Av2Ofhj40vGPBJSTmQMi2rpYs\n+KhoftWj7+T6SkcQqv93cn4xSQKBgQDT4Hkj5tIZaWrdBeTgJ0s9IZB82/NBD4aG\nVEub57hCPKvLBpdIW+xXS9yLfJxvtbRroT41NQIIHtHEsEcectO2YSKprlWJTvgM\n4gl8KPAYL3WpWsjN+CIHEZRRL+wd5WJZlfLlePJNwU0Hmfwm9R9fMP6AKew3OPZV\nV1wAHQylrwKBgGYuxWxg0qh0NqFRjpPyR4knMNpyR5/V7bWTNQKJDbYUdkKOhOZ/\n+JEUINh0b+EXGH9T9Lmd1WsSf/l7lRMfPT5EOsFUUFxD2uQM5FCcWy6TRnTbrs1u\niqApDo/CcpsWs10Chjy8XGd7AOO+/ukFWe2U8+F5vkL4HghDkLqSR0ZRAoGBANNi\nrFnGSy0xQH29CKkeavFVkFsR8nKhs7xHU5v7JplnAJqxO7PkijpaJHJB462MIrIT\nEAZzmVBSt0Q9/uaA93qJFNUnao1wbQglaAMosMngZ8qMGbVs7z4QKuKJJlB5b5Mj\niE+rSEuNJHYGCk0v15nYPsHNka9StGlWnCI82UZfAoGAJoYFAMHxSK5L09m/Wv8C\nHmWf+LgYTQiewvUbxmC9EcJHmbe8HGgp7er6pbT8czQlBsLX/74rn1zfwIUgW/x6\nIdyGZissRahRVDdJD96o5sbMABYfGgzBLKGPM/ONunN3gKXA+VP6kMeIzYBWXgCd\nY5aeh3b6oZQgD1RGExY944A=\n-----END PRIVATE KEY-----\n",
    })
}

export function customInitApp() {
    if (getApps().length <= 0) {
        initializeApp(firebaseAdminConfig);
    }
}


