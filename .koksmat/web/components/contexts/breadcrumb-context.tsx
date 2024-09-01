import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
  useEffect,
} from "react";

interface BreadcrumbOptions {
  title?: string;
  [key: string]: any; // Add any additional options as key-value pairs
}

interface Breadcrumb {
  path: string;
  options?: BreadcrumbOptions;
}

interface BreadcrumbContextType {
  breadcrumbs: Breadcrumb[];
  registerBreadcrumb: (path: string, options?: BreadcrumbOptions) => void;
  deregisterBreadcrumb: (path: string) => void;
  updateBreadcrumbOptions: (
    path: string,
    newOptions: BreadcrumbOptions
  ) => void;
}

const BreadcrumbContext = createContext<BreadcrumbContextType | null>(null);

export const useBreadcrumbContext = (): BreadcrumbContextType => {
  const context = useContext(BreadcrumbContext);
  if (!context) {
    throw new Error(
      "useBreadcrumbContext must be used within a BreadcrumbProvider"
    );
  }
  return context;
};

interface BreadcrumbProviderProps {
  children: ReactNode;
}

export const BreadcrumbProvider: React.FC<BreadcrumbProviderProps> = ({
  children,
}) => {
  const [breadcrumbs, setBreadcrumbs] = useState<Breadcrumb[]>([]);

  const registerBreadcrumb = useCallback(
    (path: string, options: BreadcrumbOptions = {}) => {
      setBreadcrumbs((prevBreadcrumbs) => {
        const existing = prevBreadcrumbs.find((b) => b.path === path);
        if (existing) {
          return prevBreadcrumbs.map((b) =>
            b.path === path ? { path, options } : b
          );
        }
        return [...prevBreadcrumbs, { path, options }];
      });
    },
    []
  );

  const deregisterBreadcrumb = useCallback((path: string) => {
    setBreadcrumbs((prevBreadcrumbs) =>
      prevBreadcrumbs.filter((b) => b.path !== path)
    );
  }, []);

  const updateBreadcrumbOptions = useCallback(
    (path: string, newOptions: BreadcrumbOptions) => {
      setBreadcrumbs((prevBreadcrumbs) => {
        return prevBreadcrumbs.map((b) =>
          b.path === path
            ? { ...b, options: { ...b.options, ...newOptions } }
            : b
        );
      });
    },
    []
  );

  return (
    <BreadcrumbContext.Provider
      value={{
        breadcrumbs,
        registerBreadcrumb,
        deregisterBreadcrumb,
        updateBreadcrumbOptions,
      }}
    >
      {children}
    </BreadcrumbContext.Provider>
  );
};

export const useRegisterBreadcrumb = (
  path: string,
  options?: BreadcrumbOptions
) => {
  const { registerBreadcrumb, deregisterBreadcrumb } = useBreadcrumbContext();

  useEffect(() => {
    registerBreadcrumb(path, options);

    return () => {
      deregisterBreadcrumb(path);
    };
  }, [path, options, registerBreadcrumb, deregisterBreadcrumb]);
};

export const useUpdateBreadcrumbOptions = (
  path: string,
  newOptions: BreadcrumbOptions
) => {
  const { updateBreadcrumbOptions } = useBreadcrumbContext();

  useEffect(() => {
    updateBreadcrumbOptions(path, newOptions);
  }, [path, newOptions, updateBreadcrumbOptions]);
};
