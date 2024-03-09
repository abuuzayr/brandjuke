/* eslint-disable @next/next/no-img-element */
import satori from 'satori';
import { readFileSync } from 'fs'
import { NextApiRequest, NextApiResponse } from "next";

export const alt = "⚡️ BrandJuke - Logo inspiration and API";
export const contentType = "image/svg+xml";

const ogImage = async (req: NextApiRequest, res: NextApiResponse) => {
    const svg = await satori(
        <div
            style={{
                height: "100%",
                width: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "white",
                backgroundImage:
                    "linear-gradient(to bottom right, #E0E7FF 25%, #ffffff 50%, #FED7AA 99.5%)",
            }}
        >
            <img
                src="https://www.brandjuke.com/logo.png"
                alt="BrandJuke Logo"
                // @ts-ignore
                tw="w-20 h-20 mb-4 opacity-95"
            />
            <h1
                style={{
                    fontSize: "100px",
                    fontFamily: "SF Pro",
                    background:
                        "linear-gradient(to bottom right, #000000 21.66%, #78716c 86.47%)",
                    backgroundClip: "text",
                    color: "transparent",
                    lineHeight: "5rem",
                    letterSpacing: "-0.02em",
                }}
            >
                BrandJuke
            </h1>
        </div>,
        {
            width: 1200,
            height: 630,
            fonts: [
                {
                    name: 'SF Pro',
                    data: readFileSync('public/fonts/SF-Pro-Display-Medium.otf'),
                },
            ],
        },
    )
    res.statusCode = 200;
    res.setHeader('Content-Type', 'image/svg+xml')
    res.send(svg)
}

export default ogImage;