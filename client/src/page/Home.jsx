import React from "react";
import HeroSection from "../components/HeroSection";
import { BookOpenText } from "lucide-react";
import Features from "../components/Features";
import LevelCards from "../components/LevelCards";
import ProgressSection from "../components/ProgressSection";
import CTASection from "../components/CTASection";
function Home() {
  return (
    <>
      <div>
        <HeroSection />
      </div>
      <h1 className=" pt-5 text-4xl font-bold text-black  text-center ">
        Why Choose US
      </h1>
      <div>
        <div>
          <Features />
        </div>
        <div>
          <LevelCards />
        </div>
        <div>
          <ProgressSection />
        </div>
        <div>
          <CTASection />
        </div>
      </div>
    </>
  );
}

export default Home;
