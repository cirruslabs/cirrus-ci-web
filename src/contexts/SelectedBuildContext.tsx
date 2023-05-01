import { createContext, useContext, useState } from 'react';

type SelectedBuildContextType = {
  buildId: String;
  setBuildId: (buildId: String) => void;
};

const SelectedBuildContext = createContext<SelectedBuildContextType | null>(null);

export const useSelectedBuildContext = () => {
  return useContext(SelectedBuildContext);
};

export const SelectedBuildProvider: React.FC<React.ReactNode> = ({ children }) => {
  const [buildId, setBuildId] = useState<String | null>(null);

  return <SelectedBuildContext.Provider value={{ buildId, setBuildId }}>{children}</SelectedBuildContext.Provider>;
};
