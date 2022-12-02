import React, { useState,useEffect } from "react";
import PropTypes from "prop-types";
import nearicon from "../icons/near.svg";
import nativoLogo from "../assets/img/nativologocrop.png";
import nativoPlume from "../assets/img/pluma.png";
import mx from "../assets/img/mexico.png";
import usa from "../assets/img/estados-unidos.png";
import git from "../assets/img/git.png";
import medium from "../assets/img/Medium.png";
import twitter from "../assets/img/Twitterf.png";
import discord from "../assets/img/DiscordF.png";
import telegram from "../assets/img/Telegramf.png";
 
import { useTranslation } from "react-i18next";
import { ext_call, getNearAccount } from "../utils/near_interaction";
import { useWalletSelector } from "../utils/walletSelector";
import Swal from "sweetalert2";
function LightFooterB(props) {
  const [t, i18n] = useTranslation("global");
  const [isMex, setIsMex] = useState(true);

  const { selector, modal, accounts, accountId } = useWalletSelector();
  async function addNTVToken() {
    let account = await getNearAccount();
    let payload = {
      receiver_id: account,
      amount: "0",
      memo: ":",
    };
    Swal.fire({
      title: t("Footer.msg-ntv-title"),
      text: t("Footer.msg-ntv-desc"),
      icon: "warning",
      confirmButtonColor: "#E79211",
      confirmButtonText: t("Footer.msg-ntv-btn"),
    }).then(async (result) => {
      if (result.isConfirmed) {
        console.log("Transfer NTV");
        // ext_call(process.env.REACT_APP_CONTRACT_TOKEN,'ft_transfer', payload, 300000000000000,1)
        const wallet = await selector.wallet();
        wallet.signAndSendTransaction({
          signerId: accountId,
          receiverId: process.env.REACT_APP_CONTRACT_TOKEN,
          actions: [
            {
              type: "FunctionCall",
              params: {
                methodName: "ft_transfer",
                args: payload,
                gas: 300000000000000,
                deposit: 1,
              },
            },
          ],
        });
      }
    });
  }

  const handleLanguage = () => {
    console.log("entro");
    if (window.localStorage.getItem("LanguageState") == "en") {
      i18n.changeLanguage("es");
      window.localStorage.setItem("LanguageState", "es");
      setIsMex(true);
    } else {
      i18n.changeLanguage("en");
      window.localStorage.setItem("LanguageState", "en");
      setIsMex(false);
    }
  };

   



   
  
  return (
  <>
    { window.innerWidth <= 640 ?
      <footer name="Footer_sm"className="p-3 pb-12   text-gray-600 body-font dark:bg-black      ">
      <div className="   w-full lg:w-4/6 m-auto	 flex  justify-center   md:flex-row md:flex-nowrap flex-wrap flex-col     ">
        <div className="px-4  my-8  w-1/4 flex-shrink-0 flex flex-col   text-center md:text-left   self-start  ">
          <a
            href="./"
            className="flex title-font font-medium items-center   text-gray-900 "
          >
            <img
              src={nativoPlume}
              className="d-inline-block   align-top w-[100px]"
              alt="logo"
            />
          </a>

         





         
        </div>
        <div name="datos" className="flex flex-col w-full  ">
         

            <div name="community" className=" px-4 flex flex-col  w-full   ">
              <h2 className="title-font  text-gray-900 tracking-widest text-sm mb-3 dark:text-white capitalize font-raleway font-bold">
                {t("Footer.community")}
              </h2>
              <div name="social" className="w-full items-center flex  my-2   ">

                <div className="w-1/5 h-5 text-center">
                  <a
                    href="https://github.com/cloudmex/Nativo-NFT-UI"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 justify-center hover:text-[#ec8b01] hover:font-bold dark:text-white capitalize font-raleway font-normal text-sm"
                  >
                    <img className="h-5 my-2"   src={git}></img>
                  </a>
                </div>
               
                <div className="w-1/5 h-5  ">
                    <a
                      href="https://nativonft.medium.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600  hover:text-[#ec8b01] hover:font-bold dark:text-white capitalize font-raleway font-normal text-sm"
                    >
                      <img className="h-5 my-2" src={medium}></img>
                    </a>
                </div>

                <div className="w-1/5 h-5 lg:ml-2">
                  <a
                    href="https://twitter.com/nativonft"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600  hover:text-[#ec8b01] hover:font-bold dark:text-white capitalize font-raleway font-normal text-sm"
                  >
                    <img className="h-5 my-2" src={twitter}></img>
                  </a>
                </div>

                <div className="w-1/5 h-5">
                  <a
                    href="https://discord.gg/q2R6rtY4ks"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600  hover:text-[#ec8b01] hover:font-bold dark:text-white capitalize font-raleway font-normal text-sm"
                  >
                    <img className="h-5 my-2" src={discord}></img>
                  </a>
                </div>
                
                <div className="w-1/5 h-5">
                  <a
                    href="https://t.me/+TFdhJmJzwmkwNDQx"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600  hover:text-[#ec8b01] hover:font-bold dark:text-white capitalize font-raleway font-normal text-sm"
                  >
                    <img className="h-5 my-2" src={telegram}></img>
                  </a>
                </div>
              
              </div>
            
            </div>
            <div name="resources"  className="w-full mt-6 px-4 items-center" >
              <h2 className="title-font  text-gray-900 tracking-widest text-sm mb-2 dark:text-white capitalize font-raleway font-bold">
                {t("Footer.resources")}
              </h2>
              <nav className="list-none mb-10 w-full">
                <ul>
                  <li className="pt-4 w-full">
                    <a
                      href="https://docs.nativo.art/internal-wiki/tokenomics/tokenomics-y-gobernanza"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600  hover:text-[#ec8b01] hover:font-bold dark:text-white capitalize font-raleway font-normal text-sm"
                    >
                      {t("Footer.tokenomics")}
                    </a>
                  </li>
                  <li className="">
                    <a
                      href="https://docs.nativo.art"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600  hover:text-[#ec8b01] hover:font-bold dark:text-white capitalize font-raleway font-normal text-sm"
                    >
                      {t("Footer.docs")}
                    </a>
                  </li>
                  <li className="">
                    <a
                      href="https://docs.nativo.art/internal-wiki/terminos-legales/terminos-y-condiciones"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600  hover:text-[#ec8b01] hover:font-bold dark:text-white capitalize font-raleway font-normal text-sm"
                    >
                      {t("Footer.terms")}
                    </a>
                  </li>
                  <li className="">
                    <a
                      href="https://docs.nativo.art/internal-wiki/licencia-nft/licencia-nft"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600  hover:text-[#ec8b01] hover:font-bold dark:text-white capitalize font-raleway font-normal text-sm"
                    >
                      {t("Footer.nftLicense")}
                    </a>
                  </li>
                  <li className="">
                    <a
                      href="https://docs.nativo.art/internal-wiki/terminos-legales/politica-de-privacidad"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600  hover:text-[#ec8b01] hover:font-bold dark:text-white capitalize font-raleway font-normal text-sm"
                    >
                      {t("Footer.privPolicy")}
                    </a>
                  </li>
                  <li className="">
                    <a
                      href="https://docs.nativo.art/internal-wiki/terminos-legales/politica-de-creatividad"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600  hover:text-[#ec8b01] hover:font-bold dark:text-white capitalize font-raleway font-normal text-sm"
                    >
                      {t("Footer.creaPolicy")}
                    </a>
                  </li>
                </ul>
              </nav>
            </div>

            <div name="aboutUs" className=" px-4 w-full  ">
              <h2 className="title-font  text-gray-900 tracking-widest text-sm mb-3 dark:text-white capitalize font-raleway font-bold">
                {t("Footer.aboutUs")}
              </h2>
              <nav className="list-none mb-10">
                <ul>
                  <li className="pt-4">
                    <a
                      href="https://cloudmex.io/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600  hover:text-[#ec8b01] hover:font-bold dark:text-white capitalize font-raleway font-normal text-sm"
                    >
                      {t("Footer.aboutNativo")}
                    </a>
                  </li>
                  <li className="pb-4">
                    <a
                      href="https://cloudmex.io/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600  hover:text-[#ec8b01] hover:font-bold dark:text-white capitalize font-raleway font-normal text-sm"
                    >
                      {t("Footer.theTeam")}
                    </a>
                  </li>
                </ul>
              </nav>

              
            </div>

            <div name="addnft" className="  px-4 w-full flex flex-col ">
            <label className="w-full pt-2  text-sm pb-2  selection: text-white">
            {t("Footer.btn-NTV")}
          </label>
          <button
            className="bg-yellow2 w-1/3   text-white py-1 px-2 text-sm rounded-md"
            onClick={async () => {
              addNTVToken();
            }}
          >
            {" "}
            {t("Footer.btn-add")}
          </button>
            </div>
           
           
          </div>

          <div name="poweredBy" className="bg-transparent flex border-t-[.5px] mt-4 w-full px-4">
              <p className="w-2/3 mt-2 pr-6 text-gray-500 text-sm text-justify md:text-left dark:text-white font-open-sans font-bold">
                {t("Footer.tribu")}{" "}
                <a href="https://cloudmex.io/"> {t("Footer.cloudMx")}</a>
              </p>

              <div name="languagebtn" className="flex   w-1/3    ">
                <img className="h-16   " src={isMex ? mx : usa} />

               
                <button
                  className="hover:bg-yellow2  text-white   px-2   text-sm rounded-lg"
                  onClick={handleLanguage}
                >
                  <div className="flex flex-col">
                  <label className="  text-sm  ">
                  {" "}
                  {t("Navbar.language")}
                </label>
                <p className="text-[#616161]">
                {t("Navbar.change")}
                </p>
                

                  </div>
                  
                 
                </button>
              </div>
           
          </div>
        </div>
      
       
    </footer>
      :
    <footer name="Footer"className="p-3 pb-12  pt-12 text-gray-600 body-font dark:bg-black      ">
      <div className="   w-full lg:w-4/6 m-auto	 flex  justify-center   md:flex-row md:flex-nowrap flex-wrap flex-col     ">
        <div className=" w-1/4 flex-shrink-0 flex flex-col   text-center md:text-left   self-start  ">
          <a
            href="./"
            className="flex title-font font-medium items-center   text-gray-900 "
          >
            <img
              src={nativoPlume}
              className="d-inline-block   align-top w-[100px]"
              alt="logo"
            />
          </a>

          <label className="pt-6 pb-2  selection: text-white">
            {t("Footer.btn-NTV")}
          </label>
          <button
            className="bg-yellow2 w-1/2   text-white py-1 px-2 text-sm rounded-md"
            onClick={async () => {
              addNTVToken();
            }}
          >
            {" "}
            {t("Footer.btn-add")}
          </button>
        </div>

        <div name="datos" className="flex flex-col w-3/4 pr-1/4">
          <div
            name="sub-datos"
            className="flex-grow flex      md:text-left text-center "
          >
            <div name="resources"  className="lg:w-1/3 md:w-1/3 w-full px-4 items-center" >
              <h2 className="title-font  text-gray-900 tracking-widest text-sm mb-3 dark:text-white capitalize font-raleway font-bold">
                {t("Footer.resources")}
              </h2>
              <nav className="list-none mb-10 w-full">
                <ul>
                  <li className="pt-4 w-full">
                    <a
                      href="https://docs.nativo.art/internal-wiki/tokenomics/tokenomics-y-gobernanza"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600  hover:text-[#ec8b01] hover:font-bold dark:text-white capitalize font-raleway font-normal text-sm"
                    >
                      {t("Footer.tokenomics")}
                    </a>
                  </li>
                  <li className="">
                    <a
                      href="https://docs.nativo.art"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600  hover:text-[#ec8b01] hover:font-bold dark:text-white capitalize font-raleway font-normal text-sm"
                    >
                      {t("Footer.docs")}
                    </a>
                  </li>
                  <li className="">
                    <a
                      href="https://docs.nativo.art/internal-wiki/terminos-legales/terminos-y-condiciones"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600  hover:text-[#ec8b01] hover:font-bold dark:text-white capitalize font-raleway font-normal text-sm"
                    >
                      {t("Footer.terms")}
                    </a>
                  </li>
                  <li className="">
                    <a
                      href="https://docs.nativo.art/internal-wiki/licencia-nft/licencia-nft"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600  hover:text-[#ec8b01] hover:font-bold dark:text-white capitalize font-raleway font-normal text-sm"
                    >
                      {t("Footer.nftLicense")}
                    </a>
                  </li>
                  <li className="">
                    <a
                      href="https://docs.nativo.art/internal-wiki/terminos-legales/politica-de-privacidad"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600  hover:text-[#ec8b01] hover:font-bold dark:text-white capitalize font-raleway font-normal text-sm"
                    >
                      {t("Footer.privPolicy")}
                    </a>
                  </li>
                  <li className="">
                    <a
                      href="https://docs.nativo.art/internal-wiki/terminos-legales/politica-de-creatividad"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600  hover:text-[#ec8b01] hover:font-bold dark:text-white capitalize font-raleway font-normal text-sm"
                    >
                      {t("Footer.creaPolicy")}
                    </a>
                  </li>
                </ul>
              </nav>
            </div>

            <div name="aboutUs" className="lg:w-1/3 md:w-1/3 w-full  ">
              <h2 className="title-font  text-gray-900 tracking-widest text-sm mb-3 dark:text-white capitalize font-raleway font-bold">
                {t("Footer.aboutUs")}
              </h2>
              <nav className="list-none mb-10">
                <ul>
                  <li className="pt-4">
                    <a
                      href="https://cloudmex.io/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600  hover:text-[#ec8b01] hover:font-bold dark:text-white capitalize font-raleway font-normal text-sm"
                    >
                      {t("Footer.aboutNativo")}
                    </a>
                  </li>
                  <li className="pb-4">
                    <a
                      href="https://cloudmex.io/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600  hover:text-[#ec8b01] hover:font-bold dark:text-white capitalize font-raleway font-normal text-sm"
                    >
                      {t("Footer.theTeam")}
                    </a>
                  </li>
                </ul>
              </nav>
            </div>

            <div name="community" className="lg:w-1/3 flex flex-col md:w-1/3 w-full  ">
              <h2 className="title-font  text-gray-900 tracking-widest text-sm mb-3 dark:text-white capitalize font-raleway font-bold">
                {t("Footer.community")}
              </h2>
              <div name="social" className="w-full flex  md:flex-col lg:flex-row  ">
                <div className="w-1/5 h-5 my-2">
                  <a
                    href="https://github.com/cloudmex/Nativo-NFT-UI"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600  hover:text-[#ec8b01] hover:font-bold dark:text-white capitalize font-raleway font-normal text-sm"
                  >
                    <img   src={git}></img>
                  </a>
                </div>
               
                <div className="w-1/5 justify-center">
                    <a
                      href="https://nativonft.medium.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600  hover:text-[#ec8b01] hover:font-bold dark:text-white capitalize font-raleway font-normal text-sm"
                    >
                      <img className="h-5 my-2" src={medium}></img>
                    </a>
                </div>

                <div className=" w-1/5 lg:ml-2">
                  <a
                    href="https://twitter.com/nativonft"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600  hover:text-[#ec8b01] hover:font-bold dark:text-white capitalize font-raleway font-normal text-sm"
                  >
                    <img className="h-5 my-2" src={twitter}></img>
                  </a>
                </div>

                <div className=" w-1/5 ">
                  <a
                    href="https://discord.gg/q2R6rtY4ks"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600  hover:text-[#ec8b01] hover:font-bold dark:text-white capitalize font-raleway font-normal text-sm"
                  >
                    <img className="h-5 my-2" src={discord}></img>
                  </a>
                </div>
                
                <div className=" w-1/5 ">
                  <a
                    href="https://t.me/+TFdhJmJzwmkwNDQx"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600  hover:text-[#ec8b01] hover:font-bold dark:text-white capitalize font-raleway font-normal text-sm"
                  >
                    <img className="h-5 my-2" src={telegram}></img>
                  </a>
                </div>
              
              </div>
           
            </div>
          </div>

          <div name="poweredBy" className="bg-transparent ">
            <div className="container mx-auto py-4   flex   md:flex-col lg:flex-row border-t-[.5px] mt-4 border-white  justify-between ">
              <p className="text-gray-500 text-xs text-center md:text-left dark:text-white font-open-sans font-semibold">
                {t("Footer.tribu")}{" "}
                <a href="https://cloudmex.io/"> {t("Footer.cloudMx")}</a>
              </p>

              <div name="languagebtn" className="flex md:mt-4 lg:-mt-2  ">
                <img className="h-10 px-2 " src={isMex ? mx : usa} />

                <label className="  mt-2 text-sm px-2  ">
                  {" "}
                  {t("Navbar.language")}
                </label>
                <button
                  className="hover:bg-yellow2 md:w-1/2 text-white  px-2   text-sm rounded-lg"
                  onClick={handleLanguage}
                >
                  {t("Navbar.change")}
                  <a
                    hidden="true"
                    href="https://www.flaticon.es/iconos-gratis/estados-unidos"
                    title="estados unidos iconos"
                  >
                    Estados unidos iconos creados por Freepik - Flaticon
                  </a>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
          }
  </>
  
  );
}

LightFooterB.defaultProps = {
  theme: "indigo",
};

LightFooterB.propTypes = {
  theme: PropTypes.string.isRequired,
};

export default LightFooterB;
