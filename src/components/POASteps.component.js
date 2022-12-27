import React, { Fragment, useEffect, useState } from "react";
import PropTypes from "prop-types";
import wallet from '../assets/img/Wallet.png';
import pincel from '../assets/img/Pincel.png';
import colecciones from '../assets/img/Colecciones.png';
import label from '../assets/img/Label.png';
import { useTranslation } from "react-i18next";
import { nearSignIn } from "../utils/near_interaction";
import Certificate_Icon from "../assets/img/landing/thirdSection/Certificate.png";
import Ellipse_7 from "../assets/img/landing/thirdSection/Ellipse_7.png";
import Money_Icon from "../assets/img/landing/thirdSection/shareicon.png";
import NFTImage_Icon from "../assets/img/landing/thirdSection/NFTImage_Icon2.png";
import Wallet_Icon from "../assets/img/landing/thirdSection/Wallet_Icon2.png";
import rigth_arrow from "../assets/img/landing/thirdSection/arrow-right-purple.png";
import POAStepsCard from "./POAStepsCard.component";
import { render } from "@testing-library/react";
import { Account } from "near-api-js";
import { useWalletSelector } from "../utils/walletSelector";



function NftSteps(props) {
  const [t, i18n] = useTranslation("global");
  const { selector, modal, accounts, accountId } = useWalletSelector();
  const steps = [
    {
      imgSrc: Wallet_Icon,
      bgSrc: Ellipse_7,
      text: t("Landingpoa.steps-connect"),
      sub: t("Landingpoa.steps-sub1"),
      arrow: rigth_arrow,
      redirect: "market"
    },
    {
      imgSrc: Certificate_Icon,
      bgSrc: Ellipse_7,
      text: t("Landingpoa.steps-create"),
      sub: t("Landingpoa.steps-sub2"),
      arrow: rigth_arrow,
      redirect: "collectionData/create"
    },
    {
      imgSrc: NFTImage_Icon,
      bgSrc: Ellipse_7,
      text: t("Landingpoa.steps-add"),
      sub: t("Landingpoa.steps-sub3"),
      arrow: rigth_arrow,
      redirect: "create"
    },
    {
      imgSrc: Money_Icon,
      bgSrc: Ellipse_7,
      text: t("Landingpoa.steps-sell"),
      sub: t("Landingpoa.steps-sub4"),
      arrow: rigth_arrow,
      redirect: accountId != null ? "profile/" + accountId.split('.')[0] :  ""
    }
  ];

  function createCollectionRoute() {
    window.location.href = '/collectionData/create';
  }

  function createNFTRoute() {
    window.location.href = '/create';
  }

  function sellNFTRoute() {
    window.location.href = '/mynfts';
  }

  
  return (
    <section className="text-gray-600 body-font bg-gray-100 dark:bg-darkgray h-[758px] lg:h-[433px] bg-steps-background lg:bg-Crea_y_comparte_tus_POAs bg-no-repeat bg-cover bg-center">
      <div className="container w-full px-3 pt-[72px] pb-28  mx-auto flex flex-row flex-wrap justify-center lg:justify-start ">
        <div className="w-full flex flex-col lg:flex-row text-left lg:ml-[15px]" data-aos="fade-down" data-aos-delay="200">
          <h2 className="dark:text-white   font-clash-grotesk font-semibold text-4xl  lg:text-5xl text-left">{t("Landingpoa.steps-title")} &nbsp;</h2> 
          <h2 className="dark:text-white   font-clash-grotesk font-semibold text-4xl  lg:text-5xl text-left">{t("Landingpoa.steps-title2")}</h2>
        </div>
        <div className="w-full flex flex-row flex-wrap lg:flex-nowrap mt-[12px] lg:mt-[50px]">
        {steps.map((card, i) => {
            return (
            <POAStepsCard card={card} key={i}/>
            )
          })}

        </div>
      </div>
    </section>
  );
}


export default NftSteps;
