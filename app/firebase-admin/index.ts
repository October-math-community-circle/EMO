import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";
const apps = getApps();
const app = apps.length
  ? apps[0]
  : initializeApp({
      projectId: "omcc-5f0b2",
      credential: cert({
        projectId: "omcc-5f0b2",
        clientEmail:
          "firebase-adminsdk-fbsvc@omcc-5f0b2.iam.gserviceaccount.com",
        privateKey: process.env.firebaseKey,
      }),
    });
export const db = getFirestore(app);
export const auth = getAuth(app);
