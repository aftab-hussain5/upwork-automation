"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, CheckCircle } from "lucide-react";

interface AuthStatusCardProps {
  tokens: {
    accessToken: string;
    accessTokenSecret: string;
  } | null;
  status: "loading" | "success" | "error";
  error?: string;
}

export function AuthStatusCard({ tokens, status, error }: AuthStatusCardProps) {
  const [copied, setCopied] = useState<{ access: boolean; secret: boolean }>({
    access: false,
    secret: false,
  });

  const copyToClipboard = (text: string, type: "access" | "secret") => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied({ ...copied, [type]: true });
      setTimeout(() => {
        setCopied({ ...copied, [type]: false });
      }, 2000);
    });
  };

  return (
    <Card className="w-full transition-all duration-300 ease-in-out">
      <CardHeader className={status === "success" ? "bg-green-50 dark:bg-green-900/20" : ""}>
        <CardTitle>Authentication {status === "success" ? "Successful" : "Status"}</CardTitle>
        <CardDescription>
          {status === "success"
            ? "Your connection with Upwork was successful"
            : status === "error"
            ? "There was a problem connecting to Upwork"
            : "Connecting to Upwork..."}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        {status === "success" && tokens && (
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <p className="text-sm font-medium">Access Token</p>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 px-2"
                  onClick={() => copyToClipboard(tokens.accessToken, "access")}
                >
                  {copied.access ? (
                    <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                  ) : (
                    <Copy className="h-4 w-4 mr-1" />
                  )}
                  {copied.access ? "Copied" : "Copy"}
                </Button>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded border text-xs font-mono overflow-x-auto whitespace-nowrap">
                {tokens.accessToken}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <p className="text-sm font-medium">Access Token Secret</p>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 px-2"
                  onClick={() => copyToClipboard(tokens.accessTokenSecret, "secret")}
                >
                  {copied.secret ? (
                    <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                  ) : (
                    <Copy className="h-4 w-4 mr-1" />
                  )}
                  {copied.secret ? "Copied" : "Copy"}
                </Button>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded border text-xs font-mono overflow-x-auto whitespace-nowrap">
                {tokens.accessTokenSecret}
              </div>
            </div>
          </div>
        )}

        {status === "error" && (
          <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-md border border-red-100 dark:border-red-800">
            <h3 className="text-red-800 dark:text-red-400 font-medium">Error Details</h3>
            <p className="text-red-600 dark:text-red-300 mt-2">{error || "Unknown error occurred"}</p>
          </div>
        )}

        {status === "loading" && (
          <div className="py-4 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-gray-100"></div>
          </div>
        )}
      </CardContent>
      
      {status === "success" && (
        <CardFooter className="bg-gray-50 dark:bg-gray-800/50 text-sm text-gray-500 dark:text-gray-400 border-t">
          Store these tokens securely. They allow access to the Upwork API on behalf of the authenticated user.
        </CardFooter>
      )}
    </Card>
  );
}