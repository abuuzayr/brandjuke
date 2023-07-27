import React from "react";
import * as Checkbox from "@radix-ui/react-checkbox";
import { CheckIcon } from "@radix-ui/react-icons";
import { shadeMap } from "../home/card";
import { NextRouter } from "next/router";

const SelectBox = ({
  text,
  checked,
  onClickFunc,
  router,
}: {
  text: string;
  checked: boolean;
  onClickFunc: (a: any) => void;
  router: NextRouter;
}) => {
  const encodedText = encodeURIComponent(text).toLowerCase();
  return (
    <form>
      <div className="relative flex items-center pb-2">
        <Checkbox.Root
          className="group"
          checked={checked}
          id={`checkbox-${encodedText}`}
          onCheckedChange={(checked) => {
            onClickFunc((prevFilters: string) => {
              let filtersArray = prevFilters ? prevFilters.split(",") : [];
              if (checked) {
                filtersArray = [...filtersArray, encodedText];
              } else {
                filtersArray = filtersArray.filter((f) => f !== encodedText);
              }
              const { industries, ...routerWithoutIndustries } = router.query;
              router.push(
                {
                  pathname: "/",
                  query: {
                    ...routerWithoutIndustries,
                    ...(filtersArray.length && {
                      industries: filtersArray.join(","),
                    }),
                  },
                },
                undefined,
                { shallow: true },
              );
              return filtersArray.join(",");
            });
          }}
        >
          <Checkbox.Indicator className="hidden appearance-none">
            <CheckIcon />
          </Checkbox.Indicator>
          <label
            className={`group-data-[state=unchecked]:text-black'} rounded-md border-2 border-black px-2 py-1 text-xs font-bold uppercase leading-none group-data-[state="checked"]:bg-black group-data-[state=unchecked]:bg-none group-data-[state="checked"]:text-white`}
            htmlFor={`checkbox-${encodedText}`}
          >
            {text}
          </label>
        </Checkbox.Root>
      </div>
    </form>
  );
};

export default SelectBox;
