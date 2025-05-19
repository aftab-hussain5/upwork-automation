import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Upwork OAuth Integration
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Securely connect your application with Upwork's API
          </p>
        </div>

        <div className="max-w-md mx-auto">
          <Card className="shadow-lg border-0">
            <CardHeader className="pb-8">
              <CardTitle className="text-2xl font-semibold">Connect to Upwork</CardTitle>
              <CardDescription>
                Authenticate with Upwork to access API resources
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-8">
              <div className="rounded-lg bg-gray-50 dark:bg-gray-900 p-4 mb-6">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  This application will request authorization to access your Upwork account data. 
                  You'll be redirected to Upwork to complete the authentication process.
                </p>
              </div>
              <div className="text-center">
                <Button asChild size="lg" className="bg-[#6FDA44] hover:bg-[#5ec938] text-white w-full transition-all duration-200">
                  <Link href="/api/auth/upwork" className="flex items-center justify-center gap-2">
                    Connect with Upwork
                    <ExternalLink size={16} />
                  </Link>
                </Button>
              </div>
            </CardContent>
            <CardFooter className="border-t pt-4 text-xs text-gray-500 dark:text-gray-400">
              <p>
                You'll be redirected to Upwork to complete the authentication. Once completed, you'll receive access tokens for API access.
              </p>
            </CardFooter>
          </Card>
        </div>

        <div className="mt-16 max-w-3xl mx-auto">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-6">
            How it works
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
              <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center text-green-600 dark:text-green-400 mb-4">
                1
              </div>
              <h3 className="text-lg font-medium mb-2">
                Initiate Authentication
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Click the "Connect with Upwork" button to start the OAuth flow
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
              <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-4">
                2
              </div>
              <h3 className="text-lg font-medium mb-2">
                Authorize on Upwork
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                You'll be redirected to Upwork to grant permission to the application
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
              <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center text-purple-600 dark:text-purple-400 mb-4">
                3
              </div>
              <h3 className="text-lg font-medium mb-2">
                Receive Tokens
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                After authorization, you'll receive access tokens to make API calls
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}