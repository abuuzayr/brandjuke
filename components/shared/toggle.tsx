import React, { useState } from 'react';
import * as Toggle from '@radix-ui/react-toggle';
import { shadeMap } from '../home/card';

const ToggleComponent = ({ color }: { color: string }) => {
    const [pressed, setPressed] = useState(false);
    const shade = shadeMap[color as keyof typeof shadeMap];
    return (
    <Toggle.Root
        aria-label={`Toggle ${color} filter`}
            className={`state-on:bg-shade-${color} state-on:text-white state-off:bg-none relative px-1 text-xs border-shade-${color} border-2 rounded-md text-shade-${color} capitalize font-semibold`}
        pressed={pressed}
        onPressedChange={(pressed) => {
            setPressed(pressed)
        }}
    >
        {color.toUpperCase()}
    </Toggle.Root>
)};

export default ToggleComponent;