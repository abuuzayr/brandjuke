import Balancer from "react-wrap-balancer"
import Image from "next/image";
import { INDUSTRIES } from "@/lib/constants";
import Tooltip from "@/components/shared/tooltip";


const shadeMap = {
  red: "FF0000",
  orange: "FFA500",
  yellow: "FFFF00",
  green: "008000",
  blue: "0000FF",
  violet: "EE82EE",
  brown: "A52A2A",
  black: "000000",
  grey: "808080",
  white: "FFFFFF",
}

export default function Card({
  name,
  image,
  industry,
  color
}: {
  name: string;
  image: string;
  industry: number;
  color: string;
}) {
  return (
    <div
      className="relative col-span-1 overflow-hidden bg-white border border-gray-200 shadow-md h-80 rounded-xl"
    >
      <Tooltip content={
        <div className="p-2">
          <span className="block max-w-xs text-sm text-center text-gray-700">
            Base color: <span className="font-bold" style={{ color: `#${shadeMap[color as keyof typeof shadeMap]}` }}>{color}</span>
          </span>
        </div>}>
        <div className="absolute right-0 float-right w-4 h-4 mt-3 mr-3 rounded-full" style={{ backgroundColor: `#${shadeMap[color as keyof typeof shadeMap]}` }} />
      </Tooltip>
      <div className="flex items-center justify-center h-60">
        <Image
          src={image}
          alt={`${name} brand logo`}
          className="h-50 w-50"
          width={120}
          height={120}
        />
      </div>
      <div className="flex flex-col items-center justify-center w-full h-20 max-w-md mx-auto text-center font-display drop-shadow-sm">
        <Balancer>{name}</Balancer>
        <span className="w-4/5 text-xs">{INDUSTRIES[industry]}</span>
      </div>
    </div>
  );
}
