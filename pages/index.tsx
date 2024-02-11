import Card from "@/components/home/card";
import Layout from "@/components/layout";
import Balancer from "react-wrap-balancer";
import { AnimatePresence, motion } from "framer-motion";
import { FADE_DOWN_ANIMATION_VARIANTS } from "@/lib/constants";
import { Github, Plus } from "@/components/shared/icons";
import useSWR from "swr";
import useSWRImmutable from "swr/immutable"
import { fetcher } from "@/lib/utils";
import { useEffect, useState } from "react";
import { useBrandInputModal } from "@/components/home/brand-input-modal";
import { useSession } from "next-auth/react";
import { useSignInModal } from "@/components/layout/sign-in-modal";
import { useRouter } from "next/router";
import { useDebounce } from 'use-debounce';
import Image from "next/image";
import { shadeMap } from "@/components/home/card";
import Checkbox from "@/components/shared/checkbox";
import SelectBox from "@/components/shared/select-box";
import { INDUSTRIES } from "@/lib/constants";
import Select from "@/components/shared/select";
import { useCardModal } from "@/components/home/card-modal";

export type Brand = {
  id: string;
  name: string;
  image: string;
  industry: number;
  color: string;
}

export default function Home() {
  const router = useRouter()
  const [search, setSearch] = useState("")
  const [colorFilters, setColorFilters] = useState<string>("")
  const [industryFilters, setIndustryFilters] = useState<string>("")
  const [debouncedSearch] = useDebounce(search, 1000)
  const { BrandInputModal, setShowBrandInputModal } = useBrandInputModal();
  const { SignInModal, setShowSignInModal } = useSignInModal();
  const { setBrandData, CardModal } = useCardModal();
  const { data: brands } = useSWR<Brand[]>(
    `/api/brands?${debouncedSearch ? `search=${debouncedSearch}` : ""}${
      colorFilters ? `${debouncedSearch ? "&" : ""}colors=${colorFilters}` : ""
    }${
      industryFilters
        ? `${debouncedSearch || colorFilters ? "&" : ""}industries=${industryFilters}`
        : ""
    }`,
    fetcher,
  );
  const { data: randomBrands } = useSWRImmutable<Brand[]>(
    `/api/brands/random?count=6`,
    fetcher
  );
  const { data: session, status } = useSession();

  useEffect(() => {
    if (router.query["search"]) {
      setSearch(router.query["search"] as string)
    }
    if (router.query["colors"]) {
      setColorFilters(router.query["colors"] as string)
    }
    if (router.query["industries"]) {
      setIndustryFilters(router.query["industries"] as string);
    }
  }, [router.query])

  return (
    <Layout>
      <BrandInputModal />
      <SignInModal />
      <CardModal />
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
          <Balancer>
            Explore brand logos for your inspiration and consumption
          </Balancer>
        </motion.h1>

        <motion.div
          className="flex flex-col items-center justify-center mt-6 space-y-3 md:flex-row md:space-x-5 md:space-y-0"
          variants={FADE_DOWN_ANIMATION_VARIANTS}
        >
          <AnimatePresence>
            {!session && status !== "loading" ? (
              <button
                onClick={() => setShowSignInModal(true)}
                className="flex items-center justify-center py-2 space-x-2 overflow-hidden transition-colors bg-yellow-100 rounded-lg px-7 hover:bg-yellow-200"
              >
                <Plus className="w-5 h-5 text-yellow-600" />
                <p className="text-sm font-semibold text-yellow-600">
                  Sign in to add a brand
                </p>
              </button>
            ) : (
              <button
                onClick={() => setShowBrandInputModal(true)}
                className="flex items-center justify-center py-2 space-x-2 overflow-hidden transition-colors bg-yellow-100 rounded-lg px-7 hover:bg-yellow-200"
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
            href="https://github.com/abuuzayr/brandjuke/edit/main/public/data/brands.csv"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center py-2 space-x-2 overflow-hidden transition-colors bg-gray-100 rounded-lg px-7 hover:bg-gray-200"
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
            Or use them for your next project like this ↓! Always free and open
            source ❤️
          </Balancer>
        </motion.p>
        <motion.div
          className="pt-1 pb-8 mt-12 border-8 rounded-lg border-gray-50 md:pt-4"
          variants={FADE_DOWN_ANIMATION_VARIANTS}
        >
          <div className="w-full text-sm font-bold text-center text-gray-400 uppercase">
            Trusted by
          </div>
          <div className="grid grid-cols-2 gap-4 mt-8 lg:grid-cols-6 lg:gap-8">
            {randomBrands?.map((brand) => (
              <div
                className="flex items-center justify-center h-8"
                key={brand.image}
              >
                <Image
                  src={brand.image}
                  alt={brand.name}
                  className="object-contain w-32 h-8 grayscale"
                  width={128}
                  height={32}
                />
              </div>
            ))}
          </div>
        </motion.div>
        <motion.div
          className="flex items-center justify-center mx-auto mt-12 space-x-5"
          variants={FADE_DOWN_ANIMATION_VARIANTS}
        >
          <input
            type="text"
            id="search-input"
            className="block w-full p-3 text-gray-900 rounded-lg bg-gray-50 focus:border-blue-500 focus:ring-blue-500 sm:text-sm md:w-4/5 md:border md:border-gray-300"
            placeholder="Search for a brand.."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              // TODO: consider if we should debounce this
              const { search, ...routerWithoutSearch } = router.query;
              router.push(
                {
                  pathname: "/",
                  query: {
                    ...routerWithoutSearch,
                    ...(e.target.value && { search: e.target.value }),
                  },
                },
                undefined,
                { shallow: true },
              );
            }}
          />
        </motion.div>

        <motion.div
          className="flex-wrap items-center justify-center hidden mx-auto mt-6 space-x-5 md:flex"
          variants={FADE_DOWN_ANIMATION_VARIANTS}
        >
          {Object.keys(shadeMap).map((color) => (
            <Checkbox
              key={color}
              color={color}
              checked={
                colorFilters.split(",").find((c) => c === color) ? true : false
              }
              onClickFunc={setColorFilters}
              router={router}
            />
          ))}
        </motion.div>

        <motion.div
          className="flex flex-wrap items-center justify-center mx-auto mt-4 space-x-5 md:hidden"
          variants={FADE_DOWN_ANIMATION_VARIANTS}
        >
          <Select
            label="Color filter"
            placeholder="Filter by color"
            options={Object.keys(shadeMap).map((c) => ({ value: c, label: c }))}
            onChangeFunc={setColorFilters}
            selectedOptions={colorFilters}
          />
        </motion.div>

        <motion.div
          className="flex-wrap items-center justify-center hidden w-4/5 mx-auto mt-6 space-x-2 md:flex"
          variants={FADE_DOWN_ANIMATION_VARIANTS}
        >
          {Object.values(INDUSTRIES)
            .slice(0, Object.keys(INDUSTRIES).length / 2)
            .map((industry) => (
              <SelectBox
                text={industry as string}
                key={industry}
                checked={
                  !!industryFilters
                    .split(",")
                    .find(
                      (i) => i === encodeURIComponent(industry).toLowerCase(),
                    )
                }
                onClickFunc={setIndustryFilters}
                router={router}
              />
            ))}
        </motion.div>

        <motion.div
          className="flex flex-wrap items-center justify-center mx-auto mt-4 space-x-5 md:hidden"
          variants={FADE_DOWN_ANIMATION_VARIANTS}
        >
          <Select
            label="Industry filter"
            placeholder="Filter by industry"
            options={Object.values(INDUSTRIES)
              .slice(0, Object.keys(INDUSTRIES).length / 2)
              .map((industry) => ({
                label: industry as string,
                value: encodeURIComponent(industry).toLowerCase(),
              }))}
            onChangeFunc={setIndustryFilters}
            selectedOptions={industryFilters}
          />
        </motion.div>
      </motion.div>
      {/* here we are animating with Tailwind instead of Framer Motion because Framer Motion messes up the z-index for child components */}
      <div className="my-10 grid w-full max-w-screen-xl animate-[slide-down-fade_0.5s_ease-in-out] grid-cols-1 gap-5 px-5 sm:grid-cols-3 md:grid-cols-5 xl:px-0">
        {(brands || []).map(
          ({
            id,
            name,
            image,
            industry,
            color,
          }: {
            id: string;
            name: string;
            image: string;
            industry: number;
            color: string;
          }) => (
            <Card
              key={id}
              name={name}
              image={image}
              industry={industry}
              color={color}
              onClickFunc={() =>
                setBrandData({
                  id,
                  name,
                  image,
                  industry,
                  color,
                })
              }
            />
          ),
        )}
        {brands?.length === 0 && (
          <div className="relative flex items-center justify-center w-full h-48 col-span-full">
            No results! Try another search?
          </div>
        )}
      </div>
    </Layout>
  );
}
