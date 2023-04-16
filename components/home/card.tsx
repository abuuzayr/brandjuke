import Balancer from "react-wrap-balancer"
import Image from "next/image";
import { INDUSTRIES } from "@/lib/constants";

export default function Card({
  name,
  image,
  industry
}: {
  name: string;
  image: string;
  industry: number;
}) {
  return (
    <div
      className="relative col-span-1 h-80 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-md"
    >
      <div className="flex h-60 items-center justify-center">
        <Image
          src={image}
          alt={`${name} brand logo`}
          className="h-50 w-50"
          width={120}
          height={120}
        />
      </div>
      <div className="mx-auto max-w-md text-center h-20 flex flex-col items-center justify-center w-full font-display drop-shadow-sm">
        <Balancer>{name}</Balancer>
        <span className="w-4/5 text-xs">{INDUSTRIES[industry]}</span>
      </div>
    </div>
  );
}
