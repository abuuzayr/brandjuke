import Card from "@/components/home/card";
import Layout from "@/components/layout";
import Balancer from "react-wrap-balancer";
import { AnimatePresence, motion } from "framer-motion";
import { FADE_DOWN_ANIMATION_VARIANTS } from "@/lib/constants";
import { Github, Plus } from "@/components/shared/icons";
import useSWR from "swr";
import { fetcher } from "@/lib/utils";
import { useEffect, useState } from "react";
import { useBrandInputModal } from "@/components/home/brand-input-modal";
import { useSession } from "next-auth/react";
import { useSignInModal } from "@/components/layout/sign-in-modal";
import { useRouter } from "next/router";
import { useDebounce } from 'use-debounce';

type Brand = {
  id: string;
  name: string;
  image: string;
  industry: number;
  colors: string[];
}

export default function Home() {
  const router = useRouter()
  const [search, setSearch] = useState("")
  const [debouncedSearch] = useDebounce(search, 1000)
  const { BrandInputModal, setShowBrandInputModal } = useBrandInputModal();
  const { SignInModal, setShowSignInModal } = useSignInModal();
  const { data: brands } = useSWR<Brand[]>(`/api/brands?search=${debouncedSearch}`, fetcher);
  const { data: session, status } = useSession();

  useEffect(() => {
    if (router.query["search"]) {
      setSearch(router.query["search"] as string)
    }
  }, [router.query])

  return (
    <Layout>
      <BrandInputModal />
      <SignInModal />
      <motion.div
        className="px-5 max-w-7xl xl:px-0"
        initial="hidden"
        whileInView="show"
        animate="show"
        viewport={{ once: true }}
        variants={{
          hidden: {},
          show: {
            transition: {
              staggerChildren: 0.15,
            },
          },
        }}
      >
        <motion.h1
          className="bg-gradient-to-br from-orange-500 to-yellow-300 bg-clip-text text-center font-display text-4xl font-bold tracking-[-0.02em] text-transparent drop-shadow-sm md:text-7xl md:leading-[5rem]"
          variants={FADE_DOWN_ANIMATION_VARIANTS}
        >
          <Balancer>Explore brand logos for your inspiration</Balancer>
        </motion.h1>

        <motion.div className="flex items-center justify-center mt-6 space-x-5" variants={FADE_DOWN_ANIMATION_VARIANTS}>
          <AnimatePresence>
            {!session && status !== "loading" ? (

              <button
                onClick={() => setShowSignInModal(true)}
                className="flex items-center justify-center py-2 space-x-2 overflow-hidden transition-colors bg-yellow-100 rounded-full px-7 hover:bg-yellow-200"
              >
                <Plus className="w-5 h-5 text-yellow-600" />
                <p className="text-sm font-semibold text-yellow-600">
                  Sign in to add a brand
                </p>
              </button>
            ) : (
              <button
                onClick={() => setShowBrandInputModal(true)}
                className="flex items-center justify-center py-2 space-x-2 overflow-hidden transition-colors bg-yellow-100 rounded-full px-7 hover:bg-yellow-200"
              >
                <Plus className="w-5 h-5 text-yellow-600" />
                <p className="text-sm font-semibold text-yellow-600">
                  Add a brand
                </p>

              </button>
            )}
          </AnimatePresence>
          <div className="text-xs font-semibold text-gray-400">OR</div>
          <a
            href="https://github.com/abuuzayr/brandbuzza/data/brands.csv"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center py-2 space-x-2 overflow-hidden transition-colors bg-gray-100 rounded-full px-7 hover:bg-gray-200"
          >
            <Github className="w-5 h-5 text-gray-600" />
            <p className="text-sm font-semibold text-gray-600">
              Edit the database on GitHub
            </p>
          </a>
        </motion.div>

        <motion.p
          className="mt-6 text-center text-gray-500 md:text-xl"
          variants={FADE_DOWN_ANIMATION_VARIANTS}
        >
          <Balancer>
            Or use them for your next project like this ↓! Always free and open source ❤️
          </Balancer>
        </motion.p>
        <motion.div
          className="flex items-center justify-center mx-auto mt-6 space-x-5"
          variants={FADE_DOWN_ANIMATION_VARIANTS}
        >
          <input
            type="text"
            id="search-input"
            className="block w-4/5 p-3 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-sm focus:ring-blue-500 focus:border-blue-500"
            placeholder="Search for a brand.."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              // TODO: consider if we should debounce this
              router.push({
                pathname: "/",
                query: { ...(e.target.value && { search: e.target.value }) }
              }, undefined, { shallow: true })
            }} />
        </motion.div>
      </motion.div>
      {/* here we are animating with Tailwind instead of Framer Motion because Framer Motion messes up the z-index for child components */}
      <div className="my-10 grid w-full max-w-screen-xl animate-[slide-down-fade_0.5s_ease-in-out] grid-cols-1 gap-5 px-5 sm:grid-cols-3 md:grid-cols-5 xl:px-0">
        {(brands || [])
          .map(({ id, name, image, industry }: { id: string, name: string, image: string, industry: number }) => (
            <Card
              key={id}
              name={name}
              image={image}
              industry={industry}
            />
          ))}
        {/* TODO: handle no search results case */}
      </div>
    </Layout>
  );
}
