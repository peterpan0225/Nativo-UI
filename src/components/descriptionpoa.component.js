import React from "react";
import croppedCA from '../assets/img/landing/sponsorsSection/cropped-CA.png';
import Union from '../assets/img/landing/sponsorsSection/Union.png';
import CloudMexColor from '../assets/img/landing/sponsorsSection/cloudMex-logo-color.png';
import certificate from  '../assets/img/landing/descriptionSection/certificate.png';
import story from  '../assets/img/landing/descriptionSection/storyofwork.png';
import share from  '../assets/img/landing/descriptionSection/sharepoa.png';

import { useTranslation } from "react-i18next";

function Sponsors() {
  const [t, i18n] = useTranslation("global");
  

  return (
    <section className="open-sans  h-[823px] lg:h-[594px] overflow-hidden bg-grayColor  " >
      <div className="w-full dark:flex flex-row flex-wrap justify-center my-16" >
        <div className=" w-full flex justify-around flex-wrap lg:flex-nowrap">
        <div className="w-full lg:w-1/3 lg:ml-12">
          <img
              className="h-[200px]  w-[300px] lg:w-[300px] mx-auto  lg:mx-0 lg:h-[275px] bg-center"
              src={certificate}
              fill="#000"
              alt={certificate}
            />
            <p className="text-[#5f014f] font-clash-grotesk font-semibold pt-4 text-2xl lg:text-4xl capitalize w-full  my-2 mx-auto  text-center lg:text-left">{t("Landingpoa.Certificate")}</p>
            <li className="desktop:text-2xl text-[#000] font-open-sans font-semibold text-base normal-case   w-5/6  my-2 mx-auto lg:mx-0 text-center lg:text-left">{t("Landingpoa.CertificateSub")}</li>
            <li className="desktop:text-2xl text-[#000] font-open-sans font-semibold text-base normal-case   w-5/6  my-2 mx-auto lg:mx-0 text-center lg:text-left">{t("Landingpoa.CertificateSub1")}</li>
            <li className="desktop:text-2xl text-[#000] font-open-sans font-semibold text-base normal-case   w-5/6  my-2 mx-auto lg:mx-0 text-center lg:text-left">{t("Landingpoa.CertificateSub2")}</li>
          </div>
          <div className="w-full lg:w-1/3 lg:ml-12">
          <img
              className="h-[200px]  w-[300px] lg:w-[335px] mx-auto  lg:mx-0 lg:h-[275px] bg-center"
              src={story}
              fill="#000"
              alt={story}
            />
            <p className="text-[#5f014f] font-clash-grotesk font-semibold pt-4 text-2xl lg:text-4xl capitalize w-full  my-2 mx-auto  text-center lg:text-left">{t("Landingpoa.Story")}</p>
            <li className="desktop:text-2xl text-[#000] font-open-sans font-semibold text-base normal-case   w-5/6  my-2 mx-auto lg:mx-0 text-center lg:text-left">{t("Landingpoa.StorySub")}</li>
            <li className="desktop:text-2xl text-[#000] font-open-sans font-semibold text-base normal-case   w-5/6  my-2 mx-auto lg:mx-0 text-center lg:text-left">{t("Landingpoa.StorySub1")}</li>
          </div>
          <div className="w-full lg:w-1/3 lg:ml-12">
          <img
              className="h-[200px]  w-[300px] lg:w-[275px] mx-auto  lg:mx-0 lg:h-[275px] bg-center"
              src={share}
              fill="#000"
              alt={share}
            />
            <p className="text-[#5f014f] font-clash-grotesk font-semibold pt-4 text-2xl lg:text-4xl capitalize w-full  my-2 mx-auto  text-center lg:text-left">{t("Landingpoa.Share")}</p>
            <li className="desktop:text-2xl text-[#000] font-open-sans font-semibold text-base normal-case   w-3/4  my-2 mx-auto lg:mx-0 text-center lg:text-left">{t("Landingpoa.ShareSub")}</li>
            <li className="desktop:text-2xl text-[#000] font-open-sans font-semibold text-base normal-case   w-3/4  my-2 mx-auto lg:mx-0 text-center lg:text-left">{t("Landingpoa.ShareSub1")}</li>
          </div>
        </div>
      </div>
    </section>
  );
}


export default Sponsors;
