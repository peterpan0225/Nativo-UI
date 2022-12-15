import React, { Fragment, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Menu as MenuB, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/solid";
import { config, signOut, getNearAccount } from "../utils/near_interaction";
import * as nearAPI from "near-api-js";
import { blockchains } from "../utils/constraint";
import nativoLogoWhite from '../assets/img/LogoBlanco.png'
import lupa from '../assets/landingSlider/img/lupa1.png'
import menu from '../assets/landingSlider/img/menu.png'
import { useTranslation } from "react-i18next";
import { isNearReady } from "../utils/near_interaction";
import { nearSignIn } from "../utils/near_interaction";
import verifyImage from '../assets/img/Check.png';
import { ApolloClient, InMemoryCache, gql } from '@apollo/client';
import defaultUser from '../assets/img/defaultUser.png'
import closeImg from '../assets/img/x.png'
import Swal from 'sweetalert2'
import nativoLogo from '../assets/img/logo_nativo.png'
import { useWalletSelector } from "../utils/walletSelector";
import plus from '../assets/img/landing/firstSection/plus.png';
import arrowRight from '../assets/img/landing/firstSection/ARROW.png';
import finances from '../assets/img/navBar/Finances.png';
import loans from '../assets/img/navBar/Prestamos.png';
import stacking from '../assets/img/navBar/Stacking.png';
import tokenIcon from '../assets/img/navBar/token.png';
import artistIcon from '../assets/img/navBar/Artist.png'
import filter from '../assets/img/navBar/filter_none.png';
import accountCircle from '../assets/img/navBar/profile/account_circle.png';
import createCollection from '../assets/img/navBar/profile/crear_coleccion.png';
import createToken from '../assets/img/navBar/profile/crear_token.png';
import salir from '../assets/img/navBar/profile/Salir.png';
import empty from '../assets/img/navBar/profile/empty.png';
import logout from '../assets/img/navBar/profile/Salir.png';
import staking from '../assets/img/navBar/profile/Staking.png';
import { useFormik } from "formik";
import * as Yup from "yup";
import { useHistory } from 'react-router-dom';
import { slide as Menu } from 'react-burger-menu';
import menuArrowRight from '../assets/img/navBar/menu/chevron-left.png';
import menuArrowLeft from '../assets/img/navBar/menu/chevron-right.png';
import createNft from '../assets/img/navBar/menu/plus-nft.png';
import createCol from '../assets/img/navBar/menu/plus-col.png';


function LightHeaderB(props) {
  const { selector, modal, accounts, accountId } = useWalletSelector();
  const APIURL = process.env.REACT_APP_API_TG;
  const [state, setState] = useState({
    owner: "",
    userData: "",
    dropdown:
      blockchains[parseInt(localStorage.getItem("blockchain"))] || "Blockchain",
    isOpen: true
  });
  const [buscar, setBuscar] = useState({ buscar: "" });
  const [menu, setmenu] = useState(true);
  const [Beta, setBeta] = useState(true);
  const [t, i18n] = useTranslation("global")
  const [stateLogin, setStateLogin] = useState(false);
  const [isShowing, setIsShowing] = useState(false)
  const [isShowingE, setIsShowingE] = useState(false);
  const history = useHistory();
  const [showExploreSubMenu, setShowExploreSubMenu] = useState(false);
  const [showFinanceSubMenu, setShowFinanceSubMenu] = useState(false);
  const [showProfileSubMenu, setShowProfileSubMenu] = useState(false);
  const [showSearchSubMenu, setShowSearchSubMenu] = useState(false);

  const handleMenuStateChange = () => {

    if (!state.isOpen == true) {
      setShowExploreSubMenu(false);
      setShowFinanceSubMenu(false);
      setShowProfileSubMenu(false);
    }
    setState({ ...state, isOpen: !state.isOpen });
  }

  const handleExploreSubMenuShow = () => {
    setShowExploreSubMenu(!showExploreSubMenu)
  };

  const handleFinancesSubMenu = () => {
    setShowFinanceSubMenu(!showFinanceSubMenu)
  };

  const handleProfileSubMenu = () => {
    setShowProfileSubMenu(!showProfileSubMenu)
  }

  const handleSearchSubMenu = () => {
    setShowSearchSubMenu(!showSearchSubMenu)
  }

  const formik = useFormik({
    initialValues: {
      search: ""
    },
    //validaciones
    validationSchema: Yup.object({
      search: Yup.string()
    }),
    onSubmit: async (value) => {
      console.log('12345678', buscar.buscar);
      console.log('value', value);
      console.log('value.search.trim().length ', value.search.trim().length);

      if (value.search.trim().length == 0) {
        window.location = '/collections?search=all';
      } else {
        const test = encodeURIComponent(value.search.trim());
        console.log('test', test);
        const URI = '/collections?search=' + test;
        console.log('URI', URI);
        window.location = URI;
      }
    }
  });

  function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
  }

  const handleSignIn = () => {
    modal.show()
  }

  const handleLanguage = () => {
    if (window.localStorage.getItem("LanguageState") == "en") {
      i18n.changeLanguage("es")
      window.localStorage.setItem("LanguageState", "es")
    }
    else {
      i18n.changeLanguage("en")
      window.localStorage.setItem("LanguageState", "en")
    }
  }

  const closeBeta = () => {
    window.localStorage.setItem("beta", "beta");
    setBeta(false);
  }

  let userData = "";

  useEffect(() => {
    (async () => {
      setStateLogin(accountId != null ? true : false);
      let account = accountId;

      let userMedia = window.localStorage.getItem('userMedia');

      if (!userMedia) { //checking if storage of media exists on browser
        const query = `
          query ($account: String){
            profiles (where : {id : $account}){
              media
            }
          }
        `;

        const client = new ApolloClient({
          uri: APIURL,
          cache: new InMemoryCache(),
        });


        await client.query({
          query: gql(query),
          variables: {
            account: account
          }
        })
          .then((data) => {
            console.log('profile: ', data.data.profiles[0])
            userData = data.data.profiles[0];
            if (userData) {
              //if (data.data.profiles[0].media) {
              localStorage.setItem('userMedia', data.data.profiles[0].media);
            }

          })
          .catch((err) => {
            console.log('error: ', err)
          });
        let loggedAccount2 = accountId;
        window.localStorage.setItem("logged_account",accountId)
        userMedia = window.localStorage.getItem('userMedia');
        // let json2 = "";
        // if (loggedAccount2) {
        //   json2 = JSON.parse(loggedAccount2);
        // }

        console.log('state', state);
        setState({ ...state, owner: loggedAccount2, userMedia: userMedia })
      } else {
        let loggedAccount2 = accountId;
        // let json2 = "";
        // if (loggedAccount2) {
        //   json2 = JSON.parse(loggedAccount2);
        // }

        console.log('state', state);
        setState({ ...state, owner: loggedAccount2, userMedia: userMedia })
      }
    })();

    if (state.dropdown == 'Blockchain') {
      changeBlockchain(2);
      if (!window.localStorage.getItem("beta")) {
        setBeta(true);
      }

    }
  }, [selector]);

  /**
   * esta funcion nos permite cambiar de blockchain
   * @param {int} index representa la posicion dentro del arreglo blockchains
   */

  async function changeBlockchain(index) {
    setState({ dropdown: blockchains[index] });
    localStorage.setItem("blockchain", index);
    window.localStorage.setItem("page", 0)
    await signOut();
    // window.location.reload();
  }

  async function goNativoV1() {
    window.location.href = 'https://v1.nativonft.app/';
  }

  async function handleCreatebutton() {
    if (stateLogin) {
      
      Swal.fire({
        background: '#0a0a0a',
        width: '800',
        heightAuto: false,
        html:
          '<div class=" flex flex-col overflow-hidden">' +
          '<div class="font-open-sans  text-base font-extrabold text-white my-4 text-left w-full uppercase">' +  t("Navbar.createMsg") + '</div>' +

          '</div>',
        showCloseButton: true,
        confirmButtonText:  t("Navbar.create"),
        cancelButtonText:  t("Navbar.createCollection"),
        showCancelButton: true,
        showConfirmButton: true,
        buttonsStyling: false,
        customClass: {
          confirmButton: 'flex py-2 w-full h-[40px]  mt-0 ml-5  lg:w-[200px] title-font  text-white font-open-sans font-normal lg:font-extrabold text-base uppercase leading-6  justify-center hover:text-textOutlineHover active:text-textOutlinePressed flex flex-col font-extrabold h-full text-white  text-center  justify-center shadow-s w-full border-solid border-2 rounded-md border-white2 hover:bg-outlineHover active:bg-outlinePressed " ',
          cancelButton: 'flex py-2 w-full h-[40px]  mt-0 ml-5  lg:w-[200px] title-font  text-white font-open-sans font-normal lg:font-extrabold text-base uppercase leading-6  justify-center hover:text-textOutlineHover active:text-textOutlinePressed flex flex-col font-extrabold h-full text-white  text-center  justify-center shadow-s w-full border-solid border-2 rounded-md border-white2 hover:bg-outlineHover active:bg-outlinePressed " ',
        },
        position: window.innerWidth < 1024 ? 'bottom' : 'center'
      }).then((result) => {
          if (result.isConfirmed) {
              window.location.href = "/create"
          } 
          if(result.dismiss == 'cancel') {
              window.location.href = "/collection/create" 
          }
        });
      
    } else {
      handleSignIn()
    }

  }

  async function logOut() {
    const wallet = await selector.wallet();
    Swal.fire({
      background: '#0a0a0a',
      width: '800',
      html:
        '<div class="">' +
        '<div class="font-open-sans  text-base font-extrabold text-white mb-4 text-left uppercase">' +  t("Navbar.logoutMsg") + '</div>' +
        '<div class="font-open-sans  text-sm text-white text-left">' + t("Navbar.logoutMsgSub") + '</div>' +
        '</div>',
      confirmButtonText: t("Navbar.logout"),
      cancelButtonText: t("Navbar.close"),
      showCancelButton: true,
      buttonsStyling: false,
      customClass: {
        confirmButton: 'font-open-sans uppercase text-base  font-extrabold  text-white  text-center bg-yellow2 rounded-md bg-yellow2 px-3 py-[10px] mx-2',
        cancelButton: 'font-open-sans uppercase text-base  font-extrabold  text-white  text-center  justify-center px-3 py-2  mx-2 border-solid border-2 rounded-md border-white2 hover:bg-outlineHover active:bg-outlinePressed'
      },
      confirmButtonColor: '#f79336',
      position: window.innerWidth < 1024 ? 'bottom' : 'center'
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem('userMedia');
        wallet.signOut().catch((err) => {
          console.log("Failed to sign out");
          console.error(err);
        }).then((res) => {
          window.location.href = "/"
        })
      }
    });


  }

  async function futureFeatureMsg(section) {
    Swal.fire({
      background: '#0a0a0a',
      width: '800',
      html:
        '<div class="">' +
        '<div class="font-open-sans  text-base font-extrabold text-white mb-4 text-left uppercase">' + t("Navbar.comming") + '</div>' +
        '<div class="font-open-sans  text-sm text-white text-left">' + t("Navbar.commingSubtitle") + '</div>' +
        '</div>',
      showCloseButton: true,
      showCancelButton: false,
      showConfirmButton: false,

      position: window.innerWidth < 1024 ? 'bottom' : 'center'
    });
  }

  async function showSettings(event) {
    event.preventDefault();
  }

  let _handleChange = async (e) => {
    console.log('handleChanvge', e.target.value);
    if (e.keyCode === 13) {
      formik.handleSubmit(e.target.value);
    } else {
      setBuscar({ ...buscar, buscar: e.target.value })
    }
  }

  let handleAllCollections = async (e) => {
    window.location.href = '/explore?search=collections'
  }


  return (
    <>

      <header className="text-gray-600 body-font shadow-sm sticky top-0 z-50 bg-[#ffffff]">
        <div className=" flex  px-5  flex-row items-center movil-header dark:bg-[#0A0A0A] h-[80px]">
          <div className="w-full flex flex-row justify-between lg:w-auto">
            <a
              href="/"
              className="flex flex-row"
            >
              <img src={nativoLogoWhite} className="d-inline-block align-top w-[85px] lg:w-[105px] lg:h-[60px]" alt="logo" width="105px" height="60px" />
            </a>
          </div>
          <nav className={" lg:mr-auto lg:ml-4 lg:py-1 lg:border-l lg:border-gray-400	 flex-wrap items-center text-base justify-center hidden lg:flex " + (menu ? "esconder-nav" : "")}>
            <form
              onSubmit={formik.handleSubmit}
              className="w-[275px] relative flex my-auto h-[40px] items-center"
            >
              <input
                type="search"
                id="search"
                name="search"
                placeholder={t("Navbar.search")}
                value={buscar}
                {...formik.getFieldProps("search")}
                className={`w-full flex flex-col  font-open-sans h-full text-white  text-left pl-2 pr-8 justify-center  border-solid border rounded-md border-white2  dark:bg-[#0A0A0A]  focus-visible:outline-none focus-visible:shadow-s `}
              />
              <button
                type="submit"
                className={` dark:text-white absolute right-0 mr-2 `}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z" stroke="#FAF9FB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                  <path d="M20.9999 21L16.6499 16.65" stroke="#FAF9FB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </button>
            </form>



            <MenuB as="div" className="relative inline-block text-left w-full md:w-auto md:ml-4 h-full"
              onMouseEnter={() => setIsShowingE(true)}
              onMouseLeave={() => setIsShowingE(false)}
            >
              {({ open }) => (
                <>
                  <div className="flex flex-nowrap flex-row-reverse h-full">
                    <MenuB.Button className="w-[75px] md:w-full h-full flex justify-center items-center rounded-md px-2 py-1 border-0  hover:animate-pulse">
                      <div className="w-full flex relative h-full">
                        <div className="  text-base  hover:dark:text-yellow4  dark:text-white font-open-sans font-extrabold uppercase  h-full  flex justify-center items-center">
                          {t("Navbar.explore")}
                        </div>
                      </div>
                    </MenuB.Button>
                  </div>
                  <Transition
                    show={isShowingE}
                    onMouseEnter={() => setIsShowingE(true)}
                    onMouseLeave={() => setIsShowingE(false)}
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <MenuB.Items static className="w-[219px]  md:w-[219px] origin-top-right absolute -right-[125px] mt-0 divide-y  shadow-lg dark:bg-[#000] outline-none border-t-4 border-b-4 border-[#032B30]">
                      <div className="py-1">
                        <MenuB.Item onClick={handleAllCollections}>
                          {({ active }) => (
                            <a className={classNames(active ? "dark:text-white font-extrabold  bg-[#2A747E]" : "dark:text-white ml-2 font-bold", "block px-2 py-2 text-base text-center font-open-sans uppercase")}>
                              <div className="flex justify-start cursor-pointer">
                                <img
                                  className="mr-2"
                                  src={filter}
                                  alt='banner'
                                  width="20px"
                                  height="20px" />
                                <p className=" self-center"> {t("Navbar.collections")}</p>
                              </div>
                            </a>
                          )}
                        </MenuB.Item>
                        <MenuB.Item onClick={async () => { window.location.href = "/explore?search=tokens" }}>
                          {({ active }) => (
                            <a className={classNames(active ? " dark:text-white font-extrabold  bg-[#2A747E]" : "dark:text-white ml-2 font-bold", " block px-2 py-2 text-base text-center font-open-sans uppercase")}>
                              <div className="flex justify-start cursor-pointer">
                                <img
                                  className="mr-2"
                                  src={tokenIcon}
                                  alt='banner'
                                  width="20px"
                                  height="20px" />
                                <p className=" self-center"> {t("Navbar.tokens")}</p>
                              </div>
                            </a>
                          )}
                        </MenuB.Item>
                        <MenuB.Item onClick={async () => { window.location.href = "/explore?search=artists" }}>
                          {({ active }) => (
                            <a className={classNames(active ? " dark:text-white font-extrabold  bg-[#2A747E]" : "dark:text-white ml-2 font-bold", " block px-2 py-2 text-base text-center font-open-sans uppercase")}>
                              <div className="flex justify-start cursor-pointer">
                                <img
                                  className="mr-2"
                                  src={artistIcon}
                                  alt='banner'
                                  width="20px"
                                  height="20px" />
                                <p className=" self-center"> {t("Navbar.artists")}</p>
                              </div>
                            </a>
                          )}
                        </MenuB.Item>


                      </div>
                    </MenuB.Items>
                  </Transition>
                </>
              )}
            </MenuB>

            <MenuB as="div" className="relative inline-block text-left w-full md:w-auto md:ml-4 h-full"
              onMouseEnter={() => setIsShowing(true)}
              onMouseLeave={() => setIsShowing(false)}
            >
              {({ open }) => (
                <>
                  <div className="flex flex-nowrap flex-row-reverse h-full">
                    <MenuB.Button className="w-[75px] md:w-full h-full flex justify-center items-center rounded-md px-2 py-1 border-0  hover:animate-pulse">
                      <div className="w-full flex relative h-full">
                        <div className="mr-5  text-base  hover:dark:text-yellow4  dark:text-white font-open-sans font-extrabold uppercase  h-full  flex justify-center items-center">
                          {t("Navbar.finance")}
                        </div>
                      </div>
                    </MenuB.Button>
                  </div>
                  <Transition
                    show={isShowing}
                    onMouseEnter={() => setIsShowing(true)}
                    onMouseLeave={() => setIsShowing(false)}
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <MenuB.Items static className="w-[219px]  md:w-[219px] origin-top-right absolute -right-[100px] mt-0 divide-y  shadow-lg dark:bg-[#000] outline-none border-t-4 border-b-4 border-[#032B30]">
                      <div className="py-1">
                        <MenuB.Item onClick={async () => { futureFeatureMsg(t("Navbar.auctions")); }}>
                          {({ active }) => (
                            <a className={classNames(active ? " dark:text-white font-extrabold  bg-[#2A747E]" : "dark:text-white ml-2 font-bold", " block px-2 py-2 text-base text-center font-open-sans uppercase")}>
                              <div className="flex justify-start cursor-pointer">
                                <img
                                  className="mr-2"
                                  src={finances}
                                  alt='banner'
                                  width="20px"
                                  height="20px" />
                                <p className=" self-center"> {t("Navbar.auctions")}</p>
                              </div>
                            </a>
                          )}
                        </MenuB.Item>

                        <MenuB.Item onClick={async () => { futureFeatureMsg(t("Navbar.loans")); }}>
                          {({ active }) => (
                            <a className={classNames(active ? "dark:text-white font-extrabold  bg-[#2A747E]" : "dark:text-white ml-2 font-bold", "block px-2 py-2 text-base text-center font-open-sans uppercase")}>
                              <div className="flex justify-start cursor-pointer">
                                <img
                                  className="mr-2"
                                  src={loans}
                                  alt='banner'
                                  width="20px"
                                  height="20px" />
                                <p className=" self-center"> {t("Navbar.loans")}</p>
                              </div>
                            </a>
                          )}
                        </MenuB.Item>

                        <MenuB.Item onClick={async () => { futureFeatureMsg(t("Navbar.staking")); }}>
                          {({ active }) => (
                            <a className={classNames(active ? "dark:text-white font-extrabold  bg-[#2A747E]" : "dark:text-white ml-2 font-bold", "block px-2 py-2 text-base text-center font-open-sans uppercase")}>
                              <div className="flex justify-start cursor-pointer">
                                <img
                                  className="mr-2"
                                  src={stacking}
                                  alt='banner'
                                  width="20px"
                                  height="20px" />
                                <p className=" self-center"> {t("Navbar.staking")}</p>
                              </div>
                            </a>
                          )}
                        </MenuB.Item>
                      </div>
                    </MenuB.Items>
                  </Transition>
                </>
              )}
            </MenuB>

            <a href="/community" className="mr-5 hover:dark:text-yellow4 text-base    dark:text-white font-open-sans font-extrabold uppercase cursor-pointer">
              {t("Navbar.community")}
            </a>

            <button className="flex inline-flex rounded-xlarge w-full h-[40px]  mt-0 ml-5  lg:w-[159px]" onClick={() => handleCreatebutton()}>
              <div className="flex flex-col font-extrabold h-full text-white  text-center  justify-center shadow-s w-full border-solid border-2 rounded-md border-white2 hover:bg-outlineHover active:bg-outlinePressed ">

                <span className="title-font  text-white font-open-sans font-normal lg:font-extrabold text-base p-5 uppercase leading-6 flex justify-center hover:text-textOutlineHover active:text-textOutlinePressed  ">{t("Navbar.createB")} <img className="manImg w-[12px] h-[12px] self-center ml-[6px]" src={arrowRight}></img> </span>
              </div>
            </button>
          </nav>


          <form className={"flex flex-wrap mr-7 hidden"}
            onSubmit={e => {
              e.preventDefault();
              window.location.href = "/perfil/" + buscar;
            }}
          >
            <input type="text" value={buscar} maxLength={64} className="p-2 lg:w-12/12 px-3 buscar" placeholder={(process.env.REACT_APP_NEAR_ENV == "mainnet" ? "usuario.near" : "usuario.testnet")}
              onChange={e => {

                const not = "abcdefghijklmnopqrstuvwxyzñ1234567890_-.";
                const tex = e.target.value.toString().toLowerCase();
                if (not.includes(tex[tex.length - 1]) || tex == "") {
                  setBuscar(tex);
                }
              }}
            />
            <button type="submit" className="p-2 lg:w-1/12 px-3 ml-2 bg-s">
              <img src={lupa} alt="lupa" />
            </button>
          </form>
 
          {
            stateLogin ?
              <>
                <button className="w-[30px] h-[30px] mr-[5px] hidden lg:inline-block" onClick={async () => { futureFeatureMsg(t("Navbar.loans")); }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 40 40" fill="none">
                    <path d="M28 14.669C28 12.5473 27.1571 10.5125 25.6569 9.01217C24.1566 7.51188 22.1217 6.66903 20 6.66903C17.8783 6.66903 15.8434 7.51188 14.3431 9.01217C12.8429 10.5125 12 12.5473 12 14.669C12 24.0024 8 26.669 8 26.669H32C32 26.669 28 24.0024 28 14.669Z" stroke="#FDFCFD" stroke-width="2.66667" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M22.3067 32.0024C22.0723 32.4065 21.7358 32.7419 21.331 32.9751C20.9262 33.2083 20.4672 33.331 20 33.331C19.5329 33.331 19.0739 33.2083 18.6691 32.9751C18.2642 32.7419 17.9278 32.4065 17.6934 32.0024" stroke="#FDFCFD" stroke-width="2.66667" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                </button>
                <MenuB as="div" className="relative  text-left w-full md:w-auto md:ml-4 hidden lg:inline-block">
                  {({ open }) => (
                    <>
                      <div className="flex flex-nowrap flex-row-reverse">
                        <MenuB.Button className="w-[75px] md:w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-2 py-1 bg-white text-sm  text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-yellow-500 font-raleway font-normal">
                          <div className="w-full  flex relative ">
                            {state.userMedia ?
                              <div className="w-[45px] h-[45px] -m-[12px]  rounded-md  relative bg-cover " style={{ backgroundImage: `url(https://nativonft.mypinata.cloud/ipfs/${state.userMedia})` }} >
                              </div> :
                              <div className="w-[45px] h-[45px] -m-[12px]  rounded-md  relative bg-cover " style={{ backgroundImage: `url(${empty})` }}>
                              </div>
                            }

                          </div>
                        </MenuB.Button>
                      </div>
                      <Transition
                        show={open}
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                      >
                        <MenuB.Items
                          static
                          className="w-[245px]  md:w-[245px] origin-top-right absolute right-[0] mt-[13px] divide-y  shadow-lg dark:bg-[#000] outline-none border-t-4 border-b-4 border-[#032B30]"
                        >
                          <div className="py-1">
                            <MenuB.Item
                            >
                              {({ active }) => (
                                <a href={"/profile/" + state.owner.split('.')[0]} className={classNames(active ? "dark:text-white font-extrabold  bg-[#2A747E]" : "dark:text-white ml-2 font-bold", "block px-2  text-base text-center font-open-sans uppercase")}>
                                  <div className="flex justify-start">
                                    <span className=" m-2">
                                      <img
                                        className="mr-2"
                                        src={accountCircle}
                                        alt='banner'
                                        width="20px"
                                        height="20px" />
                                    </span>
                                    <p className=" items-start flex flex-col md:flex-row md:items-center"> {t("Navbar.profile")}
                                      <span className="text-[9px] -mt-[7px] md:hidden">{state.owner}</span>
                                    </p>
                                  </div>
                                </a>
                              )}
                            </MenuB.Item>








                            <MenuB.Item
                            >
                              {({ active }) => (
                                <a href="/mynfts" className={classNames(active ? "dark:text-white font-extrabold  bg-[#2A747E]" : "dark:text-white ml-2 font-bold", "block px-2  text-base text-center font-open-sans uppercase")}>
                                  <div className="flex justify-start">
                                    <span className=" m-2">
                                      <img
                                        className="mr-2"
                                        src={tokenIcon}
                                        alt='banner'
                                        width="20px"
                                        height="20px" />
                                    </span>
                                    <p className=" self-center"> {t("Navbar.myNFTs")}</p>
                                  </div>

                                </a>
                              )}
                            </MenuB.Item>

                            <MenuB.Item
                            >
                              {({ active }) => (
                                <a href="/collection/create" className={classNames(active ? "dark:text-white font-extrabold  bg-[#2A747E]" : "dark:text-white ml-2 font-bold", "px-2 block text-base text-center font-open-sans uppercase")}>
                                  <div className="flex justify-start">
                                    <span className=" m-2">
                                      <img
                                        className="mr-2"
                                        src={createCollection}
                                        alt='banner'
                                        width="20px"
                                        height="20px" />
                                    </span>
                                    <p className=" self-center"> {t("Navbar.createCollection")}</p>
                                  </div>

                                </a>
                              )}
                            </MenuB.Item>


                            <MenuB.Item
                            >
                              {({ active }) => (
                                <a href="/create" className={classNames(active ? "dark:text-white font-extrabold  bg-[#2A747E]" : "dark:text-white ml-2 font-bold", "block px-2  text-base text-center font-open-sans uppercase")}>
                                  <div className="flex justify-start">
                                    <span className=" m-2">
                                      <img
                                        className="mr-2"
                                        src={createToken}
                                        alt='banner'
                                        width="20px"
                                        height="20px" />
                                    </span>
                                    <p className=" self-center"> {t("Navbar.create")}</p>
                                  </div>

                                </a>
                              )}
                            </MenuB.Item>



                            <MenuB.Item
                              onClick={async () => {
                                logOut();
                              }}
                            >
                              {({ active }) => (
                                <a className={classNames(active ? " font-extrabold  bg-[#2A747E]" : "dark:text-yellow4 ml-2 font-bold", "block px-2  text-base text-center font-open-sans uppercase")}>
                                  <div className="flex justify-start">
                                    <span className=" m-2">
                                      <img
                                        className="mr-2"
                                        src={logout}
                                        alt='banner'
                                        width="20px"
                                        height="20px" />
                                    </span>
                                    <p className=" self-center"> {t("Navbar.logout")}</p>
                                  </div>

                                </a>
                              )}
                            </MenuB.Item>
                          </div>
                        </MenuB.Items>
                      </Transition>
                    </>
                  )}
                </MenuB>
                <div className="lg:hidden">
                  <div className="flex mr-[35px]">
                    <button className="w-[30px] h-[30px]  mr-[10px]" onClick={() => { formik.resetForm(); handleSearchSubMenu() }}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z" stroke="#FAF9FB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M20.9999 21L16.6499 16.65" stroke="#FAF9FB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                      </svg>
                    </button>
                    <div className={classNames(showSearchSubMenu ? "transform -translate-x-full duration-600" : "transform translate-x-full duration-600", "fixed w-full top-0 left-full h-[80px] flex items-center dark:bg-[#0A0A0A] z-[1200]")}>
                      <button onClick={handleSearchSubMenu}>
                        <img
                        className="w-[25px] h-[25px] ml-2"
                        src={menuArrowLeft}
                        alt={menuArrowLeft}
                        width={25}
                        height={25} />
                      </button>
                      <form
                        onSubmit={formik.handleSubmit}
                        className="w-full relative flex my-auto h-[40px] items-center mx-2"
                      >
                        <input
                          type="search"
                          id="search"
                          name="search"
                          placeholder={t("Navbar.search")}
                          value={buscar}
                          {...formik.getFieldProps("search")}
                          className={`w-full flex flex-col  font-open-sans h-full text-white  text-left pl-2 pr-8 justify-center   rounded-md  dark:bg-[#0A0A0A] focus-visible:outline-none  `}
                        />
                        <button
                          type="submit"
                          className={` dark:text-white absolute right-0 mr-2 `}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z" stroke="#FAF9FB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M20.9999 21L16.6499 16.65" stroke="#FAF9FB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                          </svg>
                        </button>
                      </form>
                    </div>
                    <button className="w-[30px] h-[30px] mr-[5px]" onClick={async () => { futureFeatureMsg(t("Navbar.loans")); }}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 40 40" fill="none">
                        <path d="M28 14.669C28 12.5473 27.1571 10.5125 25.6569 9.01217C24.1566 7.51188 22.1217 6.66903 20 6.66903C17.8783 6.66903 15.8434 7.51188 14.3431 9.01217C12.8429 10.5125 12 12.5473 12 14.669C12 24.0024 8 26.669 8 26.669H32C32 26.669 28 24.0024 28 14.669Z" stroke="#FDFCFD" stroke-width="2.66667" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M22.3067 32.0024C22.0723 32.4065 21.7358 32.7419 21.331 32.9751C20.9262 33.2083 20.4672 33.331 20 33.331C19.5329 33.331 19.0739 33.2083 18.6691 32.9751C18.2642 32.7419 17.9278 32.4065 17.6934 32.0024" stroke="#FDFCFD" stroke-width="2.66667" stroke-linecap="round" stroke-linejoin="round" />
                      </svg>
                    </button>
                  </div>
                  <Menu isOpen={state.isOpen} onStateChange={() => handleMenuStateChange()} pageWrapId={'page-wrap'} outerContainerId={'outer-container'}  >
                    <div>
                      <button
                      className={` mt-5 text-white b border-0 py-2  focus:outline-none w-[220px] md:w-auto rounded-md font-open-sans font-extrabold uppercase flex w-full`}
                      style={{ justifyContent: "center" }}
                      onClick={handleProfileSubMenu}>
                      <div className="flex items-center">
                        {state.userMedia ?
                          <div className="w-[60px] h-[60px]  bg-circle rounded-md  relative bg-cover " style={{ backgroundImage: `url(https://nativonft.mypinata.cloud/ipfs/${state.userMedia})` }} >
                          </div> :
                          <div className="w-[60px] h-[60px]  bg-circle rounded-md  relative bg-cover hhh " style={{ backgroundImage: `url(${empty})` }} >
                          </div>
                        }
                        <p className="text-base text-white leading-6 font-semibold text-ellipsis overflow-hidden whitespace-nowrap w-3/4 ml-2">{state.owner}</p>
                      </div>
                    </button>
                    <div className={classNames(showProfileSubMenu ? "transform -translate-x-[620px] duration-600" : "transform -translate-x-80 duration-600", "w-[300px] h-full dark:bg-[#0A0A0A]  fixed z-[1200] -right-[620px] top-[80px] px-[42px]")}>
                        <button className="font-open-sans font-extrabold text-base leading-4 flex text-white justify-between uppercase " onClick={handleProfileSubMenu}>
                          <img
                            className=""
                            src={menuArrowLeft}
                            alt='banner'
                            width="20px"
                            height="20px" />
                          <p className="ml-4">{state.owner}</p>
                        </button>
                        <button className="font-open-sans font-semibold text-base leading-4 flex text-white mt-6 justify-between uppercase ml-8 w-full" onClick={async () => { window.location = `/profile/${state.owner.split('.')[0]}` }}>
                          <p className="font-open-sans font-semibold text-base">{t("Navbar.profile")}</p>
                          <img
                            className="mr-4"
                            src={accountCircle}
                            alt='banner'
                            width="25px"
                            height="20px" />
                        </button>
                        <button className="font-open-sans font-semibold text-base leading-4 flex text-white mt-3 justify-between uppercase ml-8 w-full" onClick={async () => { futureFeatureMsg(t("Navbar.loans")); }}>
                          <p className="font-open-sans font-semibold text-base">{t("Navbar.createCollection")}</p>
                          <img
                            className="mr-4"
                            src={createCollection}
                            alt='banner'
                            width="25px"
                            height="20px" />
                        </button>
                        <button className="font-open-sans font-semibold text-base leading-4 flex text-white mt-3 justify-between uppercase ml-8 w-full" onClick={async () => { futureFeatureMsg(t("Navbar.staking")); }}>
                          <p className="font-open-sans font-semibold text-base">{t("Navbar.create")}</p>
                          <img
                            className="mr-4"
                            src={createToken}
                            alt='banner'
                            width="25px"
                            height="20px" />
                        </button>
                      </div>
                    </div>
                    <div className="menu-item" >
                      <div className="font-open-sans font-extrabold text-base leading-4 flex text-white mt-12 justify-between uppercase " >
                        <button className="font-open-sans font-extrabold text-base leading-4 flex text-white justify-between uppercase w-full" onClick={handleExploreSubMenuShow} >

                          <p>{t("Navbar.explore")}</p>
                          <img
                            className=""
                            src={menuArrowRight}
                            alt='banner'
                            width="20px"
                            height="20px" />

                        </button>
                        <div className={classNames(showExploreSubMenu ? "transform -translate-x-[620px] duration-600" : "transform -translate-x-80 duration-600", "w-[300px] h-full dark:bg-[#0A0A0A]  fixed z-[1200] -right-[620px] top-[80px] px-[42px]")}>
                          <button className="font-open-sans font-extrabold text-base leading-4 flex text-white  justify-between uppercase " onClick={handleExploreSubMenuShow}>
                            <img
                              className=""
                              src={menuArrowLeft}
                              alt='banner'
                              width="20px"
                              height="20px" />
                            <p className="ml-4">{t("Navbar.explore")}</p>
                          </button>
                          <a className="font-open-sans font-semibold text-base leading-4 flex text-white mt-6 justify-between uppercase ml-8 w-full" href="/explore?search=collections">
                            <p className="font-open-sans font-semibold text-base">{t("Navbar.collections")}</p>
                            <img
                              className="mr-4"
                              src={filter}
                              alt='banner'
                              width="25px"
                              height="20px" />
                          </a>
                          <a className="font-open-sans font-semibold text-base leading-4 flex text-white mt-3 justify-between uppercase ml-8 w-full" href="/explore?search=tokens">
                            <p className="font-open-sans font-semibold text-base">{t("Navbar.tokens")}</p>
                            <img
                              className="mr-4"
                              src={tokenIcon}
                              alt='banner'
                              width="25px"
                              height="20px" />
                          </a>
                          <a className="font-open-sans font-semibold text-base leading-4 flex text-white mt-3 justify-between uppercase ml-8 w-full" href="/explore?search=artists">
                            <p className="font-open-sans font-semibold text-base">{t("Navbar.artists")}</p>
                            <img
                              className="mr-4"
                              src={artistIcon}
                              alt='banner'
                              width="25px"
                              height="20px" />
                          </a>
                        </div>
                      </div>
                    </div>
                    <div className="menu-item" >
                      <button className="font-open-sans font-extrabold text-base leading-4 flex text-white mt-3 justify-between uppercase w-full" onClick={handleFinancesSubMenu} >
                        <p>{t("Navbar.finance")}</p>
                        <img
                          className=""
                          src={menuArrowRight}
                          alt='banner'
                          width="20px"
                          height="20px" />
                      </button>
                      <div className={classNames(showFinanceSubMenu ? "transform -translate-x-[620px] duration-600" : "transform -translate-x-80 duration-600", "w-[300px] h-full dark:bg-[#0A0A0A]  fixed z-[1200] -right-[620px] top-[80px] px-[42px]")}>
                        <button className="font-open-sans font-extrabold text-base leading-4 flex text-white justify-between uppercase " onClick={handleFinancesSubMenu}>
                          <img
                            className=""
                            src={menuArrowLeft}
                            alt='banner'
                            width="20px"
                            height="20px" />
                          <p className="ml-4">{t("Navbar.finance")}</p>
                        </button>
                        <button className="font-open-sans font-semibold text-base leading-4 flex text-white mt-6 justify-between uppercase ml-8 w-full" onClick={async () => { futureFeatureMsg(t("Navbar.auctions")); }}>
                          <p className="font-open-sans font-semibold text-base">{t("Navbar.auctions")}</p>
                          <img
                            className="mr-4"
                            src={finances}
                            alt='banner'
                            width="25px"
                            height="20px" />
                        </button>
                        <button className="font-open-sans font-semibold text-base leading-4 flex text-white mt-3 justify-between uppercase ml-8 w-full" onClick={async () => { futureFeatureMsg(t("Navbar.loans")); }}>
                          <p className="font-open-sans font-semibold text-base">{t("Navbar.loans")}</p>
                          <img
                            className="mr-4"
                            src={loans}
                            alt='banner'
                            width="25px"
                            height="20px" />
                        </button>
                        <button className="font-open-sans font-semibold text-base leading-4 flex text-white mt-3 justify-between uppercase ml-8 w-full" onClick={async () => { futureFeatureMsg(t("Navbar.staking")); }}>
                          <p className="font-open-sans font-semibold text-base">{t("Navbar.staking")}</p>
                          <img
                            className="mr-4"
                            src={stacking}
                            alt='banner'
                            width="25px"
                            height="20px" />
                        </button>
                      </div>
                    </div>
                    <div className="menu-item" >
                      <a className="font-open-sans font-extrabold text-base leading-4 flex text-white mt-3 justify-between uppercase" href="/community">
                        <p>{t("Navbar.community")}</p>
                      </a>
                    </div>
                    <button className="flex  rounded-xlarge w-full h-[40px]   lg:w-[159px] mt-10" onClick={() => { window.location = "/create" }}>
                      <div className="flex flex-col font-extrabold h-full text-white  text-center  justify-center shadow-s w-full border-solid border-2 rounded-md border-white2  ">
                        <span className="title-font  text-white font-open-sans text-base lg:font-extrabold  p-5 uppercase leading-6 flex justify-center ">{t("Navbar.create")} <img className="manImg  self-center ml-[6px]" width="20px" height="20px" src={createNft}></img> </span>
                      </div>
                    </button>
                    <button className="flex  rounded-xlarge w-full h-[40px]  lg:w-[159px] mt-3" onClick={() => { window.location = "/collection/create" }}>
                      <div className="flex flex-col font-extrabold h-full text-white  text-center  justify-center shadow-s w-full border-solid border-2 rounded-md border-white2  ">
                        <span className="title-font  text-white font-open-sans text-base lg:font-extrabold p-0 uppercase leading-6 flex justify-center ">{t("Navbar.createCollection")} <img className="manImg self-center ml-[6px]" width="20px" height="20px" src={createCol}></img> </span>
                      </div>
                    </button>
                    <button className="flex  rounded-xlarge w-full h-[40px]  lg:w-[159px] mt-3" onClick={() => { logOut() }}>
                      <div className="flex flex-col font-extrabold h-full text-yellow2  text-center  justify-center shadow-s w-full border-solid border-2 rounded-md border-yellow2">
                        <span className="title-font  text-yellow2 font-open-sans text-base lg:font-extrabold p-5 uppercase leading-6 flex justify-center ">{t("Navbar.logout")}<img className="manImg self-center ml-[6px]" width="20px" height="20px" src={salir}></img> </span>
                      </div>
                    </button>
                  </Menu>
                </div>
              </>
              :
              <>
                <button
                  className={`ml-auto  text-white bg-yellow2 border-0 py-2 px-6 focus:outline-none w-[320px] lg:w-auto rounded-md font-open-sans font-extrabold uppercase hidden lg:flex items-center`}
                  style={{ justifyContent: "center" }}
                  // disabled={state?.tokens.onSale}
                  onClick={handleSignIn}>
                  <svg class="mx-2" width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0)"><path class="fill-current" d="M19.1736 1.21319L14.2154 8.57143C13.8725 9.07253 14.5318 9.67912 15.0066 9.25714L19.8857 5.01099C20.0175 4.90549 20.2022 4.98462 20.2022 5.16923V18.4352C20.2022 18.6198 19.9648 18.6989 19.8593 18.567L5.09008 0.896703C4.61535 0.316484 3.92964 0 3.1648 0H2.63733C1.2659 0 0.131836 1.13407 0.131836 2.53187V21.2044C0.131836 22.6022 1.2659 23.7363 2.6637 23.7363C3.53403 23.7363 4.35162 23.2879 4.82634 22.5231L9.78458 15.1648C10.1274 14.6637 9.4681 14.0571 8.99337 14.4791L4.11425 18.6989C3.98239 18.8044 3.79777 18.7253 3.79777 18.5407V5.3011C3.79777 5.11648 4.03513 5.03736 4.14063 5.16923L18.9099 22.8396C19.3846 23.4198 20.0967 23.7363 20.8351 23.7363H21.3626C22.7604 23.7363 23.8945 22.6022 23.8945 21.2044V2.53187C23.8945 1.13407 22.7604 0 21.3626 0C20.4659 0 19.6483 0.448352 19.1736 1.21319V1.21319Z"></path></g><defs><clipPath id="clip0"><rect width="24" height="23.7363" fill="white"></rect></clipPath></defs></svg>{t("Navbar.login")}
                </button>
                <div className="lg:hidden">
                  <div className="flex mr-[35px]">
                    <button className="w-[30px] h-[30px]  mr-[10px]" onClick={() => { formik.resetForm(); handleSearchSubMenu() }}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z" stroke="#FAF9FB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M20.9999 21L16.6499 16.65" stroke="#FAF9FB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                      </svg>
                    </button>
                    <div className={classNames(showSearchSubMenu ? "transform -translate-x-full duration-600" : "transform translate-x-full duration-600", "fixed w-full top-0 left-full h-[80px] flex items-center dark:bg-[#0A0A0A] z-[1200]")}>
                      <button onClick={handleSearchSubMenu}>
                        <img
                        className="w-[25px] h-[25px] ml-2"
                        src={menuArrowLeft}
                        alt={menuArrowLeft}
                        width={25}
                        height={25} />
                      </button>
                      <form
                        onSubmit={formik.handleSubmit}
                        className="w-full relative flex my-auto h-[40px] items-center mx-2"
                      >
                        <input
                          type="search"
                          id="search"
                          name="search"
                          placeholder={t("Navbar.search")}
                          value={buscar}
                          {...formik.getFieldProps("search")}
                          className={`w-full flex flex-col  font-open-sans h-full text-white  text-left pl-2 pr-8 justify-center   rounded-md  dark:bg-[#0A0A0A] focus-visible:outline-none  `}
                        />
                        <button
                          type="submit"
                          className={` dark:text-white absolute right-0 mr-2 `}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z" stroke="#FAF9FB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M20.9999 21L16.6499 16.65" stroke="#FAF9FB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                          </svg>
                        </button>
                      </form>
                    </div>
                  </div>
                  <Menu isOpen={state.isOpen} onStateChange={() => handleMenuStateChange()} pageWrapId={'page-wrap'} outerContainerId={'outer-container'}  >
                    <button
                      className={` mt-5 text-white bg-yellow2 border-0 py-2 px-6 focus:outline-none w-[220px]  rounded-md font-open-sans font-extrabold uppercase flex items-center`}
                      style={{ justifyContent: "center" }}
                      // disabled={state?.tokens.onSale}
                      onClick={handleSignIn}>
                      <div className="flex items-center">
                        <div className="w-1/4 h-[25px] flex items-center">
                          <svg class="mx-2" width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0)"><path class="fill-current" d="M19.1736 1.21319L14.2154 8.57143C13.8725 9.07253 14.5318 9.67912 15.0066 9.25714L19.8857 5.01099C20.0175 4.90549 20.2022 4.98462 20.2022 5.16923V18.4352C20.2022 18.6198 19.9648 18.6989 19.8593 18.567L5.09008 0.896703C4.61535 0.316484 3.92964 0 3.1648 0H2.63733C1.2659 0 0.131836 1.13407 0.131836 2.53187V21.2044C0.131836 22.6022 1.2659 23.7363 2.6637 23.7363C3.53403 23.7363 4.35162 23.2879 4.82634 22.5231L9.78458 15.1648C10.1274 14.6637 9.4681 14.0571 8.99337 14.4791L4.11425 18.6989C3.98239 18.8044 3.79777 18.7253 3.79777 18.5407V5.3011C3.79777 5.11648 4.03513 5.03736 4.14063 5.16923L18.9099 22.8396C19.3846 23.4198 20.0967 23.7363 20.8351 23.7363H21.3626C22.7604 23.7363 23.8945 22.6022 23.8945 21.2044V2.53187C23.8945 1.13407 22.7604 0 21.3626 0C20.4659 0 19.6483 0.448352 19.1736 1.21319V1.21319Z"></path></g><defs><clipPath id="clip0"><rect width="24" height="23.7363" fill="white"></rect></clipPath></defs></svg>
                          
                        </div>
                        <p className="w-3/4">{t("Navbar.login")}</p>
                      </div>
                    </button>
                    <div className="menu-item" >
                      <div className="font-open-sans font-extrabold text-base leading-4 flex text-white mt-12 justify-between uppercase" >
                        <button className="font-open-sans font-extrabold text-base leading-4 flex text-white justify-between uppercase w-full" onClick={handleExploreSubMenuShow} >
                          <p>{t("Navbar.explore")}</p>
                          <img
                            className=""
                            src={menuArrowRight}
                            alt='banner'
                            width="20px"
                            height="20px" />
                        </button>
                        <div className={classNames(showExploreSubMenu ? "transform -translate-x-[620px] duration-600" : "transform -translate-x-80 duration-600", "w-[300px] h-full dark:bg-[#0A0A0A]  fixed z-[1200] -right-[620px] top-[80px] px-[42px]")}>
                          <button className="font-open-sans font-extrabold text-base leading-4 flex text-white  justify-between uppercase" onClick={handleExploreSubMenuShow}>
                            <img
                              className=""
                              src={menuArrowLeft}
                              alt='banner'
                              width="20px"
                              height="20px" />
                            <p className="ml-4">{t("Navbar.explore")}</p>
                          </button>
                          <a className="font-open-sans font-semibold text-base leading-4 flex text-white mt-6 justify-between uppercase ml-8 w-full" href="/explore?search=collections">
                            <p className="font-open-sans font-semibold text-base">{t("Navbar.collections")}</p>
                            <img
                              className="mr-4"
                              src={filter}
                              alt='banner'
                              width="25px"
                              height="20px" />
                          </a>
                          <a className="font-open-sans font-semibold text-base leading-4 flex text-white mt-3 justify-between uppercase ml-8 w-full" href="/explore?search=tokens">
                            <p className="font-open-sans font-semibold text-base">{t("Navbar.tokens")}</p>
                            <img
                              className="mr-4"
                              src={tokenIcon}
                              alt='banner'
                              width="25px"
                              height="20px" />
                          </a>
                          <a className="font-open-sans font-semibold text-base leading-4 flex text-white mt-3 justify-between uppercase ml-8 w-full" href="/explore?search=artists">
                            <p className="font-open-sans font-semibold text-base">{t("Navbar.artists")}</p>
                            <img
                              className="mr-4"
                              src={artistIcon}
                              alt='banner'
                              width="25px"
                              height="20px" />
                          </a>
                        </div>
                      </div>
                    </div>
                    <div className="menu-item" >
                      <button className="font-open-sans font-extrabold text-base leading-4 flex text-white mt-3 justify-between uppercase w-full" onClick={handleFinancesSubMenu} >
                        <p>{t("Navbar.finance")}</p>
                        <img
                          className=""
                          src={menuArrowRight}
                          alt='banner'
                          width="20px"
                          height="20px" />
                      </button>
                      <div className={classNames(showFinanceSubMenu ? "transform -translate-x-[620px] duration-600" : "transform -translate-x-80 duration-600", "w-[300px] h-full dark:bg-[#0A0A0A]  fixed z-[1200] -right-[620px] top-[80px] px-[42px]")}>
                        <button className="font-open-sans font-extrabold text-base leading-4 flex text-white justify-between uppercase " onClick={handleFinancesSubMenu}>
                          <img
                            className=""
                            src={menuArrowLeft}
                            alt='banner'
                            width="20px"
                            height="20px" />
                          <p className="ml-4">{t("Navbar.finance")}</p>
                        </button>
                        <button className="font-open-sans font-semibold text-base leading-4 flex text-white mt-6 justify-between uppercase ml-8 w-full" onClick={async () => { futureFeatureMsg(t("Navbar.auctions")); }}>
                          <p className="font-open-sans font-semibold text-base">{t("Navbar.auctions")}</p>
                          <img
                            className="mr-4"
                            src={finances}
                            alt='banner'
                            width="25px"
                            height="20px" />
                        </button>
                        <button className="font-open-sans font-semibold text-base leading-4 flex text-white mt-3 justify-between uppercase ml-8 w-full" onClick={async () => { futureFeatureMsg(t("Navbar.loans")); }}>
                          <p className="font-open-sans font-semibold text-base">{t("Navbar.loans")}</p>
                          <img
                            className="mr-4"
                            src={loans}
                            alt='banner'
                            width="25px"
                            height="20px" />
                        </button>
                        <button className="font-open-sans font-semibold text-base leading-4 flex text-white mt-3 justify-between uppercase ml-8 w-full" onClick={async () => { futureFeatureMsg(t("Navbar.staking")); }}>
                          <p className="font-open-sans font-semibold text-base">{t("Navbar.staking")}</p>
                          <img
                            className="mr-4"
                            src={stacking}
                            alt='banner'
                            width="25px"
                            height="20px" />
                        </button>
                      </div>
                    </div>
                    <div className="menu-item" >
                      <div className="font-open-sans font-extrabold text-base leading-4 flex text-white mt-3 justify-between uppercase" onClick={() => { window.location = "/community" }}>
                        <p>{t("Navbar.community")}</p>
                      </div>
                    </div>
                    <button className="flex inline-flex rounded-xlarge w-full h-[40px]   lg:w-[159px] mt-10" onClick={handleSignIn}>
                      <div className="flex flex-col font-extrabold h-full text-white  text-center  justify-center shadow-s w-full border-solid border-2 rounded-md border-white2 hover:bg-outlineHover active:bg-outlinePressed ">
                        <span className="title-font  text-white font-open-sans text-base lg:font-extrabold  p-5 uppercase leading-6 flex justify-center hover:text-textOutlineHover active:text-textOutlinePressed">{t("Navbar.create")} <img className="manImg  self-center ml-[6px]" width="20px" height="20px" src={createNft}></img> </span>
                      </div>
                    </button>
                    <button className="flex inline-flex rounded-xlarge w-full h-[40px]  lg:w-[159px] mt-3" onClick={handleSignIn}>
                      <div className="flex flex-col font-extrabold h-full text-white  text-center  justify-center shadow-s w-full border-solid border-2 rounded-md border-white2 hover:bg-outlineHover active:bg-outlinePressed ">
                        <span className="title-font  text-white font-open-sans text-base lg:font-extrabold p-0 uppercase leading-6 flex justify-center hover:text-textOutlineHover active:text-textOutlinePressed">{t("Navbar.createCollection")} <img className="manImg self-center ml-[6px]" width="20px" height="20px" src={createCol}></img> </span>
                      </div>
                    </button>
                  </Menu>
                </div>

              </>
          }



        </div>

      </header>
    </>
  );
}

LightHeaderB.defaultProps = {
  theme: "indigo",
};

LightHeaderB.propTypes = {
  theme: PropTypes.string.isRequired,
};

export default LightHeaderB;
