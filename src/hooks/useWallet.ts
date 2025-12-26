"use client";
/**
 * Wallet connection hook for MetaMask integration
 */

import { useState, useCallback, useEffect } from "react";
import { ethers } from "ethers";
import useVotingStore from "@/lib/store/useVotingStore";

type WalletStateType = {
    address: string | null;
    isConnecting: boolean;
    isConnected: boolean;
    error: string | null;
};

/**
 * Hook for managing MetaMask wallet connection
 */
export function useWallet() {
    const [state, setState] = useState<WalletStateType>({
        address: null,
        isConnecting: false,
        isConnected: false,
        error: null,
    });

    const { initContract } = useVotingStore();

    const handleConnect = useCallback(async () => {
        if (typeof window === "undefined" || !window.ethereum) {
            setState((prev) => ({
                ...prev,
                error: "MetaMask is not installed. Please install it to continue.",
            }));
            return null;
        }

        setState((prev) => ({ ...prev, isConnecting: true, error: null }));

        try {
            await window.ethereum.request({ method: "eth_requestAccounts" });
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const address = await signer.getAddress();

            await initContract(provider);

            setState({
                address,
                isConnecting: false,
                isConnected: true,
                error: null,
            });

            return address;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Failed to connect wallet";
            setState((prev) => ({
                ...prev,
                isConnecting: false,
                error: errorMessage,
            }));
            return null;
        }
    }, [initContract]);

    const handleDisconnect = useCallback(() => {
        setState({
            address: null,
            isConnecting: false,
            isConnected: false,
            error: null,
        });
    }, []);

    useEffect(() => {
        if (typeof window === "undefined" || !window.ethereum) return;

        function handleAccountsChanged(accounts: string[]) {
            if (accounts.length === 0) {
                handleDisconnect();
            } else {
                setState((prev) => ({
                    ...prev,
                    address: accounts[0],
                    isConnected: true,
                }));
            }
        }

        window.ethereum.on("accountsChanged", handleAccountsChanged as (...args: unknown[]) => void);

        return () => {
            window.ethereum?.removeListener("accountsChanged", handleAccountsChanged as (...args: unknown[]) => void);
        };

    }, [handleDisconnect]);

    return {
        address: state.address,
        isConnecting: state.isConnecting,
        isConnected: state.isConnected,
        error: state.error,
        handleConnect,
        handleDisconnect,
    };
}
