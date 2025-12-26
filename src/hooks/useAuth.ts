"use client";
/**
 * Authentication hook using React Query and server actions
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { getLoggedInUser, getWalletAddress, signOut } from "@/actions";
import { APP_ROUTES } from "@/lib/constants";
import type { UserType } from "@/types";

const QUERY_KEYS = {
    USER: ["user"] as const,
    WALLET: (userId: string) => ["wallet", userId] as const,
};

/**
 * Hook for managing authentication state
 */
export function useAuth() {
    const router = useRouter();
    const queryClient = useQueryClient();

    const userQuery = useQuery({
        queryKey: QUERY_KEYS.USER,
        queryFn: getLoggedInUser,
        retry: false,
    });

    const walletQuery = useQuery({
        queryKey: QUERY_KEYS.WALLET(userQuery.data?.$id ?? ""),
        queryFn: () => getWalletAddress(userQuery.data!.$id),
        enabled: !!userQuery.data?.$id,
    });

    const signOutMutation = useMutation({
        mutationFn: signOut,
        onSuccess: () => {
            queryClient.clear();
            router.push(APP_ROUTES.LOGIN);
        },
    });

    const user: UserType | null = userQuery.data ?? null;
    const walletAddress = walletQuery.data?.success ? walletQuery.data.data.walletAddress : null;
    const isLoading = userQuery.isLoading;
    const isAuthenticated = !!user;

    function handleSignOut() {
        signOutMutation.mutate();
    }

    return {
        user,
        walletAddress,
        isLoading,
        isAuthenticated,
        isSigningOut: signOutMutation.isPending,
        handleSignOut,
        refetch: userQuery.refetch,
    };
}
