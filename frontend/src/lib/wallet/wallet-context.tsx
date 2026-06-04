"use client";

import React, { createContext, useCallback, useEffect, useState } from "react";
import { connectFreighter, disconnectFreighter } from "./freighter";

export type WalletContextType = {
  isConnected: boolean;
  isLoading: boolean;
  error: string | null;
  publicKey: string | null;
  connect: () => Promise<void>;
  disconnect: () => void;
};

export const WalletContext = createContext<WalletContextType | undefined>(
  undefined
);

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [publicKey, setPublicKey] = useState<string | null>(null);

  // Check for existing connection on mount
  useEffect(() => {
    const checkExistingConnection = async () => {
      try {
        const stored = localStorage.getItem("predictx_wallet_connected");
        if (stored === "true") {
          setIsLoading(true);
          const connection = await connectFreighter();
          if (connection) {
            setPublicKey(connection.publicKey);
            setIsConnected(true);
            setError(null);
          } else {
            localStorage.removeItem("predictx_wallet_connected");
            setIsConnected(false);
          }
        }
      } catch (err) {
        console.error("Error checking existing connection:", err);
        localStorage.removeItem("predictx_wallet_connected");
      } finally {
        setIsLoading(false);
      }
    };

    checkExistingConnection();
  }, []);

  const connect = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const connection = await connectFreighter();
      if (connection) {
        setPublicKey(connection.publicKey);
        setIsConnected(true);
        localStorage.setItem("predictx_wallet_connected", "true");
      } else {
        setError("Failed to connect wallet");
        setIsConnected(false);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setError(message);
      setIsConnected(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const disconnect = useCallback(() => {
    void disconnectFreighter();
    setPublicKey(null);
    setIsConnected(false);
    setError(null);
    localStorage.removeItem("predictx_wallet_connected");
  }, []);

  return (
    <WalletContext.Provider
      value={{
        isConnected,
        isLoading,
        error,
        publicKey,
        connect,
        disconnect,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}
