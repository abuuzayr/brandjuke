import { FADE_IN_ANIMATION_SETTINGS } from "@/lib/constants";
import { AnimatePresence, motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { Buzz, Github } from "@/components/shared/icons";
import Link from "next/link";
import { ReactNode } from "react";
import useScroll from "@/lib/hooks/use-scroll";
import Meta from "./meta";
import { useSignInModal } from "./sign-in-modal";
import UserDropdown from "./user-dropdown";
import { Toaster } from "react-hot-toast";
import { useBrandInputModal } from "../home/brand-input-modal";

export default function Layout({
  meta,
  children,
}: {
  meta?: {
    title?: string;
    description?: string;
    image?: string;
  };
  children: ReactNode;
}) {
  const { data: session, status } = useSession();
  const { SignInModal, setShowSignInModal } = useSignInModal();
  const scrolled = useScroll(50);
  const { BrandInputModal, setShowBrandInputModal } = useBrandInputModal();

  return (
    <>
      <Meta {...meta} />
      <SignInModal />
      <BrandInputModal />
      <Toaster />
      <div className="fixed w-full h-screen bg-gradient-to-br from-rose-100 via-white to-teal-100" />
      <div
        className={`fixed top-0 w-full ${
          scrolled
            ? "border-b border-gray-200 bg-white/50 backdrop-blur-xl"
            : "bg-white/0"
        } z-30 transition-all`}
      >
        <div className="flex items-center justify-between h-16 max-w-screen-xl mx-5 xl:mx-auto">
          <Link href="/" className="flex items-center text-2xl font-display">
            <Buzz className="w-8 h-8" />
            <p>BrandBuzza</p>
          </Link>
          <div className="flex space-x-2">
            <AnimatePresence>
              <a
                className="flex items-center justify-center px-5 space-x-2 text-sm text-gray-600 transition-colors rounded-lg shadow hover:shadow-md max-w-fit"
                href="https://github.com/abuuzayr/brandbuzza"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github />
                <p>Star on GitHub</p>
              </a>
            </AnimatePresence>
            <AnimatePresence>
              {!session && status !== "loading" ? (
                <motion.button
                  className="rounded-lg border border-black bg-black p-1.5 px-4 text-sm text-white transition-all hover:bg-white hover:text-black"
                  onClick={() => setShowSignInModal(true)}
                  {...FADE_IN_ANIMATION_SETTINGS}
                >
                  Sign In
                </motion.button>
              ) : (
                <UserDropdown setShowBrandInputModal={setShowBrandInputModal} />
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
      <main className="flex flex-col items-center justify-center w-full py-32">
        {children}
      </main>
      <div className="absolute flex justify-center w-full py-5 bg-white border-t border-gray-200">
        <div className="w-4/5">
          <p className="text-gray-500">
            API
          </p>
        </div>
      </div>
    </>
  );
}
