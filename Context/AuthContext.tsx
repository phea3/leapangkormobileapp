import {
  useMemo,
  useReducer,
  createContext,
  ReactElement,
  useState,
} from "react";

//======================= Screen ==========================
export type dimensionType = {
  dimension: string;
  widthscreen: number;
  heightscreen: number;
};

const initDimensionState: dimensionType = {
  dimension: "",
  widthscreen: 0,
  heightscreen: 0,
};

//======================= LOGIN ===============================
export type userLoginType = {
  email: string;
  token: string;
  uid: string;
};

type UserStateType = { user: userLoginType };

const initUserState: UserStateType = {
  user: {
    email: "",
    token: "",
    uid: "",
  },
};

const REDUCER_ACTION_TYPE = {
  LOGIN: "USER_IS_LOGIN",
  LOGOUT: "USER_IS_LOGOUT",
  CONNECT: "CONNECT",
};

export type ReducerAction = {
  type: string;
  payload?: userLoginType;
};

const reducer = (
  state: UserStateType,
  action: ReducerAction
): UserStateType => {
  switch (action.type) {
    case REDUCER_ACTION_TYPE.LOGIN: {
      if (!action.payload) {
        throw new Error("action.payload missing in action");
      }
      const email = action.payload?.email;
      const token = action.payload?.token;
      const uid = action.payload?.uid;

      return { ...state, user: { email, token, uid } };
    }
    case REDUCER_ACTION_TYPE.LOGOUT: {
      return { ...state, user: { email: "", token: "", uid: "" } };
    }
    default:
      throw new Error("Undifined reducer action type");
  }
};

const HandleDefineDimension = (widthScreen: number, heightScreen: number) => {
  let dimension = "";
  let widthscreen = widthScreen;
  let heightscreen = heightScreen;
  // console.log(widthscreen)
  if (widthscreen <= 330) {
    dimension = "sm";
  } else if (widthscreen <= 440) {
    dimension = "md";
  } else if (widthscreen <= 1080) {
    dimension = "lg";
  }

  return dimension;
};

const useValueContext = (initUserState: UserStateType) => {
  //========== GET USER TOKEN ============
  const [state, dispatch] = useReducer(reducer, initUserState);
  //============== GET WIDTH HEIGHT SCREEN ==========
  const [dimensionScreen, defineDimension] = useState(initDimensionState);

  //=========== GET ACTION ===========
  const REDUCER_ACTIONS = useMemo(() => {
    return REDUCER_ACTION_TYPE;
  }, []);

  //======== return value =============
  const token = state?.user?.token;
  const uid = state?.user?.uid;

  const dimension = HandleDefineDimension(
    dimensionScreen?.widthscreen,
    dimensionScreen?.heightscreen
  );
  const widthScreen = dimensionScreen?.widthscreen;
  const heightScreen = dimensionScreen?.heightscreen;

  return {
    dispatch,
    REDUCER_ACTIONS,
    token,
    uid,
    defineDimension,
    dimension,
    widthScreen,
    heightScreen,
  };
};

export type UseContextType = ReturnType<typeof useValueContext>;

const initContextState: UseContextType = {
  dispatch: () => {},
  REDUCER_ACTIONS: REDUCER_ACTION_TYPE,
  token: "",
  uid: "",
  defineDimension: () => {},
  dimension: "",
  widthScreen: 0,
  heightScreen: 0,
};

const AuthContext = createContext<UseContextType>(initContextState);

const AuthProvider = ({ children }: any): ReactElement => {
  return (
    <AuthContext.Provider value={useValueContext(initUserState)}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
