import { client } from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface AuthResponse {
  token?: string;
  error?: string;
}

export function useAuth() {
  const queryClient = useQueryClient();

  const loginMutation = useMutation<AuthResponse, Error>({
    mutationFn: async () => {
      // Redirect to Google login
      window.location.href = `${import.meta.env.VITE_API_URL}/api/google`;
      return new Promise<AuthResponse>(() => {}); // This promise will never resolve as we're redirecting
    },
  });

  const handleCallback = useMutation<AuthResponse, Error, string>({
    mutationFn: async (code: string) => {
      const response = await client.api.google.callback.$get({
        query: { code },
      });
      const token = await response.json();

      return token;
    },
    onSuccess: (data) => {
      if (data.error) {
        console.error("Authentication error:", data.error);
        // Handle the error, e.g., show a notification to the user
      } else if (data.token) {
        // Store the token in localStorage
        localStorage.setItem("token", data.token);
        // Invalidate and refetch any necessary queries
        queryClient.invalidateQueries({ queryKey: ["user"] });
      } else {
        console.error("Unexpected response: no token or error message");
      }
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const logout = () => {
    localStorage.removeItem("token");
    // Invalidate and refetch any necessary queries
    queryClient.invalidateQueries({ queryKey: ["user"] });
  };

  return {
    login: loginMutation.mutate,
    handleCallback: handleCallback.mutate,
    logout,
    isLoading: loginMutation.isPending || handleCallback.isPending,
    isError: loginMutation.isError || handleCallback.isError,
    error: loginMutation.error || handleCallback.error,
  };
}
