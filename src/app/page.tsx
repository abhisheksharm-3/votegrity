import Footer from "@/components/Footer";
import Layout from "@/components/Layout";
import { Button } from "@nextui-org/react";
import { FaEthereum } from "react-icons/fa";
import Image from "next/image";

export default function Home() {
  return (
    <Layout>
      <div className="flex items-center justify-around z-[9999]">
        {" "}
        <div className="translate-y-6">
          <Image
            src="/images/hero.svg"
            alt="hero image"
            width={600}
            height={500}
          />
        </div>
        <div className="flex flex-col justify-center items-start gap-8">
          <span className="uppercase text-gray-400">
            Be a Part of Decision!
          </span>
          <h1 className="font-playfair text-8xl font-bold">Vote Today.</h1>
          <span>
            An online voting system that will replace <br /> the centralized
            voting system.
          </span>
          <div className="flex gap-5">
            <Button className="bg-maindark text-white uppercase font-normal tracking-widest">
              Register
            </Button>{" "}
            <Button
              className="text-maindark uppercase font-normal tracking-widest"
              variant="bordered"
            >
              Read More
            </Button>
          </div>
          <span className="flex gap-5 items-center">
            {" "}
            <FaEthereum className="text-[#72a269] text-3xl" />{" "}
            <span className="text-gray-400 text-sm">
              Backed by Ethereum Technology
            </span>
          </span>
        </div>
      </div>
      <Footer />
    </Layout>
  );
}
