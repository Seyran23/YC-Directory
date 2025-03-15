import { auth } from "@/auth";
import Link from "next/link";
import Image from "next/image";
import { signIn, signOut } from "@/auth";
import { BadgePlus, LogOut } from "lucide-react";
import { AvatarFallback, AvatarImage, Avatar } from "./ui/avatar";

const Navbar = async () => {
  const session = await auth();

  return (
    <header className="px-5 py-3 shadow-sm bg-white font-work-sans">
      <nav className="flex justify-between items-center">
        <Link href={"/"}>
          <Image
            src={"/yc-directory-logo.png"}
            alt="logo"
            width={144}
            height={30}
          />
        </Link>

        <div className="flex items-center gap-5 text-black">
          {session?.user ? (
            <>
              <Link href={"/startup/create"}>
                <span className="max-sm:hidden">Create</span>
                <BadgePlus className="size-6 sm:hidden" />
              </Link>

              <form
                className="flex items-center"
                action={async () => {
                  "use server";
                  await signOut({ redirectTo: "/" });
                }}
              >
                <button className="cursor-pointer" type="submit">
                  <span className="max-sm:hidden">Logout</span>
                  <LogOut className="size-6 sm:hidden text-red-500" />
                </button>
              </form>

              <Link href={`/user/${session?.id}`}>
                <Avatar>
                  <AvatarImage
                    src={session?.user?.image || ""}
                    alt={session?.user?.name || ""}
                  />
                  <AvatarFallback>AV</AvatarFallback>
                </Avatar>
              </Link>
            </>
          ) : (
            <form
              action={async () => {
                "use server";
                await signIn("github");
              }}
            >
              <button className="cursor-pointer" type="submit">
                Login
              </button>
            </form>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
