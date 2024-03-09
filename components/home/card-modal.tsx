import Modal from "@/components/shared/modal";
import {
  useState,
  Dispatch,
  SetStateAction,
  useCallback,
  useMemo,
  useEffect,
} from "react";
import Image from "next/image";
import type { Brand } from "@/pages/index";
import { classNames } from "@/lib/utils";
import { INDUSTRIES } from "@/lib/constants";
import { shadeMap } from "./card";

const CardModal = ({
  brandData,
  showCardModal,
  setShowCardModal,
}: {
  brandData: Brand | null;
  showCardModal: boolean;
  setShowCardModal: Dispatch<SetStateAction<boolean>>;
}) => {
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!copied) return
    setTimeout(() => setCopied(false), 1000)
  }, [copied])

  return (
    <Modal showModal={showCardModal} setShowModal={setShowCardModal}>
      <div className="w-full overflow-hidden md:max-w-lg md:rounded-2xl md:border md:border-gray-100 md:shadow-xl">
        <div className="flex flex-col items-center justify-center px-4 py-6 pt-8 text-center bg-white space-y-7 md:px-12">
          <Image
            src={brandData?.image || ""}
            alt={`${brandData?.name} brand logo`}
            className="h-100 w-100"
            width={240}
            height={240}
          />
          <div className="w-full mt-10 ring-1 ring-gray-300 sm:mx-0 sm:rounded-lg">
            <table className="min-w-full divide-gray-300">
              <tbody>
                <tr>
                  <td
                    className={classNames(
                      "px-3 py-3.5 text-sm text-gray-500 table-cell",
                    )}
                  >
                    Brand
                  </td>
                  <td className="">{brandData?.name}</td>
                </tr>
                <tr>
                  <td
                    className={classNames(
                      "px-3 py-3.5 text-sm text-gray-500 table-cell",
                    )}
                  >
                    Base color
                  </td>
                  <td className="">
                    <div className="inline-flex items-center justify-center gap-x-2">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{
                          backgroundColor: `#${
                            shadeMap[brandData?.color as keyof typeof shadeMap]
                          }`,
                        }}
                      />
                      <span
                        className="font-bold"
                        style={{
                          color: `#${
                            shadeMap[brandData?.color as keyof typeof shadeMap]
                          }`,
                        }}
                      >
                        {brandData?.color}
                      </span>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td
                    className={classNames(
                      "px-3 py-3.5 text-sm text-gray-500 table-cell",
                    )}
                  >
                    Industry
                  </td>
                  <td className="">
                    {brandData?.industry && INDUSTRIES[brandData?.industry]}
                  </td>
                </tr>
                <tr>
                  <td
                    className={classNames(
                      "px-3 py-3.5 text-sm text-gray-500 table-cell",
                    )}
                  >
                    Image URL
                  </td>
                  <td className="bg-gray-100 group hover:bg-gray-200 lg:table-cell">
                    <button
                      type="button"
                      className="relative inline-flex items-center justify-center px-3 py-3 font-mono text-xs text-gray-800 break-all gap-x-2"
                      onClick={() => {
                        navigator.clipboard.writeText(brandData?.image || "");
                        setCopied(true);
                      }}
                    >
                      {brandData?.image || ""}
                      <span>
                        {copied ? (
                          <svg
                            className="w-4 h-4 text-green-600"
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          >
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        ) : (
                          <svg
                            className="w-4 h-4 transition js-clipboard-default group-hover:rotate-6"
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          >
                            <rect
                              width="8"
                              height="4"
                              x="8"
                              y="2"
                              rx="1"
                              ry="1"
                            />
                            <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                          </svg>
                        )}
                      </span>
                      <span
                        className={`invisible absolute z-10 -translate-y-full px-2 py-1 text-xs font-medium text-white transition-opacity ${
                          copied ? "bg-green-500" : "bg-gray-900"
                        } rounded-lg shadow-sm group-hover:visible group-hover:opacity-100`}
                        role="tooltip"
                      >
                        {copied ? "Copied!" : "Copy"}
                      </span>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export function useCardModal() {
  const [brandData, setBrandData] = useState<Brand | null>(null);
  const [showCardModal, setShowCardModal] = useState<boolean>(false);

  useEffect(() => {
    setShowCardModal(!!brandData?.name)
  },[brandData])

  const CardModalCallback = useCallback(() => {
    return (
      <CardModal
        brandData={brandData}
        showCardModal={showCardModal}
        setShowCardModal={setShowCardModal}
      />
    );
  }, [brandData, showCardModal, setShowCardModal]);

  return useMemo(
    () => ({ setBrandData, CardModal: CardModalCallback }),
    [setBrandData, CardModalCallback],
  );
}
