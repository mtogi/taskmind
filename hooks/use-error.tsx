"use client";

import { createContext, useContext, ReactNode, useState, useCallback } from 'react';
import { toast } from 'sonner';

interface ErrorContextProps {
  captureError: (error: unknown, fallbackMessage?: string) => void;
  setGlobalError: (message: string) => void;
  clearError: () => void;
  hasError: boolean;
  errorMessage: string | null;
}

const ErrorContext = createContext<ErrorContextProps | undefined>(undefined);

export const ErrorProvider = ({ children }: { children: ReactNode }) => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [hasError, setHasError] = useState(false);

  const setGlobalError = useCallback((message: string) => {
    setErrorMessage(message);
    setHasError(true);
    
    // Show toast notification
    toast.error(message);
    
    // Log the error to console in development
    if (process.env.NODE_ENV !== 'production') {
      console.error(`[Error]: ${message}`);
    }
  }, []);

  const captureError = useCallback((error: unknown, fallbackMessage = "An unexpected error occurred") => {
    const message = error instanceof Error ? error.message : fallbackMessage;
    
    setGlobalError(message);
    
    // In a real app, you might want to log this to a service like Sentry
    // if (process.env.NODE_ENV === 'production') {
    //   // captureException(error);
    // }
  }, [setGlobalError]);

  const clearError = useCallback(() => {
    setErrorMessage(null);
    setHasError(false);
  }, []);

  return (
    <ErrorContext.Provider value={{ 
      captureError, 
      setGlobalError, 
      clearError, 
      hasError, 
      errorMessage 
    }}>
      {children}
    </ErrorContext.Provider>
  );
};

export const useError = () => {
  const context = useContext(ErrorContext);
  if (context === undefined) {
    throw new Error('useError must be used within an ErrorProvider');
  }
  return context;
}; 