import React, { Fragment, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Menu, Transition } from "@headlessui/react";
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
import logout from '../assets/img/navBar/profile/Salir.png';
import search from '../assets/img/navBar/search/search.png';
import staking from '../assets/img/navBar/profile/Staking.png';
import { useFormik } from "formik";
import * as Yup from "yup";
import { useHistory } from 'react-router-dom';

function LightHeaderB(props) {
  const { selector, modal, accounts, accountId } = useWalletSelector();
  const APIURL = process.env.REACT_APP_API_TG;
  const [state, setState] = useState({
    owner: "",
    userData: "",
    dropdown:
      blockchains[parseInt(localStorage.getItem("blockchain"))] || "Blockchain",
  });
  const [buscar, setBuscar] = useState({buscar: ""});
  const [menu, setmenu] = useState(true);
  const [Beta, setBeta] = useState(true);
  const [t, i18n] = useTranslation("global")
  const [stateLogin, setStateLogin] = useState(false);
  const [isShowing, setIsShowing] = useState(false)
  const [isShowingE, setIsShowingE] = useState(false);
  const history = useHistory();
  
  const formik = useFormik({
    initialValues: {
      search: ""
    },
    //validaciones
    validationSchema: Yup.object({
      search: Yup.string()
    }),
    onSubmit: async (value) => {
      console.log('12345678',buscar.buscar);
      console.log('value',value);
      console.log('value.search.trim().length ',value.search.trim().length);
     
       if(value.search.trim().length == 0) {
        window.location = '/collections?search=all';
       } else {
        const test = encodeURIComponent(value.search.trim());
        console.log('test', test);
        const URI = '/collections?search='+ test;
        console.log('URI',URI);
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

  let _handleChange = async(e)=>{
    console.log('handleChanvge',e.target.value);
    if(e.keyCode === 13){ 
      formik.handleSubmit(e.target.value);
    } else {
      setBuscar({...buscar, buscar: e.target.value})
    }
  }

  let handleAllCollections = async(e) => {
    window.location.href = '/collections?search=all'
  }


  return (
    <>

      <header className="text-gray-600 body-font shadow-sm sticky top-0 z-50 bg-[#ffffff]">
        <div className=" flex  px-5  flex-row items-center movil-header dark:bg-[#000] h-[80px]">
          <div className="w-full flex flex-row justify-between md:w-auto">
            <a
              href="/"
              className="flex flex-row"
            >
              <img src={nativoLogoWhite} className="d-inline-block align-top w-[85px] lg:w-[105px] lg:h-[60px]" alt="logo" width="105px" height="60px" />
            </a>
          </div>
          <nav className={" md:mr-auto md:ml-4 md:py-1 md:border-l md:border-gray-400	flex flex-wrap items-center text-base justify-center " + (menu ? "esconder-nav" : "")}>
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
                  className={`w-full flex flex-col  font-open-sans h-full text-white  text-left pl-2 pr-8 justify-center shadow-s border-solid border rounded-md border-white2  bg-black  focus-visible:outline-none focus-visible:shadow-s `}
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
         


            <Menu as="div" className="relative inline-block text-left w-full md:w-auto md:ml-4 h-full"
              onMouseEnter={() => setIsShowingE(true)}
              onMouseLeave={() => setIsShowingE(false)}
            >
              {({ open }) => (
                <>
                  <div className="flex flex-nowrap flex-row-reverse h-full">
                    <Menu.Button className="w-[75px] md:w-full h-full flex justify-center items-center rounded-md px-2 py-1 border-0  hover:animate-pulse">
                      <div className="w-full flex relative h-full">
                        <div className="mr-5  text-base  hover:dark:text-yellow4  dark:text-white font-open-sans font-extrabold uppercase  h-full  flex justify-center items-center">
                          {t("Navbar.explore")}
                        </div>
                      </div>
                    </Menu.Button>
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
                    <Menu.Items static className="w-[219px]  md:w-[219px] origin-top-right absolute -right-[100px] mt-0 divide-y  shadow-lg dark:bg-[#000] outline-none border-t-4 border-b-4 border-[#032B30]">
                      <div className="py-1">
                      <Menu.Item onClick={handleAllCollections}>
                          {({ active }) => (
                            <a className={classNames(active ? "dark:text-white font-extrabold  bg-[#2A747E]" : "dark:text-white ml-2 font-bold", "block px-2 py-2 text-base text-center font-open-sans uppercase")}>
                              <div className="flex justify-start cursor-pointer">
                              <img
                                    className="mr-2"
                                    src={filter}
                                    alt='banner'
                                  width="20px"
                                  height="20px"/>
                                  <p className=" self-center"> {t("Navbar.collections")}</p>
                              </div>
                            </a>
                          )}
                        </Menu.Item>
                        <Menu.Item onClick={async () => { window.location.href="/market" }}>
                          {({ active }) => (
                            <a className={classNames(active ? " dark:text-white font-extrabold  bg-[#2A747E]" : "dark:text-white ml-2 font-bold", " block px-2 py-2 text-base text-center font-open-sans uppercase")}>
                              <div className="flex justify-start cursor-pointer">
                                  <img
                                    className="mr-2"
                                    src={tokenIcon}
                                    alt='banner'
                                  width="20px"
                                  height="20px"/>
                                <p className=" self-center"> {t("Navbar.tokens")}</p>
                              </div>
                            </a>
                          )}
                        </Menu.Item>

                        

                      </div>
                    </Menu.Items>
                  </Transition>
                </>
              )}
            </Menu>

            <Menu as="div" className="relative inline-block text-left w-full md:w-auto md:ml-4 h-full"
              onMouseEnter={() => setIsShowing(true)}
              onMouseLeave={() => setIsShowing(false)}
            >
              {({ open }) => (
                <>
                  <div className="flex flex-nowrap flex-row-reverse h-full">
                    <Menu.Button className="w-[75px] md:w-full h-full flex justify-center items-center rounded-md px-2 py-1 border-0  hover:animate-pulse">
                      <div className="w-full flex relative h-full">
                        <div className="mr-5  text-base  hover:dark:text-yellow4  dark:text-white font-open-sans font-extrabold uppercase  h-full  flex justify-center items-center">
                          {t("Navbar.finance")}
                        </div>
                      </div>
                    </Menu.Button>
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
                    <Menu.Items static className="w-[219px]  md:w-[219px] origin-top-right absolute -right-[100px] mt-0 divide-y  shadow-lg dark:bg-[#000] outline-none border-t-4 border-b-4 border-[#032B30]">
                      <div className="py-1">
                        <Menu.Item onClick={async () => { futureFeatureMsg(t("Navbar.auctions")); }}>
                          {({ active }) => (
                            <a className={classNames(active ? " dark:text-white font-extrabold  bg-[#2A747E]" : "dark:text-white ml-2 font-bold", " block px-2 py-2 text-base text-center font-open-sans uppercase")}>
                              <div className="flex justify-start cursor-pointer">
                                  <img
                                    className="mr-2"
                                    src={finances}
                                    alt='banner'
                                  width="20px"
                                  height="20px"/>
                                <p className=" self-center"> {t("Navbar.auctions")}</p>
                              </div>
                            </a>
                          )}
                        </Menu.Item>

                        <Menu.Item onClick={async () => { futureFeatureMsg(t("Navbar.loans")); }}>
                          {({ active }) => (
                            <a className={classNames(active ? "dark:text-white font-extrabold  bg-[#2A747E]" : "dark:text-white ml-2 font-bold", "block px-2 py-2 text-base text-center font-open-sans uppercase")}>
                              <div className="flex justify-start cursor-pointer">
                              <img
                                    className="mr-2"
                                    src={loans}
                                    alt='banner'
                                  width="20px"
                                  height="20px"/>
                                  <p className=" self-center"> {t("Navbar.loans")}</p>
                              </div>
                            </a>
                          )}
                        </Menu.Item>

                        <Menu.Item onClick={async () => { futureFeatureMsg(t("Navbar.staking")); }}>
                          {({ active }) => (
                            <a className={classNames(active ? "dark:text-white font-extrabold  bg-[#2A747E]" : "dark:text-white ml-2 font-bold", "block px-2 py-2 text-base text-center font-open-sans uppercase")}>
                              <div className="flex justify-start cursor-pointer">
                              <img
                                    className="mr-2"
                                    src={stacking}
                                    alt='banner'
                                  width="20px"
                                  height="20px"/>
                                <p className=" self-center"> {t("Navbar.staking")}</p>
                              </div>
                            </a>
                          )}
                        </Menu.Item>
                      </div>
                    </Menu.Items>
                  </Transition>
                </>
              )}
            </Menu>

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
              <Menu as="div" className="relative inline-block text-left w-full md:w-auto md:ml-4">
                {({ open }) => (
                  <>
                    <div className="flex flex-nowrap flex-row-reverse">
                      <Menu.Button className="w-[75px] md:w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-2 py-1 bg-white text-sm  text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-yellow-500 font-raleway font-normal">
                        <div className="w-full  flex relative ">
                          {state.userMedia ?
                            <div className="w-[35px] h-[35px]  bg-circle rounded-full  relative bg-cover " style={{ backgroundImage: `url(https://nativonft.mypinata.cloud/ipfs/${state.userMedia})` }} >
                            </div> :
                            <div className="w-[35px] h-[35px]  bg-circle rounded-full bg-pink-2 relative">
                            </div>
                          }

                        </div>
                      </Menu.Button>
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
                      <Menu.Items
                        static
                        className="w-[219px]  md:w-[219px] origin-top-right absolute right-[0] mt-[13px] divide-y  shadow-lg dark:bg-[#000] outline-none border-t-4 border-b-4 border-[#032B30]"
                      >
                        <div className="py-1">
                          <Menu.Item
                          >
                            {({ active }) => (
                              <a href={"/profile/" + state.owner.split('.')[0]}  className={classNames(active ? "dark:text-white font-extrabold  bg-[#2A747E]" : "dark:text-white ml-2 font-bold", "block px-2  text-base text-center font-open-sans uppercase")}>
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
                          </Menu.Item>
 







                          <Menu.Item
                          >
                            {({ active }) => (
                              <a href="/mynfts"  className={classNames(active ? "dark:text-white font-extrabold  bg-[#2A747E]" : "dark:text-white ml-2 font-bold", "block px-2  text-base text-center font-open-sans uppercase")}>
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
                          </Menu.Item>

                          <Menu.Item
                          >
                            {({ active }) => (
                              <a href="/collectionData/create"  className={classNames(active ? "dark:text-white font-extrabold  bg-[#2A747E]" : "dark:text-white ml-2 font-bold", "block px-2  text-base text-center font-open-sans uppercase")}>
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
                          </Menu.Item>


                          <Menu.Item
                          >
                            {({ active }) => (
                              <a href="/create"  className={classNames(active ? "dark:text-white font-extrabold  bg-[#2A747E]" : "dark:text-white ml-2 font-bold", "block px-2  text-base text-center font-open-sans uppercase")}>
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
                          </Menu.Item>
 
                 

                          <Menu.Item
                            onClick={async () => {
                              logOut();
                            }}
                          >
                            {({ active }) => (
                              <a  className={classNames(active ? " font-extrabold  bg-[#2A747E]" : "dark:text-yellow4 ml-2 font-bold", "block px-2  text-base text-center font-open-sans uppercase")}>
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
                          </Menu.Item>
                        </div>
                      </Menu.Items>
                    </Transition>
                  </>
                )}
              </Menu>
              :
              <>
                <button
                  className={`ml-auto mt-2 text-white bg-yellow2 border-0 py-2 px-6 focus:outline-none w-[320px] md:w-auto rounded-md font-open-sans font-extrabold uppercase hidden md:flex`}
                  style={{ justifyContent: "center" }}
                  // disabled={state?.tokens.onSale}
                  onClick={handleSignIn}>

                  {t("Navbar.login")}
                </button>
                <Menu as="div" className="relative inline-block text-left w-full md:w-auto md:ml-4 md:hidden">

                  {({ open }) => (
                    <>

                      <div className="flex flex-nowrap flex-row-reverse">

                        <Menu.Button className="w-[75px] md:w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-2 py-1 bg-white text-sm  text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-yellow-500 font-raleway font-normal">

                          <div className="w-full  flex relative ">
                            <img
                              alt="ecommerce"
                              className=" object-contain md:object-scale-down rounded-xlarge  lg:h-auto w-[35px] h-[35px] m-auto"
                              src={defaultUser}
                            />
                          </div>

                          <ChevronDownIcon
                            className="-mr-1 ml-2  w-5"
                            aria-hidden="true"
                          />
                        </Menu.Button>
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


                        <Menu.Items
                          static
                          className="w-[180px] origin-top-right absolute right-0 mt-2 divide-y rounded-md shadow-lg bg-white outline-none"
                        >
                          <div className="py-1">
                            <Menu.Item>
                              {({ active }) => (
                                <a href="/collections" className={classNames(
                                  active
                                    ? "bg-yellow text-darkgray "
                                    : "text-darkgray ml-2 ",
                                  "block px-2 py-2 text-sm text-center font-raleway font-normal "
                                )}>
                                  <div className="flex justify-start">
                                    <span className=" m-2">
                                      <svg xmlns="http://www.w3.org/2000/svg" id="Layer_1" data-name="Layer 1" viewBox="0 0 24 24" width="15" height="15"><path d="M18.5,0h-5A5.5,5.5,0,0,0,8.015,5.21a5.5,5.5,0,0,0-4,5A5.506,5.506,0,0,0,0,15.5v3A5.507,5.507,0,0,0,5.5,24h5A5.507,5.507,0,0,0,16,18.5v-.213a5.512,5.512,0,0,0,3.919-4.38A5.162,5.162,0,0,0,24,8.5v-3A5.507,5.507,0,0,0,18.5,0ZM3,15.5A2.5,2.5,0,0,1,5.5,13h5A2.5,2.5,0,0,1,13,15.5v.2l-2.115,2.115a1,1,0,0,1-1.415,0L9,17.335a1,1,0,0,0-1.347-.061l-3.7,3.176A2.488,2.488,0,0,1,3,18.5ZM17,13a2.492,2.492,0,0,1-1.025,2.008A5.506,5.506,0,0,0,10.5,10H7.051A2.5,2.5,0,0,1,9.5,8h5A2.5,2.5,0,0,1,17,10.5Zm4-4.5a2.719,2.719,0,0,1-1,2.226V10.5A5.507,5.507,0,0,0,14.5,5H11.051A2.5,2.5,0,0,1,13.5,3h5A2.5,2.5,0,0,1,21,5.5Zm-17,7A1.5,1.5,0,1,1,5.5,17,1.5,1.5,0,0,1,4,15.5Z" /></svg>
                                    </span>
                                    <p className=" self-center"> {t("Navbar.collections")}</p>
                                  </div>

                                </a>
                              )}
                            </Menu.Item>
                            <Menu.Item>
                              {({ active }) => (
                                <a href="/market" className={classNames(
                                  active
                                    ? "bg-yellow text-darkgray "
                                    : "text-darkgray ml-2 ",
                                  "block px-2 py-2 text-sm text-center font-raleway font-normal  "
                                )}>
                                  <div className="flex justify-start">
                                    <span className=" m-2"><svg xmlns="http://www.w3.org/2000/svg" id="Layer_1" data-name="Layer 1" viewBox="0 0 24 24" width="15" height="15"><path d="M19,17a5.994,5.994,0,0,1-3-.806A5.994,5.994,0,0,1,13,17H11a5.938,5.938,0,0,1-3-.818A5.936,5.936,0,0,1,5,17H4a5.949,5.949,0,0,1-3-.813V21a3,3,0,0,0,3,3H20a3,3,0,0,0,3-3V16.188A5.958,5.958,0,0,1,20,17Z" /><path d="M17,0V6H15V0H9V6H7V0H2.2L.024,9.783,0,11a4,4,0,0,0,4,4H5a3.975,3.975,0,0,0,3-1.382A3.975,3.975,0,0,0,11,15h2a3.99,3.99,0,0,0,3-1.357A3.99,3.99,0,0,0,19,15h1a4,4,0,0,0,4-4V10L21.8,0Z" /></svg>
                                    </span>
                                    <p className=" self-center">{t("Navbar.onSale")}</p>
                                  </div>
                                </a>
                              )}
                            </Menu.Item>
                            <Menu.Item>
                              {({ active }) => (
                                <a className={classNames(
                                  active
                                    ? "bg-yellow text-darkgray "
                                    : "text-darkgray ml-2 ",
                                  "block px-2 py-2 text-sm text-center font-raleway font-normal cursor-pointer"
                                )}
                                  onClick={async () => { futureFeatureMsg(t("Navbar.auctions")); }}
                                >
                                  <div className="flex justify-start">
                                    <span className=" m-2"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                                    </span>
                                    <p className=" self-center">{t("Navbar.auctions")}</p>
                                  </div>
                                </a>
                              )}
                            </Menu.Item>
                            <Menu.Item>
                              {({ active }) => (
                                <a className={classNames(
                                  active
                                    ? "bg-yellow text-darkgray "
                                    : "text-darkgray ml-2 ",
                                  "block px-2 py-2 text-sm text-center font-raleway font-normal cursor-pointer"
                                )}
                                  onClick={async () => { futureFeatureMsg(t("Navbar.loans")); }}
                                >
                                  <div className="flex justify-start">
                                    <span className=" m-2"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                                    </span>
                                    <p className=" self-center">{t("Navbar.loans")}</p>
                                  </div>
                                </a>
                              )}
                            </Menu.Item>
                            <Menu.Item>
                              {({ active }) => (
                                <a className={classNames(
                                  active
                                    ? "bg-yellow text-darkgray "
                                    : "text-darkgray ml-2 ",
                                  "block px-2 py-2 text-sm text-center font-raleway font-normal cursor-pointer"
                                )}
                                  onClick={async () => { futureFeatureMsg(t("Navbar.staking")); }}
                                >
                                  <div className="flex justify-start">
                                    <span className=" m-2"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                                    </span>
                                    <p className=" self-center">{t("Navbar.staking")}</p>
                                  </div>
                                </a>
                              )}
                            </Menu.Item>
                            <Menu.Item>
                              {({ active }) => (
                                <a href="/community" className={classNames(
                                  active
                                    ? "bg-yellow text-darkgray "
                                    : "text-darkgray ml-2 ",
                                  "block px-2 py-2 text-sm text-center font-raleway font-normal  cursor-pointer"
                                )}
                                >
                                  <div className="flex justify-start">
                                    <span className=" m-2"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                                    </span>
                                    <p className=" self-center">{t("Navbar.community")}</p>
                                  </div>
                                </a>
                              )}
                            </Menu.Item>
                            <Menu.Item
                              onClick={handleSignIn}
                            >
                              {({ active }) => (
                                <a className={classNames(
                                  active
                                    ? "bg-yellow text-darkgray "
                                    : "text-darkgray ml-2 ",
                                  "block px-2 py-2 text-sm text-center font-raleway font-normal  cursor-pointer"
                                )}>
                                  <div className="flex justify-start">
                                    <span className=" m-2">
                                      <svg xmlns="http://www.w3.org/2000/svg" id="Isolation_Mode" data-name="Isolation Mode" viewBox="0 0 24 24" width="15" height="15"><path d="M3,3H8V0H3A3,3,0,0,0,0,3V21a3,3,0,0,0,3,3H8V21H3Z" /><path d="M22.948,9.525,18.362,4.939,16.241,7.061l3.413,3.412L5,10.5,5,13.5l14.7-.027-3.466,3.466,2.121,2.122,4.587-4.586A3.506,3.506,0,0,0,22.948,9.525Z" /></svg>
                                    </span>
                                    <p className=" self-center"> {t("Navbar.login")}</p>
                                  </div>

                                </a>
                              )}
                            </Menu.Item>
                          </div>
                        </Menu.Items>
                      </Transition>
                    </>
                  )}
                </Menu>

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
