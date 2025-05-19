"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, XCircle, Copy, ArrowLeft } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";

export default function UpworkCallbackPage() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [tokens, setTokens] = useState<{ accessToken: string; accessTokenSecret: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<{ access: boolean; secret: boolean }>({ access: false, secret: false });

  useEffect(() => {
    const fetchTokens = async () => {
      try {
        const oauthToken = searchParams.get("oauth_token");
        const oauthVerifier = searchParams.get("oauth_verifier");

        if (!oauthToken || !oauthVerifier) {
          setStatus("error");
          setError("Missing authorization parameters");
          return;
        }

        const response = await fetch(`/api/auth/upwork/callback?oauth_token=${oauthToken}&oauth_verifier=${oauthVerifier}`);
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to get access token");
        }

        const data = await response.json();
        setTokens({
          accessToken: data.accessToken,
          accessTokenSecret: data.accessTokenSecret,
        });
        setStatus("success");
      } catch (err) {
        setStatus("error");
        setError(err instanceof Error ? err.message : "Failed to get access token");
      }
    };

    fetchTokens();
  }, [searchParams]);

  const copyToClipboard = (text: string, type: "access" | "secret") => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied({ ...copied, [type]: true });
      setTimeout(() => {
        setCopied({ ...copied, [type]: false });
      }, 2000);
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900 p-4 flex items-center justify-center">
      <div className="w-full max-w-md">
        <Card className="w-full shadow-lg border-0">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              {status === "loading" ? (
                <Skeleton className="h-6 w-6 rounded-full" />
              ) : status === "success" ? (
                <CheckCircle className="h-6 w-6 text-green-500" />
              ) : (
                <XCircle className="h-6 w-6 text-red-500" />
              )}
              {status === "loading" ? "Processing..." : status === "success" ? "Authentication Successful" : "Authentication Failed"}
            </CardTitle>
            <CardDescription>
              {status === "loading"
                ? "Please wait while we complete your authentication with Upwork"
                : status === "success"
                ? "Your Upwork account has been successfully connected"
                : "There was a problem connecting your Upwork account"}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {status === "loading" && (
              <div className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            )}

            {status === "success" && tokens && (
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium mb-1">Access Token</p>
                  <div className="relative">
                    <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded border border-gray-200 dark:border-gray-700 text-xs font-mono truncate pr-10">
                      {tokens.accessToken}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-1 top-1/2 transform -translate-y-1/2"
                      onClick={() => copyToClipboard(tokens.accessToken, "access")}
                    >
                      {copied.access ? <CheckCircle className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium mb-1">Access Token Secret</p>
                  <div className="relative">
                    <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded border border-gray-200 dark:border-gray-700 text-xs font-mono truncate pr-10">
                      {tokens.accessTokenSecret}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-1 top-1/2 transform -translate-y-1/2"
                      onClick={() => copyToClipboard(tokens.accessTokenSecret, "secret")}
                    >
                      {copied.secret ? <CheckCircle className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <div className="bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800 p-3 rounded-md">
                  <p className="text-green-800 dark:text-green-400 text-sm">
                    Use these tokens to make authenticated API calls to the Upwork API. Store them securely.
                  </p>
                </div>
              </div>
            )}

            {status === "error" && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 p-4 rounded-md">
                <h3 className="text-red-800 dark:text-red-400 font-medium">Error Details</h3>
                <p className="text-red-700 dark:text-red-300 mt-1 text-sm">{error || "Unknown error occurred"}</p>
              </div>
            )}
          </CardContent>

          <CardFooter className="flex justify-between">
            <Button variant="outline" size="sm" asChild>
              <Link href="/" className="flex items-center gap-1">
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </Link>
            </Button>
            
            {status === "error" && (
              <Button asChild>
                <Link href="/">Try Again</Link>
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}