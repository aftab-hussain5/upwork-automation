import { NextRequest, NextResponse } from "next/server";
import { UpworkOAuth } from "@/lib/upwork-oauth";
import { cookies } from "next/headers";

export async function GET(request: NextRequest) {
  try {
    // Check if Upwork API credentials are configured
    const consumerKey = process.env.UPWORK_CONSUMER_KEY;
    const consumerSecret = process.env.UPWORK_CONSUMER_SECRET;

    if (!consumerKey || !consumerSecret) {
      return NextResponse.json(
        { 
          error: "Missing Upwork API credentials", 
          message: "Please configure UPWORK_CONSUMER_KEY and UPWORK_CONSUMER_SECRET in your environment variables."
        },
        { status: 500 }
      );
    }

    // Initialize Upwork OAuth handler
    const upworkOAuth = new UpworkOAuth();
    
    // Get request token
    const { oauthToken, oauthTokenSecret, redirectURL } = await upworkOAuth.getRequestToken();
    
    // Store the token secret in a secure cookie (we'll need it in the callback)
    cookies().set({
      name: 'upwork_token_secret',
      value: oauthTokenSecret,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 10, // 10 minutes
      path: '/',
    });

    // Redirect to Upwork for authorization
    return NextResponse.redirect(redirectURL);
  } catch (error) {
    console.error('Error in Upwork auth route:', error);
    
    return NextResponse.json(
      { error: "Authentication failed", message: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}