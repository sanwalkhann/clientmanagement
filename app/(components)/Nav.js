import Link from "next/link";
import { getServerSession } from "next-auth";
import { options } from "../api/auth/[...nextauth]/options";

const Nav = async () => {
  const session = await getServerSession(options);

  return (
    <header className="bg-gray-800 text-white">
      <nav className="container mx-auto flex justify-between items-center py-4">
        <div className="text-2xl font-bold">My App</div>
        <div className="flex gap-6">
          <Link href="/">Home</Link>
          <Link href="/CreateUser">Add Doctor</Link>
          <Link href="/ClientMember">Patient Pannel</Link>
          <Link href="/Member">Member</Link>
          <Link href="/Public">Public</Link>
          {session ? (
            <Link href="/api/auth/signout?callbackUrl=/">Logout</Link>
          ) : (
            <div className="flex gap-4">
              <Link href="/PatientRegister">Signup</Link>
              <Link href="/api/auth/signin">Login</Link>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Nav;
