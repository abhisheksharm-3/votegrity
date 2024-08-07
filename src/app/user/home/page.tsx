import {
    createSessionClient,
    getLoggedInUser,
    signOut,
    getWalletAddress,
  } from "@/lib/server/appwrite";
  import { redirect } from "next/navigation";
  import { cookies } from "next/headers";
  
  export default async function HomePage() {
    const user = await getLoggedInUser();
    if (!user) redirect("/login");
  
    let walletAddress = null;
    if (user) {
      const data = await getWalletAddress(user.$id);
      walletAddress = data.walletAddress
    }
  
    return (
      <>
        <ul>
          <li>
            <strong>Email:</strong> {user.email}
          </li>
          <li>
            <strong>Name:</strong> {user.name}
          </li>
          <li>
            <strong>ID: </strong> {user.$id}
          </li>
          <li>
            <strong>Wallet Address: </strong> {walletAddress || "Not found"}
          </li>
        </ul>
  
        <form action={signOut}>
          <button type="submit">Sign out</button>
        </form>
      </>
    );
  }