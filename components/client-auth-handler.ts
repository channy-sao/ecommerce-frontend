// components/client-auth-handler.tsx
"use client";

import {useEffect} from "react";
import {usePathname, useRouter} from "next/navigation";

export default function ClientAuthHandler() {
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        async function checkAndRefreshToken() {
            // Check cookies
            const cookies = document.cookie;
            const hasAccessToken = cookies.includes("access_token");
            const hasRefreshToken = cookies.includes("refresh_token");

            console.log("ClientAuthHandler: Checking tokens");
            console.log("Has access token:", hasAccessToken);
            console.log("Has refresh token:", hasRefreshToken);

            // If we have refresh token but no access token, try to refresh
            if (hasRefreshToken && !hasAccessToken) {
                console.log("Attempting to refresh token...");

                try {
                    const response = await fetch("/api/auth/refresh", {
                        method: "POST",
                        credentials: "include", // Important: sends cookies
                    });

                    console.log("Refresh response status:", response.status);

                    if (response.ok) {
                        console.log("Token refresh successful!");
                        // Optionally reload to apply new tokens
                        setTimeout(() => {
                            window.location.reload();
                        }, 100);
                    } else {
                        console.error("Token refresh failed");
                        // Clear invalid tokens and redirect to login
                        document.cookie = "access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                        document.cookie = "refresh_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                        router.push("/login");
                    }
                } catch (error) {
                    console.error("Token refresh error:", error);
                }
            }

            // If on login page but has tokens, redirect to dashboard
            const isLoginPage = pathname.startsWith("/login");
            if (isLoginPage && (hasAccessToken || hasRefreshToken)) {
                router.push("/dashboard");
            }
        }

        // Run on mount and when pathname changes
        checkAndRefreshToken();
    }, [pathname, router]);

    return null; // This component doesn't render anything
}