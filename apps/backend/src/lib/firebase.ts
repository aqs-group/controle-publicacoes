import * as admin from 'firebase-admin'
import { getFirestore } from 'firebase-admin/firestore'

let initialized = false

export function initFirebase(): void {
  if (initialized) return

  const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH
  const serviceAccountBase64 = process.env.FIREBASE_SERVICE_ACCOUNT_BASE64

  if (process.env.FIRESTORE_EMULATOR_HOST) {
    // Running against local emulator
    admin.initializeApp({
      projectId: process.env.GOOGLE_CLOUD_PROJECT ?? 'demo-controle-publicacoes',
    })
  } else if (serviceAccountBase64) {
    const serviceAccount = JSON.parse(
      Buffer.from(serviceAccountBase64, 'base64').toString('utf-8')
    )
    admin.initializeApp({ credential: admin.credential.cert(serviceAccount) })
  } else if (serviceAccountPath) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const serviceAccount = require(serviceAccountPath)
    admin.initializeApp({ credential: admin.credential.cert(serviceAccount) })
  } else {
    // Application Default Credentials (Cloud Run / GKE)
    admin.initializeApp()
  }

  initialized = true
}

export function getDb() {
  return getFirestore()
}

export { admin }
