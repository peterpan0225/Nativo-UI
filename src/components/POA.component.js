import React, { useCallback, useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import ImageSlider from "./imageSlider.component";
import { useWalletSelector } from "../utils/walletSelector";
import { useTranslation } from "react-i18next";
import verifyImage from '../assets/img/Check.png';
import rocket from '../assets/img/Rocket.png';
import arrowRight from '../assets/img/landing/firstSection/ARROW.png';
import certificado from '../assets/img/landing/firstSection/certificado.png';
import plus from '../assets/img/landing/firstSection/plus.png';


function LightHeroE(props) {
  const { selector, modal, accounts, accountId } = useWalletSelector();
  const [t, i18n] = useTranslation("global");
  const [stateLogin, setStateLogin] = useState(false);

  useEffect(() => {
    (async () => {
      setStateLogin(accountId !=null ? true : false);
    })();
  }, []);

  const handleSignIn = () =>{
    modal.show()
  }

  return (
    <section className="text-gray-600 body-font bg-Hero_poa_mobile lg:bg-Hero_poa h-[823px] lg:h-[594px] bg-no-repeat bg-cover bg-top ">
      <div className="container mx-auto lg:pl-28 flex px-5 lg:px-0 pb-10 flex-col items-center  lg:items-start  justify-center ">
        <div className=" h-[823px] lg:h-[594px] lg:flex-grow  flex flex-col md:text-left items-center lg:items-start" >
          <div className="w-full z-20 mt-[90px] lg:mt-[100px] ">
            <h2 className="dark:text-white text-[42px]  lg:text-6xl md:text-6xl font-clash-grotesk font-semibold leading-9 tracking-wider text-left w-[343px] lg:w-[700px]">{t("Landingpoa.title") + " " +t("Landingpoa.title-2")}</h2>
          </div>
          <p className="mt-[18px] lg:mt-[23px] lg:text-1xl text-base dark:text-white z-20 font-open-sans font-semibold text-left leading-6 tracking-wider w-[343px] lg:w-[630px]">
            {t("Landingpoa.subtitle")}
          </p>
          <div className="flex flex-col lg:flex-row justify-between z-20">
            <a href="https://forms.gle/YBHbAHFcdRKEEuvV8">
            <button className="flex inline-flex rounded-xlarge w-full lg:w-[267px] h-[50px] lg:mr-11  mt-0 ">
                <div className="flex flex-col font-bold h-full text-white  text-center  justify-center shadow-s w-full bg-yellow4 hover:bg-yellowHover active:bg-yellowPressed rounded-md">
                <svg className="fill-current w-[342px] h-[48px] mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M13 8V2H7v6H2l8 8 8-8h-5zM0 18h20v2H0v-2z"/></svg>
                  <span className="title-font  text-white font-open-sans font-normal lg:font-semibold text-base p-5 uppercase leading-6">{t("Landingpoa.register")} </span>
                </div>
            </button>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

LightHeroE.defaultProps = {
  theme: "indigo",
};

LightHeroE.propTypes = {
  theme: PropTypes.string.isRequired,
};

export default LightHeroE;
