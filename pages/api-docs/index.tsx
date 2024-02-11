import Layout from "@/components/layout";
import Link from "next/link";
export default function ApiDocs() {
  return (
    <Layout>
      <div className="px-6 py-32 lg:px-8">
        <div className="max-w-3xl mx-auto text-base leading-7 text-gray-700 align-center">
          <div className="flex">
            <p className="text-base font-semibold leading-7 text-yellow-600">
              Coming Soon
            </p>
            <Link href="/" className="ml-auto text-sm text-gray-400">← back</Link>
          </div>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Free API for brand images
          </h1>
          <p className="mt-6 text-xl leading-8">
            This is an upcoming feature. Register your interest with the form
            below.
          </p>
          <div className="mt-10 sm:w-full">
            <form
              className="space-y-6"
              action="https://formsubmit.co/afe79cb921e345bad22db0adbbbfeb1e"
              method="POST"
            >
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Email address
                </label>
                <div className="mt-2">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-yellow-100 sm:text-sm sm:leading-6"
                  />
                  <input
                    type="hidden"
                    name="_subject"
                    value="Brandjuke API registration!"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="flex w-full justify-center rounded-md bg-yellow-100 px-3 py-1.5 text-sm font-semibold leading-6 text-yellow-600 shadow-sm hover:bg-yellow-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-100"
                >
                  Register
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
}
