import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// List of public paths that don't require authentication
const PUBLIC_PATHS = [
  "/login",
  "/api/auth/login",
  "/_next",
  "/favicon.ico",
  "/images", // If you have public images
];

export function middleware(request: NextRequest) {
  // Temporary: Allow all requests to pass through
  return NextResponse.next();

  /* Comment out the authentication logic for now
  const { pathname } = request.nextUrl;
  console.log('Current pathname:', pathname);

  // Check if the path is public
  const isPublicPath = PUBLIC_PATHS.some((path) => pathname.startsWith(path));
  if (isPublicPath) {
    console.log('Public path detected:', pathname);
    return NextResponse.next();
  }

  // Check for authentication
  const authHeader = request.headers.get("authorization");
  const storedAuth = request.cookies.get("auth")?.value;
  
  console.log('Auth header present:', !!authHeader);
  console.log('Stored auth present:', !!storedAuth);

  if (authHeader || storedAuth) {
    try {
      const authValue = (authHeader?.split(" ")[1] || storedAuth) as string;
      const [user, pwd] = atob(authValue).split(":");
      
      console.log('Attempting authentication for user:', user);

      if (
        user === process.env.AUTH_USERNAME &&
        pwd === process.env.AUTH_PASSWORD
      ) {
        console.log('Authentication successful');
        const response = NextResponse.next();
        
        if (!storedAuth) {
          response.cookies.set("auth", authValue, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
          });
        }
        
        return response;
      }
    } catch (error) {
      console.error("Auth validation error:", error);
    }
  }

  console.log('Authentication failed, redirecting to login');
  return NextResponse.redirect(new URL("/login", request.url));
  */
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
