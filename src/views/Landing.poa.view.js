import React, { useEffect } from "react";

//components
import POAHero from "../components/POA.component";
import Steps from "../components/steps.component";
import POASteps from "../components/POASteps.component";
import Statisct from "../components/statistc.component";
import Popular_col from "../components/PopularCollections.component";
import POAs from "../components/POAs.component";
import Sponsors from "../components/sponsors.component";
import Aos from "aos";
import "aos/dist/aos.css";
import { useTranslation } from "react-i18next";


export default function LandingPoA() {
  const [Landing, setLanding] = React.useState({ theme: "yellow" });
  window.localStorage.setItem("page",0);
  window.localStorage.setItem("auctionpage",0);
  window.localStorage.setItem("tokenspage",30);
  useEffect(() => {
    Aos.init({
      duration:2000,
      once: true
    });
  });
  return (
    <div>
      <POAHero />
      <POASteps/>
      <Sponsors />
    </div>
  );
}
