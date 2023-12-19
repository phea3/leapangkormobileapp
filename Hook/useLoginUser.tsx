import { useContext } from "react";
import { AuthContext } from "../Context/AuthContext";
import { UseContextType } from "../Context/AuthContext";

const useLoginUser = (): UseContextType => {
  return useContext(AuthContext);
};

export default useLoginUser;
