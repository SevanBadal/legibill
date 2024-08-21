import NextAuth from "next-auth";
import authOptions from "@/utilities/auth";

const handler = NextAuth(authOptions);
// Export handlers for GET and POST methods
export { handler as GET, handler as POST };
