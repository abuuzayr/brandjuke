import { useState } from "react";
import Popover from "@/components/shared/popover";
import Tooltip from "@/components/shared/tooltip";
import { ChevronDown } from "lucide-react";

export default function ComponentGrid() {
  const [openPopover, setOpenPopover] = useState(false);
  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
      <button
        onClick={() => {}}
        className="flex items-center justify-center w-40 px-3 py-2 transition-all duration-75 border border-gray-300 rounded-md hover:border-gray-800 focus:outline-none active:bg-gray-100"
      >
        <p className="text-gray-600">Modal</p>
      </button>
      <Popover
        content={
          <div className="w-full p-2 bg-white rounded-md sm:w-40">
            <button className="flex items-center justify-start w-full p-2 space-x-2 text-sm text-left transition-all duration-75 rounded-md hover:bg-gray-100 active:bg-gray-200">
              Item 1
            </button>
            <button className="flex items-center justify-start w-full p-2 space-x-2 text-sm text-left transition-all duration-75 rounded-md hover:bg-gray-100 active:bg-gray-200">
              Item 2
            </button>
            <button className="flex items-center justify-start w-full p-2 space-x-2 text-sm text-left transition-all duration-75 rounded-md hover:bg-gray-100 active:bg-gray-200">
              Item 3
            </button>
          </div>
        }
        openPopover={openPopover}
        setOpenPopover={setOpenPopover}
      >
        <button
          onClick={() => setOpenPopover(!openPopover)}
          className="flex items-center justify-between w-40 px-4 py-2 transition-all duration-75 border border-gray-300 rounded-md hover:border-gray-800 focus:outline-none active:bg-gray-100"
        >
          <p className="text-gray-600">Popover</p>
          <ChevronDown
            className={`h-4 w-4 text-gray-600 transition-all ${
              openPopover ? "rotate-180" : ""
            }`}
          />
        </button>
      </Popover>
      <Tooltip content="Brandjuke is an open-source collection of brand logos for your inspiration and consumption">
        <div className="flex items-center justify-center w-40 px-3 py-2 transition-all duration-75 border border-gray-300 rounded-md cursor-default hover:border-gray-800 focus:outline-none active:bg-gray-100">
          <p className="text-gray-600">Tooltip</p>
        </div>
      </Tooltip>
    </div>
  );
}
