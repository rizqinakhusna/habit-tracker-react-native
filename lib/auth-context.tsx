import {
  createContext,
  Dispatch,
  FC,
  ReactNode,
  SetStateAction,
  useContext,
  useState,
} from "react";
import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type AuthContextTypes = {
  user: boolean;
  setUser: Dispatch<SetStateAction<boolean>>;
  session: boolean;
  setSession: Dispatch<SetStateAction<boolean>>;
  loading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextTypes | null>(null);

const AuthContextProvider: FC<{
  children: ReactNode;
}> = ({ children }) => {
  const [user, setUser] = useState(false);
  const [session, setSession] = useState(false);
  const [loading, setLoading] = useState(false);

  const signIn = async () => {};
  const signOut = async () => {};

  const contextData = {
    user,
    session,
    signIn,
    signOut,
    setUser,
    setSession,
    setLoading,
    loading,
  };

  return (
    <AuthContext.Provider value={contextData}>
      {loading ? (
        <SafeAreaView>
          <Text>Loadinggggggg...</Text>
        </SafeAreaView>
      ) : (
        children
      )}
    </AuthContext.Provider>
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
