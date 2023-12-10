import React, { Fragment } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { shadeMap } from "../home/card";
import { ChevronsUpDown, Check } from "lucide-react";

const SelectComponent = ({
  label,
  placeholder,
  options,
  selectedOptions,
  onChangeFunc,
}: {
  label: string;
  placeholder: string;
  options: { value: string; label: string }[];
  selectedOptions: string;
  onChangeFunc: (colors: string) => void;
}) => {
  return (
    <Listbox
      value={selectedOptions.split(",")}
      onChange={(s) => onChangeFunc(s.join(","))}
      multiple
    >
      <div className="relative w-full mt-1 md:w-4/5">
        <Listbox.Label className="text-[10px] font-semibold uppercase text-gray-400">
          {label}
        </Listbox.Label>
        <Listbox.Button className="w-full py-2 pl-3 pr-10 m-auto text-left bg-white rounded-lg shadow-md cursor-default focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
          <span className="block truncate">
            {selectedOptions
              .split(",")
              .map((o) => options.find((option) => option.value === o)?.label)
              .filter(Boolean)
              .join(", ") || placeholder}
          </span>
          <span className="absolute right-0 flex items-center pr-2 pointer-events-none top-8">
            <ChevronsUpDown
              className="w-5 h-5 text-gray-400"
              aria-hidden="true"
            />
          </span>
        </Listbox.Button>
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Listbox.Options className="w-full py-1 mt-1 overflow-auto text-base bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            {options.map((option) => (
              <Listbox.Option
                key={option.value}
                value={option.value}
                className={({ selected }) =>
                  `relative cursor-default select-none py-2 pl-10 pr-4 ${
                    selected ? "bg-amber-100 text-amber-900" : "text-gray-900"
                  }`
                }
              >
                {({ selected }) => (
                  <div className="flex items-start">
                    {Object.keys(shadeMap).includes(option.value) && (
                      <div
                        className="w-5 h-5 mr-2 bg-white border-2 rounded-full outline-none appearance-none shadow-black"
                        style={{
                          borderColor: `#${
                            shadeMap[option.value as keyof typeof shadeMap]
                          }`,
                        }}
                      />
                    )}
                    <span
                      className={`block truncate ${
                        selected ? "font-medium" : "font-normal"
                      }`}
                    >
                      {option.label}
                    </span>
                    {selected ? (
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                        <Check className="w-5 h-5" aria-hidden="true" />
                      </span>
                    ) : null}
                  </div>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  );
};

export default SelectComponent;
