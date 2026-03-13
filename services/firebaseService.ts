import { initializeApp, deleteApp } from "firebase/app";
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  getAuth,
  type User
} from "firebase/auth";
import { 
  doc, 
  setDoc, 
  getDoc, 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs,
  orderBy,
  limit,
  Timestamp,
  serverTimestamp
} from "firebase/firestore";
import { auth, db, firebaseConfig } from "./firebaseConfig";

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  organization?: string;
  role: "user" | "employee" | "admin";
  adminKey?: string;
  createdAt: Timestamp;
}

const ADMIN_EMAIL = "laxmikanttalli303@gmail.com";
const VALID_ADMIN_KEY = "HF-ADMIN-2026"; // Mock valid admin key for employees

export const registerEmployee = async (name: string, email: string, pass: string, organization: string) => {
  const secondaryApp = initializeApp(firebaseConfig, "Secondary");
  const secondaryAuth = getAuth(secondaryApp);
  
  try {
    const userCredential = await createUserWithEmailAndPassword(secondaryAuth, email, pass);
    const user = userCredential.user;

    const userProfile: any = {
      uid: user.uid,
      name,
      email: user.email,
      organization,
      role: "employee",
      createdAt: serverTimestamp(),
    };

    await setDoc(doc(db, "users", user.uid), userProfile);
    await deleteApp(secondaryApp);
    return userProfile;
  } catch (error) {
    await deleteApp(secondaryApp);
    throw error;
  }
};

export const registerUser = async (name: string, email: string, pass: string, adminKey?: string) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
  const user = userCredential.user;

  let role: "user" | "employee" | "admin" = "user";
  
  if (email === ADMIN_EMAIL) {
    role = "admin";
  } else if (adminKey === VALID_ADMIN_KEY) {
    role = "employee";
  }

  const userProfile: any = {
    uid: user.uid,
    name,
    email: user.email,
    role,
    adminKey: adminKey || "",
    createdAt: serverTimestamp(),
  };

  await setDoc(doc(db, "users", user.uid), userProfile);
  return userProfile;
};

export const loginUser = async (email: string, pass: string) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, pass);
  const userDoc = await getDoc(doc(db, "users", userCredential.user.uid));
  return userDoc.data() as UserProfile;
};

export const logoutUser = () => signOut(auth);

export const getUserProfile = async (uid: string) => {
  const userDoc = await getDoc(doc(db, "users", uid));
  return userDoc.exists() ? (userDoc.data() as UserProfile) : null;
};

// Firestore helper functions
export const saveEmailAnalysis = async (user_uid: string, analysis: any) => {
  return await addDoc(collection(db, "emails"), {
    user_uid,
    ...analysis,
    timestamp: Timestamp.now()
  });
};

export const getEmailsByUserId = async (user_uid: string) => {
  const q = query(
    collection(db, "emails"), 
    where("user_uid", "==", user_uid),
    orderBy("timestamp", "desc")
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const saveEmailLog = async (logData: any) => {
  return await addDoc(collection(db, "email_logs"), {
    ...logData,
    analyzedAt: serverTimestamp()
  });
};

export const saveUserAction = async (uid: string, action: any) => {
  return await addDoc(collection(db, "userActions"), {
    uid,
    ...action,
    timestamp: Timestamp.now()
  });
};
