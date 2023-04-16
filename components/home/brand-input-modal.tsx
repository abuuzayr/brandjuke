import Modal from "@/components/shared/modal";
import {
  useState,
  Dispatch,
  SetStateAction,
  useCallback,
  useMemo,
} from "react";
import { INDUSTRIES } from "@/lib/constants";
import Checkmark from "@/components/shared/icons/checkmark";
import { toast } from "react-hot-toast";

const BrandInputModal = ({
  showBrandInputModal,
  setShowBrandInputModal,
}: {
  showBrandInputModal: boolean;
  setShowBrandInputModal: Dispatch<SetStateAction<boolean>>;
}) => {
  const [brandName, setBrandName] = useState("");
  const [brandImage, setBrandImage] = useState("");
  const [industry, setIndustry] = useState(-1);
  const [loading, setLoading] = useState(false);
  const [brandImageLoaded, setBrandImageLoaded] = useState(false);

  const disableSubmit = useMemo(() => {
    return !brandName || !brandImageLoaded || industry < 0 || loading; 
  }, [brandName, brandImageLoaded, industry, loading]);

  return (
    <Modal showModal={showBrandInputModal} setShowModal={setShowBrandInputModal}>
      <div className="w-full overflow-hidden shadow-xl md:max-w-md md:rounded-2xl md:border md:border-gray-200">
        <div className="w-full bg-white">

          <form
            onSubmit={async (e) => {
              e.preventDefault();
              setLoading(true);
              const loadingToastID = toast.loading("Adding brand...");
              fetch("/api/brands/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: brandName, image: brandImage, industry }),
              })
                .then(async (res) => {
                  if (res.status === 200) {
                    toast.dismiss(loadingToastID);
                    toast.success("Brand added!")
                    setShowBrandInputModal(false);
                  } else if (res.status === 413) {
                    throw new Error("Error adding brand - file too large. Try a smaller image?")
                  } else {
                    throw new Error("Error adding brand - try again?")
                  }
                })
                .catch((e) => {
                  toast.dismiss(loadingToastID);
                  setLoading(false);
                  toast.error(e.message);
                });
            }}>

            <div className="flex flex-col px-4 py-6 space-y-4 md:px-8">
              <h3 className="text-2xl font-bold text-center font-display">Add a Brand</h3>
              <div>
                <label htmlFor="name" className="block mb-1 text-xs font-semibold text-gray-400 uppercase">Brand name</label>

                <div className="relative">
                  <input
                    type="text"
                    className="w-full p-2 pr-12 text-sm border-gray-200 rounded-lg shadow-sm"
                    placeholder="e.g. Nike"
                    onChange={(e) => setBrandName(e.target.value)}
                  />
                  {brandName && <Checkmark />}
                </div>
              </div>

              <div>
                <label htmlFor="url" className="block mb-1 text-xs font-semibold text-gray-400 uppercase">Logo URL</label>

                <div className="relative">
                  <input
                    type="text"
                    className="w-full p-2 pr-12 text-sm border-gray-200 rounded-lg shadow-sm"
                    placeholder="e.g. https://www.nike.com/logo.png"
                    onChange={(e) => setBrandImage(e.target.value)}
                  />
                  {brandImageLoaded && <Checkmark />}
                </div>
                <span className="text-xs text-gray-500"><strong>Recommended:</strong> At least 600px height/width or SVGs</span>
              </div>

              <div>
                <label htmlFor="industry" className="block mb-1 text-xs font-semibold text-gray-400 uppercase">Industry</label>

                <div className="relative">
                  <div className="mt-2">
                    <select
                      id="industry"
                      name="industry"
                      autoComplete="industry-name"
                      className="w-full p-2 pr-12 text-sm border-gray-200 rounded-lg shadow-sm"
                      onChange={(e) => setIndustry(parseInt(e.target.value))}
                      value={industry}
                      >
                        <option value="-1"></option>
                      {Object.values(INDUSTRIES).filter((i: any) => isNaN(i)).map((i: any) => <option key={i} value={INDUSTRIES[i]}>{i}</option>)}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-8">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className={`w-full h-48 object-contain p-5 ${brandImageLoaded ? '' : 'hidden'}`}
                src={brandImage}
                onLoad={() => setBrandImageLoaded(true)}
                onError={() => setBrandImageLoaded(false)}
                alt="Brand Logo"
              />
              <div className={`px-8 h-48 bg-gray-100 rounded-lg flex items-center justify-center font-semibold ${brandImageLoaded ? 'hidden': ''}`}>
                {brandImage ? <span className="text-red-400">Invalid image URL</span> : <span className="text-gray-400">Image preview</span>}
              </div>
              <span className="pt-4 text-xs text-gray-500"><strong>Note:</strong> Upload will fail if file size is more than 2MB</span>
            </div>

            <div className="flex flex-col py-4 bg-gray-50 md:px-8">
              <button
                type="submit"
                disabled={disableSubmit}
                className="block w-full px-5 py-3 text-sm font-medium text-yellow-600 transition duration-200 bg-yellow-200 rounded-lg hover:bg-yellow-300 disabled:bg-gray-200 disabled:cursor-not-allowed disabled:text-gray-400"
              >
                Submit
              </button>
            </div>
          </form>

        </div>
      </div>
    </Modal>
  );
};

export function useBrandInputModal() {
  const [showBrandInputModal, setShowBrandInputModal] = useState(false);

  const BrandInputModalCallback = useCallback(() => {
    return (
      <BrandInputModal
        showBrandInputModal={showBrandInputModal}
        setShowBrandInputModal={setShowBrandInputModal}
      />
    );
  }, [showBrandInputModal, setShowBrandInputModal]);

  return useMemo(
    () => ({ setShowBrandInputModal, BrandInputModal: BrandInputModalCallback }),
    [setShowBrandInputModal, BrandInputModalCallback],
  );
}
