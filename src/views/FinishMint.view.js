import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { providers, utils } from "near-api-js";

import back_arrow from "../assets/img/Back_arrow.png";
import upfile from "../assets/img/upfile.png";
import nearicon from "../assets/img/Vectornear.png";
import { ApolloClient, InMemoryCache, gql } from "@apollo/client";
import Set_token_detailModal from "../components/Set_token_detailsModal.component";

import {
  estimateGas,
  fromNearToEth,
  fromNearToYocto,
  fromYoctoToNear,
  getNearAccount,
  getNearContract,
  storage_byte_cost,
} from "../utils/near_interaction";
import { uploadFileAPI } from "../utils/pinata";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";
//import trashIcon from "../assets/img/bin.png";
import { useWalletSelector } from "../utils/walletSelector";
import { Button } from "@mui/material";

import { useHistory } from "react-router";

function LightHeroE(props) {
  const { selector, modal, accounts, accountId } = useWalletSelector();
  //este estado contiene toda la info de el componente
  const [mint, setmint] = React.useState({
    file: undefined,
    blockchain: localStorage.getItem("blockchain"),
    name: undefined,
  });

  const [LToken, setLToken] = React.useState();
  const [type_info, setType_info] = useState({
    title: "",
    description: "",
    collection: 0,
    royalties: {},
  });

  const [colID, setColID] = useState(-1);
  const [colName, setColName] = useState("");
  const [addTokenModal, setAddTokenModal] = useState({
    show: false,
  });
  const [t, i18n] = useTranslation("global");
  const [loading, setLoading] = useState(true);

  const [noCollections, setNoCollections] = useState(false);
  const [collectionData, setCollectionData] = useState([]);

  
  const [state, setstate] = useState();
  const [near_price, setNear_price] = useState(0.0);
  const [new_token_price, setNew_token_price] = useState(0.0);
  const [terms, setTerms] = useState(false);

  const [hide_create_col, setHide_create_col] = useState(false);
  const [hide_set_price, setHide_set_price] = useState(false);
  const [hide_set_col, setHide_set_col] = useState(false);
  const [hide_set_save, setHide_set_save] = useState(false);
  const [hide_set_modal, setHide_set_modal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);

  
  const [actualDate, setactualDate] = useState("");

  const [formFields, setFormFields] = useState([]);

  const [img, setImg] = useState();

  const APIURL = process.env.REACT_APP_API_TG;
  //guardara todos los valores del formulario

  const format = (v) => {
    return v < 10 ? "0" + v : v;
  };

  const setHide_create_nft = (e) => {
    setHide_create_col(false);
  };
  const setHide_create_coll = (e) => {
    setHide_create_col(true);
  };

  const fetchImage = async (imageUrl) => {
    const res = await fetch(imageUrl);
    console.log(
      "🪲 ~ file: FinishMint.view.js ~ line 98 ~ fetchImage ~ res",
      res
    );
    const imageBlob = await res.blob();
    const imageObjectURL = URL.createObjectURL(imageBlob);
    const img = new Image();
    img.src = imageUrl;

    img.onload = () => {
      console.log("x", img.width, "y", img.height);
      setImg(img);
    };
  };
  const history = useHistory();

  useEffect(() => {
    (async () => {
      const { network } = selector.options;
      const provider = new providers.JsonRpcProvider({ url: network.nodeUrl });
      //getting total nfts

      Swal.fire({
          
          

        background: '#0a0a0a',
        width: '800',
        heightAuto: false,
        html:'<div className="text-center h-30 w-30">'
+   '<div class="font-open-sans  text-base font-extrabold text-white mb-4 text-left uppercase">' +  t("CreateCol.loading")  + '</div>' 
+       ' <svg role="status" class="inline mr-3 w-10 h-10 text-white  animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">'
+       ' <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB"/>'
+       ' <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"/>'
+       ' </svg>'
+' </div>',
        showCancelButton: false,
        showConfirmButton:false,
        position: window.innerWidth < 1024 ? 'bottom' : 'center'
      })
      let payload = {
        account_id: window.localStorage.getItem("logged_account"),
      };
      const args_toks2 = btoa(JSON.stringify(payload));
      const totalTokens = await provider.query({
        request_type: "call_function",
        account_id: process.env.REACT_APP_CONTRACT,
        method_name: "nft_supply_for_owner",
        args_base64: args_toks2,
        finality: "optimistic",
      });

      let totalTokensParsed = JSON.parse(
        Buffer.from(totalTokens.result).toString()
      );
      let tokenpos = totalTokensParsed - 1;
      console.log(
        "🪲 ~ file: FinishMint.view.js ~ line 120 ~ tokenpos",
        tokenpos
      );

      let payload_last_token = {
        account_id: window.localStorage.getItem("logged_account"),
        from_index: "" + tokenpos,
        limit: 1,
      };
      const Last_Token = await provider.query({
        request_type: "call_function",
        account_id: process.env.REACT_APP_CONTRACT,
        method_name: "nft_tokens_for_owner",
        args_base64: btoa(JSON.stringify(payload_last_token)),
        finality: "optimistic",
      });
      let LastTokenParsed = JSON.parse(
        Buffer.from(Last_Token.result).toString()
      );
      setLToken(LastTokenParsed[0]);
      console.log(
        "🪲 ~ file: FinishMint.view.js ~ line 120 ~ totalTokensParsed",
        LastTokenParsed[0]
      );

      fetchImage(
        `https://nativonft.mypinata.cloud/ipfs/${LastTokenParsed[0]?.metadata?.media}`
      );

      let result = await fetch(
        "https://api.coingecko.com/api/v3/simple/price?ids=near&vs_currencies=usd"
      );

      fetch(
        "https://api.coingecko.com/api/v3/simple/price?ids=near&vs_currencies=usd"
      )
        .then(function (response) {
          // The response is a Response instance.
          // You parse the data into a useable format using `.json()`
          return response.json();
        })
        .then(function (data) {
          console.log(
            "🪲 ~ file: FinishMint.view.js ~ line 163 ~ .then ~ data",
            data
          );

          setNear_price(data?.near?.usd);
          // `data` is the parsed version of the JSON returned from the above endpoint.
          // { "userId": 1, "id": 1, "title": "...", "body": "..." }
        });

      let urlParams = new URLSearchParams(window.location.search);
      console.log(
        "🪲 ~ file: mintNft.view.js ~ line 375 ~ urlParams",
        urlParams
      );
      let execTrans = urlParams.has("transactionHashes");
      console.log(
        "🪲 ~ file: mintNft.view.js ~ line 377 ~ execTrans",
        execTrans
      );
      if (execTrans) {
        window.location.href = "/mynfts";
      }

      let userData;

      let account = accountId;
      const query = `
          query($account: String){
            collections (where : {owner_id : $account}){
              id
              title
            }
          }
        `;
      const client = new ApolloClient({
        uri: APIURL,
        cache: new InMemoryCache(),
      });

      await client
        .query({
          query: gql(query),
          variables: {
            account: account,
          },
        })
        .then((data) => {
          console.log(
            "🪲 ~ file: Mint.view.js ~ line 525 ~ .then ~ data",
            data
          );
          console.log("collections: ", data.data.collections);
          if (data.data.collections.length <= 0) {
            setNoCollections(false);
          } else {
            userData = data.data.collections;
            setCollectionData(userData);
            setNoCollections(true);
          }
        })
        .catch((err) => {
          console.log("error: ", err);
        });
        Swal.close()
      setLoading(false);

      setstate({
        ...state,
        tokens: {
          tokenID: LastTokenParsed[0]?.token_id,
         
          account: accountId,
          owner:accountId,
          //chunk: parseInt(toks.token_id/2400),
        },
        jdata: {
          image: LastTokenParsed[0]?.metadata?.media,
          title: LastTokenParsed[0]?.metadata.title,
          description: LastTokenParsed[0]?.metadata.description,
          royalty: Object.entries(LastTokenParsed[0]?.royalty),
          creator: LastTokenParsed[0]?.creator_id
        },
        owner: accountId,
        ownerAccount: accountId,
        userCollections:{userData}
      });

      Swal.close()



      
      return;
    })();
  }, [props]);

  const set_new_price = (e) => {
    setNew_token_price(e.target.value);
  };

  const SetPrice = async (e) => {
    //heres start the batch transaction
    const transactions = [];
    //validate form
    let contract = await getNearContract();
    let amount = fromNearToYocto(0.01);
    
    if( new_token_price <= 0) {
      Swal.fire({
        position: "top-center",
        icon: "warning",
        title: t("MintNFT.alertPrice"),
        showConfirmButton: false,
        timer: 2000,
      });
      return;
     
    }
    if( colID< 0) {
      Swal.fire({
      position: "top-center",
      icon: "warning",
      title: t("MintNFT.alertCol"),
      showConfirmButton: false,
      timer: 2000,
    });
    return;
     
    }
    if (  new_token_price > 0) {
  
      let price = fromNearToYocto(new_token_price);
      let msgData = JSON.stringify({
        market_type: "on_sale",
        price: price,
        title: LToken?.metadata?.title,
        media: LToken?.metadata?.media,
        creator_id: LToken?.creator_id,
        description: LToken?.metadata?.description,
      });
      let payload_price = {
        token_id: LToken?.token_id,
        account_id: process.env.REACT_APP_CONTRACT_MARKET,
        msg: msgData,
      };
      transactions.push({
        signerId: accountId,
        receiverId: process.env.REACT_APP_CONTRACT,
        actions: [
          {
            type: "FunctionCall",
            params: {
              methodName: "nft_approve",
              args: payload_price,
              gas: 300000000000000,
              deposit: amount,
            },
          },
        ],
        walletCallbackUrl: "/mynfts".toString(),
      });
    } 
    if ( colID>= 0) {
      
      

      let Col_payload = {
        contract_id: process.env.REACT_APP_CONTRACT,
        owner_id: LToken?.owner_id,
        token_id: LToken?.token_id,
        title: LToken?.metadata?.title,
        description: LToken?.metadata?.description,
        media: LToken?.metadata?.media,
        creator: LToken?.creator_id,
        price: 10,
        collection_id: parseInt(colID)
      }

      transactions.push({
        signerId: accountId,
        receiverId: process.env.REACT_APP_CONTRACT_MARKET,
        actions: [
          {
            type: "FunctionCall",
            params: {
              methodName: "add_token_to_collection",
              args: Col_payload,
              gas: 300000000000000,
              deposit: 1,
            },
          },
        ],
      });
    } 
   
    console.log(
      "🪲 ~ file: FinishMint.view.js ~ line 323 ~ SetPrice ~ transactions",
      transactions
    );
   

    //we're simulating that the transaction is donde
    window.localStorage.setItem("last_token", LToken?.token_id);
    window.localStorage.setItem("price_setted", true);

    const wallet = await selector.wallet();

    return wallet.signAndSendTransactions({ transactions }).catch((err) => {
      alert("Failed to add messages exception " + err);
      console.log("Failed to add messages");

      throw err;
    });
  };

  const AcceptTerms = () => {
    setTerms(!terms);
  };

  const getsize =()=>{
    if ( window.innerWidth >= 640 && window.innerWidth < 768){
      return  "sm: "+window.innerWidth +" px"
    }
    if ( window.innerWidth >= 768 && window.innerWidth < 1024){
      return  "md: "+window.innerWidth +" px"
    }
    if ( window.innerWidth >= 1024 && window.innerWidth < 1280){
      return  "lg: "+window.innerWidth +" px"
    }
    if ( window.innerWidth >= 1280 && window.innerWidth < 1536){
      return  "xl: "+window.innerWidth +" px"
    }
    if ( window.innerWidth >= 1536 && window.innerWidth < 2072 ){
      return  "2xl: "+window.innerWidth +" px"
    }
    if ( window.innerWidth >= 2072 && window.innerWidth < 2560 ){
      return  "3xl: "+window.innerWidth +" px"
    }
    if ( window.innerWidth >= 2560 ){
      return  "4xl: "+window.innerWidth +" px"
    }
  }
  const show_modal = () =>{
    // temporal
    setShowDetailModal(true);
    setAddTokenModal(
       {
       ...state,
       show: true,
       token: LToken,
       existcollections:noCollections,
       collections:collectionData,
       nearprice:near_price,
       nearicon:nearicon,
       change: setAddTokenModal,

    //   message: t('Detail.msgAddToken2'),
    //   loading: false,
    //   disabled: false,
    //   change: setAddTokenModal,
    //   buttonName: 'X',
    //   tokenId: 'hardcoded'
     }
    )

  }
  const SkipPrice = () => {
    Swal.fire({
      title: t("Modal.skip_tittle"),
      text: t("Modal.skip_description"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      cancelButtonText: "No",
      confirmButtonText: t("Modal.skip_accept"),
    }).then((result) => {
      if (result.isConfirmed) {
        window.location.href = "/mynfts";
      }
    });
  };
  return (
    <section className="text-gray-600 body-font   bg-[#F1EDF2]   h-full md:h-screen  ">
      {false ? (
        <>
          <div className="grid grid-cols-1 gap-4 place-content-center items-center">
            <h1 className="text-5xl font-semibold pt-60 text-center ">
              {t("MintNFT.load")}
            </h1>
            <h1 className="text-5xl font-semibold pt-10 text-center ">
              {t("MintNFT.loadMsg")}
            </h1>
          </div>
        </>
      ) : (
        <>
          {/* {collection ? */}
          <>
            <div className="w-full h-full    md:flex  md:flex-row   ">
              {/* Here goes the info nft  */}
              <div
                name="create"
                className="w-full  bg-white md:w-2/5 lg:w-5/12 lg:items-center "
              >
                
                <div className="w-full h-full pb-6 flex flex-col px-10     ">
                  <div className="tab  pt-16 flex flex-row drop-shadow-md ">
                     
                      <h3 className=" text-black  rounded-md  hover:text-white hover:scale-110 tracking-tighter text-4xl      font-open-sans font-bold ">
                        {" "}
                        {t("MintNFT.congrats")}
                      
                      </h3>
                    
                  </div>

                 
{/* 1 */}

{ window.innerWidth >=640  &&
                <div name="nft" hidden={hide_create_col}>
                {!hide_set_price ? (
                  <p className="my-4  text-base lg:text-lg  xl:text-xl    text-[#0A0A0A] font-open-sans font-bold  ">
                    {t("MintNFT.congratsYourNft")}
                  </p>
                ) : (
                  <p className="my-4  text-base lg:text-lg xl:text-xl   text-[#0A0A0A] font-open-sans font-bold  ">
                    {t("Modal.price")}
                  </p>
                )}
                    <div className="w-full flex flex-col gap-2">
                      {!hide_set_price ? (
                        <button
                          className={`w-full relative px-4 py-2 my-4 bg-yellow2  rounded-md  text-white   text-center hover:scale-105 tracking-tighter  font-open-sans text-xs lg:text-lg  xl:text-xl   font-bold `}
                          onClick={(e) => {
                            show_modal();
                            setHide_set_modal(!hide_set_modal)
                          }}
                        >
                          {t("Modal.putSale")}
                        </button>
                      ) : (
                        <>
                          <div className="w-full flex gap-2">
                            <div className="w-[40px] h-[40px] 2xl:w-[55px] 2xl:h-[55px] bg-center  border-2 rounded-full    justify-center items-center">
                              <img
                                className=" mt-2 m-auto  w-5 h-5 2xl:w-10 2xl:h-10  "
                                alt="near"
                                src={nearicon}
                              />
                            </div>

                            <div className="w-full relative rounded-md   flex  text-center border-2 ">
                              <input
                                type="number"
                                min="0.1"
                                max="100000000000000"
                                step="0.1"
                                className="w-4/6 lg:text-lg xl:text-xl  md:w-1/2 lg:w-4/6  pl-2 h-full"
                                placeholder={new_token_price}
                                onChange={(e) => {
                                  set_new_price(e);
                                }}
                              />

                              <label className="w-2/6 md:w-1/2  lg:w-2/6 py-2 text-sm lg:text-lg xl:text-xl  ">
                                ≈{" "}
                                {(new_token_price * near_price)
                                  .toString()
                                  .substring(0, 6)}{" "}
                                USD
                              </label>
                            </div>
                          </div>
                        </>
                      )}

                      

                      {/*  btn save*/}

                       
                      <button
                        type="submit"
                        onClick={SkipPrice}
                        className={`w-full relative rounded-md px-4 py-2 my-4 text-white bg-[#A4A2A4] text-center hover:scale-105  tracking-tighter  font-open-sans text-xs  lg:text-lg xl:text-xl   font-bold `}
                      >
                        {t("MintNFT.Skip")}
                      </button>
                    </div>
                    </div>
}
                  

{/* 2 */}
{
                window.innerWidth <640  &&
                  <div name="nft" hidden={hide_create_col}>
                    {!hide_set_price ? (
                      <p className="my-4  text-base lg:text-lg  xl:text-xl    text-[#0A0A0A] font-open-sans font-bold  ">
                        {t("MintNFT.congratsYourNft")}
                      </p>
                    ) : (
                      <p className="my-4  text-base lg:text-lg xl:text-xl   text-[#0A0A0A] font-open-sans font-bold  ">
                        {t("Modal.price")}
                      </p>
                    )}

                    <div className="w-full flex flex-col gap-2">
                      
                        <>
                        <p className="my-4  text-base lg:text-lg xl:text-xl   text-[#0A0A0A] font-open-sans font-bold  ">
                        {t("Modal.price")}
                      </p>
                          <div className="w-full flex gap-2">
                         

                            <div className="w-[40px] h-[40px] 2xl:w-[55px] 2xl:h-[55px] bg-center  border-2 rounded-full    justify-center items-center">
                              <img
                                className=" mt-2 m-auto  w-5 h-5 2xl:w-10 2xl:h-10  "
                                alt="near"
                                src={nearicon}
                              />
                            </div>

                            <div className="w-full relative rounded-md   flex  text-center border-2 ">
                              <input
                                type="number"
                                min="0.1"
                                max="100000000000000"
                                step="0.1"
                                className="w-4/6 lg:text-lg xl:text-xl  md:w-1/2 lg:w-4/6  pl-2 h-full"
                                placeholder={new_token_price}
                                onChange={(e) => {
                                  set_new_price(e);
                                }}
                              />

                              <label className="w-2/6 md:w-1/2  lg:w-2/6 py-2 text-sm lg:text-lg xl:text-xl  ">
                                ≈{" "}
                                {(new_token_price * near_price)
                                  .toString()
                                  .substring(0, 6)}{" "}
                                USD
                              </label>
                            </div>
                          </div>
                          <hr className="border-t-2 border-yellow2 py-2	"></hr>
                        </>
                    
                        <>
                          <div name="collections " className="my-4">
                            <div className="flex justify-between ">
                              <label
                                htmlFor="collections"
                                className=" text-base  dark:text-darkgray    font-semibold font-raleway"
                              >
                                {t("addToken.addtocol")}
                              </label>
                            </div>

                            {noCollections ? (
                              <>
                                <div
                                  name="collectinos"
                                  className="  justify-center"
                                >
                                  <p className=" my-4 text-center text-2xl leading-relaxed text-darkgray font-raleway">
                                    {props.message}
                                  </p>
                                </div>
                                <select
                                  className="text-darkgray p-2 font-raleway"
                                  onChange={(e) => {
                                    console.log(
                                      "🪲 ~ file: Mint.view.js ~ line 808 ~ LightHeroE ~ e",
                                      e.target.value?.key
                                    );
                                    setColID(e.target.value);
                                    setColName(e.target.value);
                                    console.log(
                                      "🪲 ~ file: Mint.view.js ~ line 808 ~ LightHeroE ~ e",
                                      e.target.key
                                    );
                                  }}
                                >
                                  <option key={0} value={-1}>
                                    {t("addToken.comboOpc")}
                                  </option>
                                  {collectionData.length > 0
                                    ? collectionData.map((data) => (
                                        <option
                                          className="bg-indigo-500"
                                          key={data.id}
                                          value={data.id}
                                        >
                                          {data.title} - ID:{data.id}
                                        </option>
                                      ))
                                    : null}
                                </select>

                                <div className="w-full flex ">
                                  <div className="relative group mt-3 rounded-full">
                                    <div className="absolute -inset-0.5 bg-gradient-to-r from-[#f2b159] to-[#ca7e16] rounded-full blur opacity-70 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt group-hover:-inset-1"></div>
                                  </div>
                                </div>
                              </>
                            ) : (
                              <>
                                <div className="flex flex-col  justify-center">
                                  <p className="text-darkgray text-sm text-left underline decoration-solid	  mb-4">
                                    {t("addToken.msgNoCol")}
                                  </p>
                                  <a
                                    className="relative bg-lime-600 text-white text-center font-bold  text-sm px-6 py-3 rounded-md   ease-linear transition-all duration-150  hover:scale-105"
                                    href="/collection/create"
                                  >
                                    {t("addToken.btnCol")}
                                  </a>
                                </div>
                              </>
                            )}
                          </div>
                        </>
                     
                        <>
                          <div className="mt-3">
                            <input
                              type="checkbox"
                              className=""
                              name="terms"
                              id="terms"
                              value={terms}
                              onChange={AcceptTerms}
                            />{" "}
                            <label className="text-sm  text-darkgray">
                        <a className="hover:underline hover:text-blue" 
                        href="https://docs.nativo.art/internal-wiki/terminos-legales/terminos-y-condiciones" target="_blank" rel="noopener noreferrer">
                          {t("Modal.accept")}
                        </a>

                    
                      </label>
                          </div>

                          <button
                            disabled={!terms}
                            title={t("MintNFT.AccetTerms")}
                            className={
                              !terms
                                ? "w-full mt-6 relative rounded-md px-4 py-2 bg-[#A4A2A4]  text-white    text-center hover:scale-105 tracking-tighter  font-open-sans text-xs lg:text-lg xl:text-2xl   font-bold "
                                : "w-full mt-6 relative rounded-md px-4 py-2 bg-green-600   text-white  text-center hover:scale-105 tracking-tighter  font-open-sans text-xs lg:text-lg xl:text-2xl   font-bold "
                            }
                            onClick={(e) => {
                              SetPrice();
                            }}
                          >
                            {t("MintNFT.Savecongrats")}
                          </button>
                        </>
                      {/* )} */}
                      <button
                        type="submit"
                        onClick={SkipPrice}
                        className={`w-full relative rounded-md px-4 py-2 text-white bg-[#A4A2A4] text-center hover:scale-105  tracking-tighter  font-open-sans text-xs  lg:text-lg xl:text-xl   font-bold `}
                      >
                        {t("MintNFT.Skip")}
                      </button>
                    </div>
                  </div>
}
                </div>
              </div>



              <div
                  name="nft_detail"
                  className={
                    "  px-4 md:px-8  py-8  md:py-20  mx-auto  w-4/5 md:w-3/5  lg:w-3/6 xl:w-5/12  2xl:1/2 drop-shadow-2xl       md:flex-row flex-col  md:justify-center    "
                  }
                >
                    <p className=" w-full  text-base lg:text-lg xl:text-xl font-bold  text-left my-4">
                  {t("MintNFT.prevNFT")}
                </p>
                  
                  <div
                    name="card"
                    className={
                      hide_create_col
                        ? " sm:hidden "
                        : "" + "rounded-2xl flex flex-col    h-full "
                    }
                  >
                    {" "}
                    {
                      //h-7/12
                    }
                    <div className="w-full   h-[280px]   md:h-[340px] lg:h-[350px]  xl:h-[450px]  overflow-hidden rounded-t-2xl   bg-[#EBEBEB]">
                      { LToken?.metadata?.media ? <img
                          className=" w-full h-full  object-cover object-center "
                          alt="hero"
                          src={`https://nativonft.mypinata.cloud/ipfs/${LToken?.metadata?.media}`}
                        />:
                        <br></br>
                        }
                        
                     
                    </div>
                    <div
                      name="card_det"
                      className="w-full rounded-b-2xl   pt-4 px-4    bg-white h-full md:h-[170px]"
                    >
                      <p className=" text-black uppercase text-2xl truncate   md:text-3xl  font-bold font-open-sans">
                      {LToken?.metadata
                        ? LToken?.metadata?.title
                        : t("MintNFT.write_title")}
                      </p>
                      <p className=" text-black normal-case text-md truncate   md:text-lg   font-open-sans">
                      {colID === -1
                          ? t("addToken.comboOpc")
                          : collectionData.find(({ id }) => id === colID)
                              ?.title}
                      </p>

                      <div className="py-2 flex">
                        <img
                          className=" mt-1 w-5 h-5   "
                          alt="near"
                          src={nearicon}
                        />

                        {new_token_price > 0 ? (
                        <p className="text-[#F79336] ml-4  font-bold font-open-sans   text-md lg:text-xl  xl:text-xl ">
                          {" "}
                          {new_token_price} NEAR
                        </p>
                      ) : (
                        <p className="text-[#F79336] ml-4  normal-case font-bold font-open-sans   text-lg lg:text-xl  xl:text-xl  ">
                          {" "}
                          {t("MintNFT.PendingPrice")}
                        </p>
                      )}
                      </div>

                      <div className="flex ">
                      <p className="text-black content-en leading-5 mb-2 font-open-sans tracking-[3.45px] text-sm md:text-md ">
                                              {t("tokCollection.createdBy")} : 
                                                
                                            </p>
                                            <p className="text-black content-en  mb-2 font-open-sans font-bold text-sm md:text-md ">
                                              
                                              {  window.localStorage.getItem("logged_account")}
                                            </p>
                      </div>
                     
                    </div>
                  </div>
                </div>
              {/* <div
                name="nft_detail"
                className={
                  "  px-4 md:px-8  mx-auto   mt-4 md:mt-16    w-11/12 h-full    md:w-3/5  lg:w-6/12 xl:w-6/12	       drop-shadow-xl       md:flex-row flex-col  md:justify-center xl:justify-center    "
                }
              >
                <div
                  name="card"
                  className=" flex flex-col    h-full "
                >
                  {
                    //h-7/12
                    //     md:h-screen lg:h-screen  xl:h-screen
                  }
                  <div className="w-full h-[350px] md:h-[400px]  lg:h-[450px]  xl:h-[500px]  2xl:h-[900px] overflow-hidden rounded-t-lg  xl:rounded-t-xl bg-[#EBEBEB]">
                    <img
                      className="w-full h-full object-cover object-center "
                      alt="hero"
                      src={`https://nativonft.mypinata.cloud/ipfs/${LToken?.metadata?.media}`}
                    />
                  </div>
                  <div
                    name="card_det"
                    className="w-full xl:h-3/12    rounded-b-xl  xl:rounded-t-2xl  pt-4 px-4  mb-4   bg-white  "
                  >
                    <p className=" text-black  text-2xl text-ellipsis    md:text-xl  lg:text-2xl  xl:text-3xl  font-bold font-open-sans">
                      {LToken?.metadata
                        ? LToken?.metadata?.title
                        : t("MintNFT.write_title")}
                    </p>
                    {noCollections && (
                      <p className=" text-black text-xl  md:text-2xl font-open-sans tracking-wide	mt-2 ">
                        {colID === -1
                          ? t("addToken.comboOpc")
                          : collectionData.find(({ id }) => id === colID)
                              ?.title}
                      </p>
                    )}

                    <div className="py-4 flex">
                      <img
                        className=" mt-1 w-5 h-5   "
                        alt="near"
                        src={nearicon}
                      />
                      {new_token_price > 0 ? (
                        <p className="text-[#F79336] ml-4  font-bold font-open-sans   text-md lg:text-xl  xl:text-xl ">
                          {" "}
                          {new_token_price} NEAR
                        </p>
                      ) : (
                        <p className="text-[#F79336] ml-4  font-bold font-open-sans   text-lg lg:text-xl  xl:text-xl  ">
                          {" "}
                          {t("MintNFT.PendingPrice")}
                        </p>
                      )}
                    </div>

                    <p className="text-black content-en mt-2 mb-2   font-open-sans text-sm md:text-md lg:text-lg  xl:text-lg  ">
                      {t("tokCollection.createdBy") +
                        ": " +
                        window.localStorage.getItem("logged_account")}{" "}
                    </p>
                  </div>
                </div>
              </div> */}
            </div>
            {
                window.innerWidth >=640  &&
                
                  <Set_token_detailModal {...addTokenModal} />
            }
          </>
        </>
      )}
      
    </section>
  );
}

LightHeroE.defaultProps = {
  theme: "yellow",
};

LightHeroE.propTypes = {
  theme: PropTypes.string.isRequired,
};

export default LightHeroE;
