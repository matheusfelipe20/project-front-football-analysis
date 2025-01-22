import { createContext, useContext, useState } from 'react';

const DataUpdateContext = createContext();

export const useDataUpdate = () => {
  return useContext(DataUpdateContext);
};

export const DataUpdateProvider = ({ children }) => {
  const [updateFlag, setUpdateFlag] = useState(false);

  const triggerUpdate = () => setUpdateFlag((prev) => !prev);

  return (
    <DataUpdateContext.Provider value={{ updateFlag, triggerUpdate }}>
      {children}
    </DataUpdateContext.Provider>
  );
};
