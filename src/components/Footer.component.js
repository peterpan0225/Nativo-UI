import React, { useState,useEffect } from "react";
import PropTypes from "prop-types";
import nearicon from "../icons/near.svg";
import nativoLogo from "../assets/img/nativologocrop.png";
import nativoPlume from "../assets/img/pluma.png";
import mx from "../assets/img/mexico.png";
import usa from "../assets/img/estados-unidos.png";
import git from "../assets/img/github.svg";
import medium from "../assets/img/medium.svg";
import twitter from "../assets/img/twitter.svg";
import discord from "../assets/img/DiscordF.svg";
import telegram from "../assets/img/telegramsvg.svg";
 
import { useTranslation } from "react-i18next";
import { ext_call, getNearAccount } from "../utils/near_interaction";
import { useWalletSelector } from "../utils/walletSelector";
import Swal from "sweetalert2";
function LightFooterB(props) {
  const [t, i18n] = useTranslation("global");
  const [isMex, setIsMex] = useState(false);

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

  useEffect(() => {
   

    if (window.localStorage.getItem("LanguageState") == "es") {
       setIsMex(true);
    } else {
      window.localStorage.setItem("LanguageState","en")
      setIsMex(false);
    }
  },[]);


   
  
  return (
    <>
      <footer
        name="Footer"
        className="p-3 pb-12  pt-12 text-gray-600 body-font dark:bg-black      "
      >
        <div className="   w-full lg:w-4/6 m-auto	 flex  justify-center   md:flex-row md:flex-nowrap flex-wrap flex-col     ">
          <div className=" px-4 w-1/4 flex-shrink-0 flex flex-col   text-center md:text-left   self-start  ">
            <a
              href="./"
              className="flex title-font font-medium items-center   text-gray-900 "
            >
              <img
                src={nativoPlume}
                className="d-inline-block   align-top w-[74px]"
                alt="logo"
              />
            </a>

            <label className="pt-6 pb-2 hidden md:block selection: text-white">
              {t("Footer.btn-NTV")}
            </label>
            <button
              className="bg-yellow2  hover:scale-125 w-1/2 hidden md:block   text-white py-1 px-2 text-sm rounded-md"
              onClick={async () => {
                addNTVToken();
              }}
            >
              {" "}
              {t("Footer.btn-add")}
            </button>
          </div>

          <div
            name="datos"
            className="flex px-4  flex-col w-full md:w-3/4 pr-1/4"
          >
            <div
              name="sub-datos"
              className=" flex flex-col md:flex-grow md:flex  md:flex-row     text-left   "
            >
              <div name="add_my_tokens" className="order-4">
                <label className="pt-6 pb-2 md:hidden block selection: text-white">
                  {t("Footer.btn-NTV")}
                </label>
                <button
                  className="bg-yellow2 hover:scale-125 w-1/2 md:hidden block   text-white py-1 px-2 text-sm rounded-md"
                  onClick={async () => {
                    addNTVToken();
                  }}
                >
                  {" "}
                  {t("Footer.btn-add")}
                </button>
              </div>

              <div  name="resources" className="lg:w-1/3 md:w-1/3 w-full items-center order-2 md:order-1"
              >
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

              <div name="aboutUs" className="lg:w-1/3 md:w-1/3 w-full  order-3 md:order-2">
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

              <div name="community"
                className=" lg:w-1/3 flex flex-col  order-1 md:order-3 md:w-1/3 w-full my-6 md:my-0 "
              >
                <h2 className="title-font  text-gray-900 tracking-widest text-sm mb-3 dark:text-white capitalize font-raleway font-bold">
                  {t("Footer.community")}
                </h2>
                <div
                  name="social"
                  className="w-full flex  md:flex-wrap  lg:flex-nowrap lg:flex-row  "
                >
                  <div className="w-1/5   md:w-1/2 lg:w-1/5 h-5 my-2 hover:scale-125">
                    <a
                      href="https://github.com/cloudmex/Nativo-NFT-UI"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600  hover:text-[#ec8b01] hover:font-bold dark:text-white capitalize font-raleway font-normal text-sm"
                    >
                      <img src={git}></img>
                    </a>
                  </div>

                  <div className="w-1/5 md:w-1/2 lg:w-1/5 justify-center hover:scale-125">
                    <a
                      href="https://nativonft.medium.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600  hover:text-[#ec8b01] hover:font-bold dark:text-white capitalize font-raleway font-normal text-sm"
                    >
                      <img className="h-5 my-2" src={medium}></img>
                    </a>
                  </div>

                  <div className=" w-1/5 md:w-1/2 lg:w-1/5 lg:ml-2 hover:scale-125">
                    <a
                      href="https://twitter.com/nativonft"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600  hover:text-[#ec8b01] hover:font-bold dark:text-white capitalize font-raleway font-normal text-sm"
                    >
                      <img className="h-5 my-2" src={twitter}></img>
                    </a>
                  </div>

                  <div className=" w-1/5 md:w-1/2 lg:w-1/5 hover:scale-125">
                    <a
                      href="https://discord.gg/q2R6rtY4ks"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600  hover:text-[#ec8b01] hover:font-bold dark:text-white capitalize font-raleway font-normal text-sm"
                    >
                      <img className="h-5 my-2" src={discord}></img>
                    </a>
                  </div>

                  <div className=" w-1/5 md:w-1/2 lg:w-1/5 hover:scale-125">
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

            <div name="poweredBy" className="bg-transparent w-full">
              <div className="  md:mx-auto py-4   flex   lg:flex-row border-t-[.5px] mt-4 border-white  justify-between ">
                <p className="w-3/5 text-gray-500 text-[10px] tracking-[0.75px] text-center md:text-left dark:text-white font-open-sans font-semibold">
                  {t("Footer.tribu")}{" "}
                  <a href="https://cloudmex.io/"> {t("Footer.cloudMx")}</a>
                </p>

                <div name="languagebtn" className=" w-2/5 flex md:-mt-2 justify-center ">
                  <img className="h-10    " src={isMex ? mx : usa} />

                  <div name="changelanguage" className="flex flex-col lg:gap-2 lg:flex-row pl-2  lg:-mt-2">
                    <label className="   lg:my-auto text-center	   text-[10px] md:text-sm  text-white   ">
                      {" "}
                      {t("Navbar.language")}
                    </label>
                    <button
                      className="hover:bg-yellow2 hover:scale-110 hover:text-white md:w-1/2 text-[#616161]     text-[10px] md:text-xs rounded-lg"
                      onClick={handleLanguage}
                    >
                      {t("Navbar.change")}
                     
                    </button>
                  </div>  
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
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
