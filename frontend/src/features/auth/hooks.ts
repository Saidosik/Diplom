'use client'

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { authKeys } from "./query-keys"
import { getMe, login, logout, register } from "./api"

export function useMeQuery(enabled = true){
    return useQuery({
        queryKey: authKeys.me(),
        queryFn: getMe,
        enabled,
        retry: false
    })
}

export function useLoginMutation(){
    const queryClient = useQueryClient() 
    return useMutation({
        mutationFn: login,
        onSuccess: async () => {
            await queryClient.invalidateQueries({queryKey: authKeys.me() })
        } 
    })
}

export function useRegisterMutation(){
    const queryClient = useQueryClient() 
    return useMutation({
        mutationFn: register,
        onSuccess: async () => {
            await queryClient.invalidateQueries({queryKey: authKeys.me() })
        } 
    })
}

export function useLogoutMutation(){
    const queryClient = useQueryClient() 
    return useMutation({
        mutationFn: logout,
        onSuccess: async () => {
            await queryClient.invalidateQueries({queryKey: authKeys.me() })
        } 
    })
}