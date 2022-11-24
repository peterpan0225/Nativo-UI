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
import filter from '../assets/img/navBar/filter_none.png';
import accountCircle from '../assets/img/navBar/profile/account_circle.png';
import createCollection from '../assets/img/navBar/profile/crear_coleccion.png';
import createToken from '../assets/img/navBar/profile/crear_token.png';
import salir from '../assets/img/navBar/profile/Salir.png';
import empty from '../assets/img/navBar/profile/empty.png';
import logout from '../assets/img/navBar/profile/Salir.png';
import search from '../assets/img/navBar/search/search.png';
import staking from '../assets/img/navBar/profile/Staking.png';
import { useFormik } from "formik";
import * as Yup from "yup";
import { useHistory } from 'react-router-dom';
import { slide as Menu } from 'react-burger-menu';
import menuArrowRight from '../assets/img/navBar/menu/chevron-left.png';
import menuArrowLeft from '../assets/img/navBar/menu/chevron-right.png';
import createNft from '../assets/img/navBar/menu/plus-nft.png';
import createCol from '../assets/img/navBar/menu/plus-col.png';
import bell from '../assets/img/navBar/menu/Bell.png';

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
      window.location.href = 'create';
    } else {
      handleSignIn()
    }

  }

  async function logOut() {
    localStorage.removeItem('userMedia');
    const wallet = await selector.wallet();
    wallet.signOut().catch((err) => {
      console.log("Failed to sign out");
      console.error(err);
    }).then((res) => {
      window.location.href = "/"
    })

  }

  async function futureFeatureMsg(section) {
    Swal.fire({
      imageUrl: nativoLogo,
      imageWidth: 200,
      imageHeight: 200,
      imageAlt: 'Custom image',
      title: "¡Atención!",
      text: "La sección de " + section + " estará disponible muy pronto",
      confirmButtonColor: '#E79211',
      confirmButtonText: 'Cerrar'
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
    window.location.href = '/collections?search=all'
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
                <img
                  className=""
                  src={search}
                  alt={search}
                  width="20px"
                  height="20px" />
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
                        <div className="mr-5  text-base  hover:dark:text-yellow4  dark:text-white font-open-sans font-extrabold uppercase  h-full  flex justify-center items-center">
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
                    <MenuB.Items static className="w-[219px]  md:w-[219px] origin-top-right absolute -right-[100px] mt-0 divide-y  shadow-lg dark:bg-[#000] outline-none border-t-4 border-b-4 border-[#032B30]">
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
                        <MenuB.Item onClick={async () => { window.location.href = "/market" }}>
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
              <button className="w-[25px] h-[25px] mr-[5px] hidden lg:inline-block">
                      <img
                        className="w-[25px] h-[25px]"
                        src={bell}
                        alt={bell}
                        width={25}
                        height={25} />
                </button>
                <MenuB as="div" className="relative  text-left w-full md:w-auto md:ml-4 hidden lg:inline-block">
                  {({ open }) => (
                    <>
                      <div className="flex flex-nowrap flex-row-reverse">
                        <MenuB.Button className="w-[75px] md:w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-2 py-1 bg-white text-sm  text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-yellow-500 font-raleway font-normal">
                          <div className="w-full  flex relative ">
                            {state.userMedia ?
                              <div className="w-[35px] h-[35px]  bg-circle rounded-full  relative bg-cover " style={{ backgroundImage: `url(https://nativonft.mypinata.cloud/ipfs/${state.userMedia})` }} >
                              </div> :
                              <div className="w-[35px] h-[35px]  bg-circle rounded-full bg-pink-2 relative">
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
                          className="w-[219px]  md:w-[219px] origin-top-right absolute right-[0] mt-[13px] divide-y  shadow-lg dark:bg-[#000] outline-none border-t-4 border-b-4 border-[#032B30]"
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
                                <a href="/collectionData/create" className={classNames(active ? "dark:text-white font-extrabold  bg-[#2A747E]" : "dark:text-white ml-2 font-bold", "block px-2  text-base text-center font-open-sans uppercase")}>
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
                  <button className="w-[25px] h-[25px]  mr-[10px]" onClick={()=>{formik.resetForm(); handleSearchSubMenu()}}>
                      <img
                        className="w-[25px] h-[25px]"
                        src={search}
                        alt={search}
                        width={25}
                        height={25} />
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
                          <img
                            className=""
                            src={search}
                            alt={search}
                            width="20px"
                            height="20px" />
                        </button>
                      </form>
                    </div>
                    <button className="w-[25px] h-[25px] mr-[5px]">
                      <img
                        className="w-[25px] h-[25px]"
                        src={bell}
                        alt={bell}
                        width={25}
                        height={25} />
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
                          <p className="font-open-sans font-semibold text-base">MI PERFIL</p>
                          <img
                            className="mr-4"
                            src={accountCircle}
                            alt='banner'
                            width="25px"
                            height="20px" />
                        </button>
                        <button className="font-open-sans font-semibold text-base leading-4 flex text-white mt-3 justify-between uppercase ml-8 w-full" onClick={async () => { futureFeatureMsg(t("Navbar.loans")); }}>
                          <p className="font-open-sans font-semibold text-base">CREAR COLECCION</p>
                          <img
                            className="mr-4"
                            src={createCollection}
                            alt='banner'
                            width="25px"
                            height="20px" />
                        </button>
                        <button className="font-open-sans font-semibold text-base leading-4 flex text-white mt-3 justify-between uppercase ml-8 w-full" onClick={async () => { futureFeatureMsg(t("Navbar.staking")); }}>
                          <p className="font-open-sans font-semibold text-base">CREAR NFT</p>
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
                            <p className="ml-4">EXPLORAR</p>
                          </button>
                          <a className="font-open-sans font-semibold text-base leading-4 flex text-white mt-6 justify-between uppercase ml-8 w-full" href="/collections">
                            <p className="font-open-sans font-semibold text-base">COLECCIONES</p>
                            <img
                              className="mr-4"
                              src={filter}
                              alt='banner'
                              width="25px"
                              height="20px" />
                          </a>
                          <a className="font-open-sans font-semibold text-base leading-4 flex text-white mt-3 justify-between uppercase ml-8 w-full" href="/market">
                            <p className="font-open-sans font-semibold text-base">TOKENS</p>
                            <img
                              className="mr-4"
                              src={tokenIcon}
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
                          <p className="font-open-sans font-semibold text-base">SUBASTAS</p>
                          <img
                            className="mr-4"
                            src={finances}
                            alt='banner'
                            width="25px"
                            height="20px" />
                        </button>
                        <button className="font-open-sans font-semibold text-base leading-4 flex text-white mt-3 justify-between uppercase ml-8 w-full" onClick={async () => { futureFeatureMsg(t("Navbar.loans")); }}>
                          <p className="font-open-sans font-semibold text-base">PRESTAMOS</p>
                          <img
                            className="mr-4"
                            src={loans}
                            alt='banner'
                            width="25px"
                            height="20px" />
                        </button>
                        <button className="font-open-sans font-semibold text-base leading-4 flex text-white mt-3 justify-between uppercase ml-8 w-full" onClick={async () => { futureFeatureMsg(t("Navbar.staking")); }}>
                          <p className="font-open-sans font-semibold text-base">STAKING</p>
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
                        <span className="title-font  text-white font-open-sans text-base lg:font-extrabold  p-5 uppercase leading-6 flex justify-center ">CREAR NFT <img className="manImg  self-center ml-[6px]" width="20px" height="20px" src={createNft}></img> </span>
                      </div>
                    </button>
                    <button className="flex  rounded-xlarge w-full h-[40px]  lg:w-[159px] mt-3" onClick={() => { window.location = "/collectionData/create" }}>
                      <div className="flex flex-col font-extrabold h-full text-white  text-center  justify-center shadow-s w-full border-solid border-2 rounded-md border-white2  ">
                        <span className="title-font  text-white font-open-sans text-base lg:font-extrabold p-5 uppercase leading-6 flex justify-center ">CREAR COLECCIÓN <img className="manImg self-center ml-[6px]" width="20px" height="20px" src={createCol}></img> </span>
                      </div>
                    </button>
                    <button className="flex  rounded-xlarge w-full h-[40px]  lg:w-[159px] mt-3" onClick={() => { logOut() }}>
                      <div className="flex flex-col font-extrabold h-full text-yellow2  text-center  justify-center shadow-s w-full border-solid border-2 rounded-md border-yellow2">
                        <span className="title-font  text-yellow2 font-open-sans text-base lg:font-extrabold p-5 uppercase leading-6 flex justify-center ">SALIR<img className="manImg self-center ml-[6px]" width="20px" height="20px" src={salir}></img> </span>
                      </div>
                    </button>
                  </Menu>
                </div>
              </>
              :
              <>
                <button
                  className={`ml-auto  text-white bg-yellow2 border-0 py-2 px-6 focus:outline-none w-[320px] lg:w-auto rounded-md font-open-sans font-extrabold uppercase hidden lg:flex`}
                  style={{ justifyContent: "center" }}
                  // disabled={state?.tokens.onSale}
                  onClick={handleSignIn}>

                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9.62451 0.609359L7.11711 4.33336C7.0765 4.3871 7.05769 4.45426 7.06455 4.52129C7.07138 4.58836 7.10332 4.65033 7.15397 4.69475C7.20463 4.7392 7.27018 4.76277 7.33751 4.7608C7.4048 4.75879 7.46888 4.73135 7.51681 4.68401L9.98423 2.55069C9.99844 2.53763 10.0162 2.52904 10.0352 2.52598C10.0543 2.52292 10.0738 2.52553 10.0914 2.53348C10.109 2.54143 10.1239 2.55438 10.1342 2.57071C10.1445 2.58704 10.1498 2.60604 10.1494 2.62535V9.33066C10.1492 9.35102 10.1428 9.37084 10.1311 9.38745C10.1193 9.40407 10.1028 9.4167 10.0837 9.42366C10.0646 9.43062 10.0437 9.43157 10.0241 9.42639C10.0044 9.4212 9.98679 9.41014 9.97356 9.39468L2.51271 0.461356C2.3936 0.31794 2.24459 0.202334 2.07612 0.122641C1.90765 0.0429479 1.72381 0.0010978 1.53747 2.50247e-05H1.27767C0.938812 2.50247e-05 0.613831 0.134741 0.37422 0.374536C0.134611 0.614332 0 0.939566 0 1.27869V10.7213C0 11.0605 0.134611 11.3857 0.37422 11.6255C0.613831 11.8653 0.938812 12 1.27767 12C1.49601 12 1.7107 11.944 1.90125 11.8373C2.0918 11.7306 2.25186 11.5768 2.36616 11.3907L4.87354 7.66668C4.91418 7.61291 4.93295 7.54578 4.92613 7.47871C4.91927 7.41168 4.88732 7.34971 4.83667 7.30526C4.78605 7.26084 4.72047 7.23724 4.65317 7.23924C4.58584 7.24125 4.52177 7.26866 4.47384 7.31602L2.00644 9.44933C1.99221 9.4624 1.97447 9.471 1.95541 9.47405C1.93635 9.47711 1.91681 9.47448 1.89923 9.46653C1.88163 9.45859 1.86676 9.44566 1.85645 9.42931C1.84614 9.41299 1.84085 9.39399 1.84123 9.37469V2.67602C1.84143 2.65566 1.84784 2.63585 1.85959 2.61923C1.87134 2.60261 1.88788 2.58998 1.907 2.58303C1.92612 2.57607 1.9469 2.57512 1.96658 2.5803C1.98625 2.58548 2.00387 2.59654 2.01709 2.61202L9.47794 11.5453C9.59795 11.6875 9.74751 11.8017 9.91621 11.88C10.0849 11.9582 10.2686 11.9988 10.4545 11.9987H10.721C10.8888 11.9987 11.0549 11.9656 11.2099 11.9013C11.3649 11.8371 11.5058 11.7429 11.6244 11.6242C11.7431 11.5054 11.8372 11.3645 11.9014 11.2093C11.9656 11.0542 11.9986 10.8879 11.9986 10.72V1.27869C11.9987 1.1101 11.9653 0.94317 11.9006 0.787509C11.8359 0.631851 11.7411 0.490536 11.6216 0.371697C11.5021 0.252857 11.3603 0.158839 11.2044 0.0950521C11.0484 0.0312655 10.8814 -0.0010297 10.713 2.50247e-05C10.4946 5.12861e-05 10.28 0.056073 10.0894 0.162744C9.89884 0.269415 9.73878 0.423179 9.62451 0.609359Z" fill="#00c6a2"></path></svg> {t("Navbar.login")}
                </button>
                <div className="lg:hidden">
                  <div className="flex mr-[35px]">
                    <button className="w-[25px] h-[25px]  mr-[10px]" onClick={()=>{formik.resetForm(); handleSearchSubMenu()}}>
                      <img
                        className="w-[25px] h-[25px]"
                        src={search}
                        alt={search}
                        width={25}
                        height={25} />
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
                          <img
                            className=""
                            src={search}
                            alt={search}
                            width="20px"
                            height="20px" />
                        </button>
                      </form>
                    </div>
                  </div>
                  <Menu isOpen={state.isOpen} onStateChange={() => handleMenuStateChange()} pageWrapId={'page-wrap'} outerContainerId={'outer-container'}  >
                    <button
                      className={` mt-5 text-white bg-yellow2 border-0 py-2 px-6 focus:outline-none w-[220px] md:w-auto rounded-md font-open-sans font-extrabold uppercase hidden md:flex`}
                      style={{ justifyContent: "center" }}
                      // disabled={state?.tokens.onSale}
                      onClick={handleSignIn}>

                      {t("Navbar.login")}
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
                            <p className="ml-4">EXPLORAR</p>
                          </button>
                          <a className="font-open-sans font-semibold text-base leading-4 flex text-white mt-6 justify-between uppercase ml-8 w-full" href="/collections">
                            <p className="font-open-sans font-semibold text-base">COLECCIONES</p>
                            <img
                              className="mr-4"
                              src={filter}
                              alt='banner'
                              width="25px"
                              height="20px" />
                          </a>
                          <a className="font-open-sans font-semibold text-base leading-4 flex text-white mt-3 justify-between uppercase ml-8 w-full" href="/market">
                            <p className="font-open-sans font-semibold text-base">TOKENS</p>
                            <img
                              className="mr-4"
                              src={tokenIcon}
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
                          <p className="font-open-sans font-semibold text-base">SUBASTAS</p>
                          <img
                            className="mr-4"
                            src={finances}
                            alt='banner'
                            width="25px"
                            height="20px" />
                        </button>
                        <button className="font-open-sans font-semibold text-base leading-4 flex text-white mt-3 justify-between uppercase ml-8 w-full" onClick={async () => { futureFeatureMsg(t("Navbar.loans")); }}>
                          <p className="font-open-sans font-semibold text-base">PRESTAMOS</p>
                          <img
                            className="mr-4"
                            src={loans}
                            alt='banner'
                            width="25px"
                            height="20px" />
                        </button>
                        <button className="font-open-sans font-semibold text-base leading-4 flex text-white mt-3 justify-between uppercase ml-8 w-full" onClick={async () => { futureFeatureMsg(t("Navbar.staking")); }}>
                          <p className="font-open-sans font-semibold text-base">STAKING</p>
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
                        <span className="title-font  text-white font-open-sans text-base lg:font-extrabold  p-5 uppercase leading-6 flex justify-center hover:text-textOutlineHover active:text-textOutlinePressed">CREAR NFT <img className="manImg  self-center ml-[6px]" width="20px" height="20px" src={createNft}></img> </span>
                      </div>
                    </button>
                    <button className="flex inline-flex rounded-xlarge w-full h-[40px]  lg:w-[159px] mt-3" onClick={handleSignIn}>
                      <div className="flex flex-col font-extrabold h-full text-white  text-center  justify-center shadow-s w-full border-solid border-2 rounded-md border-white2 hover:bg-outlineHover active:bg-outlinePressed ">
                        <span className="title-font  text-white font-open-sans text-base lg:font-extrabold p-5 uppercase leading-6 flex justify-center hover:text-textOutlineHover active:text-textOutlinePressed">CREAR COLECCIÓN <img className="manImg self-center ml-[6px]" width="20px" height="20px" src={createCol}></img> </span>
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
