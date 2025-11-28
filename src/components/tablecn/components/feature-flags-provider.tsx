"use client";

import * as React from "react";
import { useQueryState, parseAsStringEnum } from "nuqs";
import { flagConfig } from "@/components/tablecn/config/flag";

interface FeatureFlagsContextValue {
  enableAdvancedFilter: boolean;
  filterFlag: string | null;
  setFilterFlag: (value: string | null) => void;
}

const FeatureFlagsContext = React.createContext<FeatureFlagsContextValue>({
  enableAdvancedFilter: false,
  filterFlag: null,
  setFilterFlag: () => {},
});

export function useFeatureFlags() {
  const context = React.useContext(FeatureFlagsContext);
  if (!context) {
    throw new Error(
      "useFeatureFlags must be used within a FeatureFlagsProvider"
    );
  }
  return context;
}

interface FeatureFlagsProviderProps {
  children: React.ReactNode;
}

export function FeatureFlagsProvider({ children }: FeatureFlagsProviderProps) {
  const [filterFlag, setFilterFlag] = useQueryState(
    "filterFlag",
    parseAsStringEnum(flagConfig.featureFlags.map((flag) => flag.value))
  );

  const enableAdvancedFilter = filterFlag !== null;

  const value = React.useMemo(
    () => ({
      enableAdvancedFilter,
      filterFlag,
      setFilterFlag,
    }),
    [enableAdvancedFilter, filterFlag, setFilterFlag]
  );

  return (
    <FeatureFlagsContext.Provider value={value}>
      {children}
    </FeatureFlagsContext.Provider>
  );
}
