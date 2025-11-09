import { createContext, useContext } from "react";

interface AdminContextType {
  user: any;
  branch: string | null;
  setBranch: (branch: string) => void;
  loading: boolean;
  setLoading: (val: boolean) => void;
}

export const AdminContext = createContext<AdminContextType>({
  user: {},
  branch: null,
  setBranch: () => {},
  loading: false,
  setLoading: () => {},
});

export const useAdminContext = () => useContext(AdminContext);
