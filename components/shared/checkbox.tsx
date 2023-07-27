import React from 'react';
import * as Checkbox from '@radix-ui/react-checkbox';
import { CheckIcon } from '@radix-ui/react-icons';
import { shadeMap } from '../home/card';
import { NextRouter } from 'next/router';

const CheckboxComponent = ({ color, checked, onClickFunc, router }: { color: string, checked: boolean, onClickFunc: (a: any) => void, router: NextRouter }) => (
    <form>
        <div className="relative flex items-center pb-2">
            <Checkbox.Root
                className="flex items-center justify-center w-5 h-5 bg-white border-2 rounded-full outline-none appearance-none shadow-black"
                id={`checkbox-${color}`}
                checked={checked}
                onCheckedChange={(checked) => {
                    onClickFunc((prevFilters: string) => {
                        let filtersArray = prevFilters ? prevFilters.split(",") : [];
                        if (checked) {
                            filtersArray = [...filtersArray, color];
                        } else {
                            filtersArray = filtersArray.filter((f) => f !== color);
                        }
                        const { colors, ...routerWithoutColors } = router.query
                        router.push({
                            pathname: "/",
                            query: { ...routerWithoutColors, ...(filtersArray.length && { colors: filtersArray.join(",") }) }
                        }, undefined, { shallow: true })
                        return filtersArray.join(",")
                    });
                }}
                style={{
                    borderColor: `#${shadeMap[color as keyof typeof shadeMap]}`
                }} 
            >
                <Checkbox.Indicator className="text-black">
                    <CheckIcon />
                </Checkbox.Indicator>
            </Checkbox.Root>
            {/* <div className={`w-2 h-2 rounded-full ml-4`}/> */}
            <label className={`pl-[15px] text-[15px] leading-none capitalize`} htmlFor={`checkbox-${color}`}>
                {color}
            </label>
        </div>
    </form>
);

export default CheckboxComponent;