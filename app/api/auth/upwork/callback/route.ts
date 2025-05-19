import { NextRequest, NextResponse } from "next/server";
import { UpworkOAuth } from "@/lib/upwork-oauth";
import { cookies } from "next/headers";

export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const oauthToken = searchParams.get('oauth_token');
    const oauthVerifier = searchParams.get('oauth_verifier');

    // Get stored token secret from cookie
    const oauthTokenSecret = cookies().get('upwork_token_secret')?.value;

    // Verify all required parameters are present
    if (!oauthToken || !oauthVerifier || !oauthTokenSecret) {
      return NextResponse.json(
        { 
          error: "Missing parameters", 
          message: "OAuth token, verifier, or token secret is missing" 
        },
        { status: 400 }
      );
    }

    // Initialize Upwork OAuth handler
    const upworkOAuth = new UpworkOAuth();
    
    // Exchange request token for access token
    const { accessToken, accessTokenSecret } = await upworkOAuth.getAccessToken(
      oauthToken,
      oauthTokenSecret,
      oauthVerifier
    );

    // Clear the temporary token secret cookie
    cookies().delete('upwork_token_secret');
    
    // Return the access tokens
    return NextResponse.json({ accessToken, accessTokenSecret });
  } catch (error) {
    console.error('Error in Upwork callback route:', error);
    
    return NextResponse.json(
      { error: "Authentication failed", message: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}