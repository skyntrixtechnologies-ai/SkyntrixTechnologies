import Constants from "expo-constants";

// Same backend the web admin panel talks to (server/routes, server/controllers).
// Override at build time with EXPO_PUBLIC_API_URL if you point this at a different environment.
const fromEnv = process.env.EXPO_PUBLIC_API_URL || Constants.expoConfig?.extra?.apiUrl;

export const API_URL = (fromEnv || "https://skyntrix.onrender.com/api").replace(/\/$/, "");
