import { type AuthError, type Session } from "@supabase/supabase-js";
import { useRouter } from "expo-router";
import { createContext, FC, ReactNode, useContext, useState } from "react";
import { AuthSchemaType } from "./schema";
import supabase from "./supabase";

type AuthContextTypes = {
  session: Session | undefined;
  signIn: (params: AuthSchemaType) => Promise<{ err: AuthError | null }>;
  signUp: (params: AuthSchemaType) => Promise<{ err: AuthError | null }>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextTypes | null>(null);

const AuthContextProvider: FC<{
  children: ReactNode;
}> = ({ children }) => {
  const [session, setSession] = useState<Session>();
  const router = useRouter();

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
    router.replace("/sign-in");
  };

  const contextData = {
    session,
    signIn,
    signUp,
    signOut,
  };

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
