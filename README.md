# Upwork OAuth Integration with Next.js

This application demonstrates how to integrate Upwork's OAuth authentication with a Next.js application. It provides a clean, user-friendly interface for the OAuth flow and token management.

## Features

- Complete Upwork OAuth 1.0a authentication flow
- Secure token handling with HTTP-only cookies
- Modern, responsive UI with light/dark mode support
- Clear success and error states with appropriate feedback

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- Upwork API credentials (Consumer Key and Consumer Secret)

### Configuration

1. Create a `.env.local` file in the root directory with the following variables:

```
UPWORK_CONSUMER_KEY=your_consumer_key
UPWORK_CONSUMER_SECRET=your_consumer_secret
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

2. Replace `your_consumer_key` and `your_consumer_secret` with your actual Upwork API credentials.

### Installation

```bash
npm install
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

## Usage

1. Visit the homepage and click on "Connect with Upwork"
2. You'll be redirected to Upwork to authorize the application
3. After authorization, you'll be redirected back to the callback page
4. The callback page will display your access tokens if successful

## How it Works

1. **Initial Request**: The application requests a temporary token from Upwork
2. **User Authorization**: The user is redirected to Upwork to authorize the application
3. **Token Exchange**: After authorization, the temporary token is exchanged for permanent access tokens
4. **API Access**: The access tokens can be used to make authenticated API calls to Upwork

## Security Considerations

- Token secrets are stored in HTTP-only cookies for security
- All sensitive operations happen on the server side
- Environment variables are used for API credentials

## License

This project is licensed under the MIT License.