import AsyncStorage from "@react-native-async-storage/async-storage";
import { type AuthError, type Session } from "@supabase/supabase-js";
import { SplashScreen, useRouter } from "expo-router";
import {
  createContext,
  FC,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { Platform } from "react-native";
import supabase from "./supabase";
import { AuthSchemaType } from "./types";

SplashScreen.preventAutoHideAsync();

type AuthContextTypes = {
  session: Session | undefined;
  signIn: (params: AuthSchemaType) => Promise<{ err: AuthError | null }>;
  signUp: (params: AuthSchemaType) => Promise<{ err: AuthError | null }>;
  signOut: () => Promise<void>;
  isAuthStatesReady: boolean;
};

const AuthContext = createContext<AuthContextTypes | null>(null);

const AuthContextProvider: FC<{
  children: ReactNode;
}> = ({ children }) => {
  const [session, setSession] = useState<Session>();
  const [isAuthStatesReady, setIsAuthStatesReady] = useState<boolean>(false);
  const router = useRouter();

  const storeSessionToDeviceStorage = async (value: Session) => {
    if (Platform.OS === "web") {
      localStorage.setItem("session", JSON.stringify(value));
    } else {
      try {
        await AsyncStorage.setItem("session", JSON.stringify(value));
      } catch (error) {
        console.log("session storage error", (error as Error).message);
      }
    }
  };

  const removeStoredSessionFromDeviceStorage = async () => {
    if (Platform.OS === "web") {
      localStorage.removeItem("session");
    } else {
      await AsyncStorage.removeItem("session");
    }
  };

  const signIn = async ({ email, password }: AuthSchemaType) => {
    let err: AuthError | null = null;
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        err = error;
        throw new Error(error.message);
      }
      setSession(data.session);
      storeSessionToDeviceStorage(data.session);
      router.replace("/");
    } catch (error) {
      console.error("sign in error:", error);
    }

    return { err };
  };

  const signUp = async ({ email, password }: AuthSchemaType) => {
    let err: AuthError | null = null;
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        err = error;
        throw new Error(error.message);
      }

      setSession(data.session as Session);
      storeSessionToDeviceStorage(data.session as Session);
      router.replace("/");
    } catch (error) {
      console.log("signup error:", error);
    }

    return { err };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.log("signout error: ", error.message);
      return;
    }

    setSession(undefined);
    removeStoredSessionFromDeviceStorage();
    router.replace("/sign-in");
  };

  const contextData = {
    session,
    signIn,
    signUp,
    signOut,
    isAuthStatesReady,
  };

  useEffect(() => {
    const getSessionFromDeviceStorage = async () => {
      try {
        const storedSession =
          Platform.OS === "web"
            ? localStorage.getItem("session")
            : await AsyncStorage.getItem("session");
        if (storedSession !== null) {
          const parsedSession = JSON.parse(storedSession);
          setSession(parsedSession);
        }
      } catch (error) {
        console.log("Error fetching storage session: ", error);
      }
      setIsAuthStatesReady(true);
    };

    getSessionFromDeviceStorage();
  }, []);

  useEffect(() => {
    if (isAuthStatesReady) {
      SplashScreen.hideAsync();
    }
  }, [isAuthStatesReady]);

  return (
    <AuthContext.Provider value={contextData}>{children}</AuthContext.Provider>
  );
};

const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be use under AuthContextProvider");
  }

  return context;
};

export { AuthContextProvider, useAuthContext };
