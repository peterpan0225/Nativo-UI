/* global BigInt */
import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";
import Switch from "react-switch";

//importamos metodos para interactuar con el smart contract, la red de aurora y el account

import {
  getNearContract,
  fromNearToYocto,
  ext_call,
  getNearAccount,
} from "../utils/near_interaction";
import { useTranslation } from "react-i18next";
import { ApolloClient, InMemoryCache, gql } from "@apollo/client";
import { useWalletSelector } from "../utils/walletSelector";
//impimport nearicon from "../assets/img/Vectornear.png";
import nearicon from "../assets/img/Vectornear.png";

export default function Set_token_detailModal(props) {
  //const history = useHistory();
  const { selector, modalWallet, accounts, accountId } = useWalletSelector();
  const [state, setState] = useState({ disabled: false });
  const [t, i18n] = useTranslation("global");
  const [highestbidder, setHighestbidder] = useState(0);
  const APIURL = process.env.REACT_APP_API_TG;
  const [noCollections, setNoCollections] = useState(false);
  const [collectionData, setCollectionData] = useState([]);
  const [new_token_price_m, setNew_token_price_m] = useState(0.0);
  const [terms_m, setTerms_m] = useState(false);
  const [colID_m, setColID_m] = useState(-1);
  const [colName_m, setColName_m] = useState("");

  const [LToken_m, setLToken_m] = React.useState();

  const [hide_create_col_m, setHide_create_col_m] = useState(false);
  const [hide_set_price_m, setHide_set_price_m] = useState(false);
  const [hide_set_col_m, setHide_set_col_m] = useState(false);
  const [hide_set_save_m, setHide_set_save_m] = useState(false);
  const [hide_set_modal_m, setHide_set_modal_m] = useState(false);
  const [near_price_m, setNear_price_m] = useState(0.0);

  const set_new_price = (e) => {
    setNew_token_price_m(e.target.value);
  };

  const AcceptTerms = () => {
    setTerms_m(!terms_m);
  };

  const SetPrice_modal = async (e) => {
    //heres start the batch transaction

    const transactions = [];
    //validate form
    let contract = await getNearContract();
    let amount = fromNearToYocto(0.01);
    // if(!hide_set_price_m && !hide_create_col_m){
    //   console.log("🪲 ~ file: Set_token_detailsModal.component.js ~ line 61 ~ constSetPrice_modal= ~ hide_set_col_m", hide_set_col_m)
    //   console.log("🪲 ~ file: Set_token_detailsModal.component.js ~ line 61 ~ constSetPrice_modal= ~ hide_set_price_m", hide_set_price_m)

    //   Swal.fire({
    //     position: "top-center",
    //     icon: "warning",
    //     title: t("MintNFT.alertoptions"),
    //     showConfirmButton: false,
    //     timer: 2000,
    //   });
    //   return;
    // }
    let price = fromNearToYocto(new_token_price_m);

    if (new_token_price_m <= 0) {
      Swal.fire({
        position: "top-center",
        icon: "warning",
        title: t("MintNFT.alertPrice"),
        showConfirmButton: false,
        timer: 2000,
      });
      return;
    }
    if (colID_m < 0) {
      Swal.fire({
        position: "top-center",
        icon: "warning",
        title: t("MintNFT.alertCol"),
        showConfirmButton: false,
        timer: 2000,
      });
      return;
    }
    if (new_token_price_m > 0) {
      let msgData = JSON.stringify({
        market_type: "on_sale",
        price: price,
        title: props.token?.metadata?.title,
        media: props.token?.metadata?.media,
        creator_id: props.token?.creator_id,
        description: props.token?.metadata?.description,
      });
      let payload_price = {
        token_id: props.token?.token_id,
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
      
      });
    }

    if (colID_m >= 0) {
      

      let Col_payload = {
        contract_id: process.env.REACT_APP_CONTRACT,
        owner_id: props.token?.owner_id,
        token_id: props.token?.token_id,
        title: props.token?.metadata?.title,
        description: props.token?.metadata?.description,
        media: props.token?.metadata?.media,
        creator: props.token?.creator_id,
        price: 10,
        collection_id: parseInt(colID_m)
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
    window.localStorage.setItem("last_token", LToken_m?.token_id);
    window.localStorage.setItem("price_setted", true);

    
    const wallet = await selector.wallet();
 
    return wallet.signAndSendTransactions({ transactions }).catch((err) => {
      alert("Failed to add messages exception " + err);
      console.log("Failed to add messages");

      throw err;
    });
  };

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
  useEffect(() => {
    (async () => {
      setHide_set_modal_m(false);
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

      // if (props.show) {
      console.log(
        "🪲 ~ file: Set_token_detailsModal.component.js ~ line 234 ~ props",
        props
      );
      //   console.log(props)
      //   let userData
      //   let account = accountId
      //   const query = `
      //     query($account: String){
      //       collections (where : {owner_id : $account}){
      //         id
      //         title
      //       }
      //     }
      //   `
      //   const client = new ApolloClient({
      //     uri: APIURL,
      //     cache: new InMemoryCache(),
      //   })

      //   await client.query({
      //     query: gql(query),
      //     variables: {
      //       account: account
      //     }
      //   })
      //     .then((data) => {
      //       console.log('collections: ', data.data.collections)
      //       if (data.data.collections.length <= 0) {
      //         setNoCollections(false)
      //       }
      //       else {
      //         userData = data.data.collections
      //         setCollectionData(userData)
      //         setNoCollections(true)
      //       }
      //     })
      //     .catch((err) => {
      //       console.log('error: ', err)
      //     })
      // }
    })();
  }, []);

  // async function handleAddToken() {
  //   console.log("Hola este es el handle")
  //   console.log(colID)
  //   if (colID <= -1) {
  //     Swal.fire({
  //       title: t('addToken.alert1-title'),
  //       text: t('addToken.alert1-msg'),
  //       icon: 'error',
  //       confirmButtonColor: '#E79211'
  //     })
  //     return
  //   }
  //   Swal.fire({
  //     title: t('addToken.alert2-title'),
  //     text: t('addToken.alert2-msg'),
  //     icon: 'warning',
  //     showCancelButton: true,
  //     confirmButtonColor: '#E79211',
  //     cancelButtonColor: '#d33',
  //     confirmButtonText: "Agregar NFT"
  //   }).then(async (result) => {
  //     if (result.isConfirmed) {
  //       console.log("Agregando NFT a una coleccion")
  //       let payload = {
  //         contract_id: process.env.REACT_APP_CONTRACT,
  //         owner_id: props.tokens.owner,
  //         token_id: props.tokens.tokenID,
  //         title: props.jdata.title,
  //         description: props.jdata.description,
  //         media: props.jdata.image,
  //         creator: props.jdata.creator,
  //         price: 10,
  //         collection_id: parseInt(colID)
  //       }
  //       console.log(payload)
  //       // ext_call(process.env.REACT_APP_CONTRACT_MARKET, 'add_token_to_collection', payload, 300000000000000, 1)
  //       const wallet = await selector.wallet();
  //       wallet.signAndSendTransaction({
  //         signerId: accountId,
  //         receiverId: process.env.REACT_APP_CONTRACT_MARKET,
  //         actions: [
  //           {
  //             type: "FunctionCall",
  //             params: {
  //               methodName: "add_token_to_collection",
  //               args: payload,
  //               gas: 300000000000000,
  //               deposit: 1,
  //             }
  //           }
  //         ]
  //       })
  //     }
  //   })
  // }
  // //Configuramos el formulario para ofertar por un token
  // const formik = useFormik({
  //   initialValues: {
  //     terms: false,
  //     price: 0
  //   },
  //   validationSchema: Yup.object({
  //     price: Yup.number()
  //       .required("Requerido")
  //       .positive("El precio debe ser positivo")
  //       .moreThan(0.09999999999999, "El precio minimo para el NFT es de 0.1")
  //       .min(0.1, "El precio no debe de ser menor 0.1"),
  //     terms: Yup.bool()
  //       .required("Requerido")
  //   }),
  //   //Metodo para el boton ofertar del formulario
  //   onSubmit: async (values) => {
  //     let ofertar;
  //     let contract = await getNearContract();
  //     let payload = {
  //       nft_contract_id: process.env.REACT_APP_CONTRACT,
  //       token_id: props.tokens.tokenID,
  //       owner_id: props.tokens.owner
  //     };
  //     console.log(props.tokens)

  //     let amountVal = values.price;
  //     let amount = fromNearToYocto(amountVal);
  //     let bigAmount = BigInt(amount);
  //     if (!values.terms) {
  //       Swal.fire({
  //         title: t("Modal.transAlert2"),
  //         text: t("Modal.offerAlert1Txt"),
  //         icon: 'error',
  //         confirmButtonColor: '#E79211'
  //       })
  //       return
  //     }
  //     if (props.tokens.bidPrice != "" && values.price <= props.tokens.bidPrice) {
  //       Swal.fire({
  //         title: t("Modal.offerAlert2"),
  //         text: t("Modal.offerAlert2Txt-1"),
  //         icon: 'error',
  //         confirmButtonColor: '#E79211'
  //       })
  //       return
  //     }
  //     ext_call(process.env.REACT_APP_CONTRACT_MARKET, 'add_offer', payload, 300000000000000, amount)

  //     setState({ disabled: false });
  //   },
  // });

  return (
    props.show && (
      <>
        <div className="  ">
          {/*content*/}
 
          <div className=" justify-center items-center flex flex-col overflow-x-hidden overflow-y-auto fixed inset-0 z-[60] outline-none focus:outline-none ">
            <div className="w-4/6  items-center  bg-white shadow-lg  px-4 py-2 pb-6 flex flex-col  outline-none focus:outline-none rounded-xlarge">
              {/*header*/}
              
              <div name="exit" className="w-full">
              <div className=" container  w-full  text-end    	relative  pr-2">
                  <button
                    className="rounded-full   text-md xl:text-xl 2xl:text-xl   "
                    type="button"
                  
                  onClick={() => {
                    
                    props.change({ show: false })
                  }}
                  >
                    X
                  </button>
                </div>
              </div>
              <div name="content" className="flex w-full  items-center ">


              <div name="nft"
                className="rounded-lg w-1/2  2xl:w-2/5 m-auto  flex flex-col drop-shadow-2xl    "
              >
                <div className="w-full  h-[200px] lg:h-[300px] xl:h-[380px]  2xl:h-[400px] overflow-hidden rounded-t-xl  bg-[#EBEBEB]">
                  <img
                    className="w-full h-full object-cover object-center "
                    alt="hero"
                    src={`https://nativonft.mypinata.cloud/ipfs/${props.token?.metadata?.media}`}
                  />
                </div>
                <div
                  name="nft_det"
                  className="w-full h-1/5    rounded-b-xl   pt-1 px-1  bg-white   shadow-lg"
                >
                  <p className=" ml-2 my-2 text-black uppercase text-md xl:text-2xl 2xl:text-3xl  text-ellipsis      font-bold font-open-sans">
                    {props.token?.metadata?.title}
                  </p>

                  {props.existcollections && (
                    <p className=" ml-2 text-black text-xs  xl:text-xl  2xl:text-xl font-open-sans tracking-wide	 ">
                      {colID_m === -1
                        ? t("addToken.comboOpc")
                        : collectionData.find(({ id }) => id === colID_m)
                            ?.title}
                    </p>
                  )}

                  <div className="ml-2 my-2 flex">
                    <img
                      className=" mt-1 w-5 h-5  2xl:w-6 2xl:h-6  "
                      alt="near"
                      src={props.nearicon}
                    />
                    {new_token_price_m > 0 ? (
                      <p className="text-[#F79336] normal-case ml-2 my-auto font-bold font-open-sans   text-[13px] lg:text-md xl:text-lg 2xl:text-xl ">
                        {" "}
                        {new_token_price_m} NEAR
                      </p>
                    ) : (
                      <p className="text-[#F79336] normal-case ml-2 my-auto font-bold font-open-sans   text-[13px] lg:text-md xl:text-lg  2xl:text-xl ">
                        {" "}
                        {t("MintNFT.PendingPrice")}
                      </p>
                    )}
                  </div>

                  <div className="flex  mx-2">
                      <p className="text-black content-en leading-5 mb-2 font-open-sans tracking-[0.45px] lg:tracking-[3.45px]   md:text-[9px] lg:text-sm xl:text-md  ">
                                              {t("tokCollection.createdBy")} : 
                                                
                                            </p>
                                            <p className="text-black leading-5 content-en  mb-2 font-open-sans font-bold md:text-[9px] lg:text-sm xl:text-md ">
                                              
                                              {  window.localStorage.getItem("logged_account")}
                                            </p>
                      </div>
                </div>
              </div>

              <div name="detail" className="w-1/2  mx-2 flex flex-col">


                

                <div className="w-full flex flex-col gap-2">
                  <>
                    <div className="w-full flex justify-between">
                      <label
                        htmlFor="price"
                        className=" text-sm  xl:text-lg  2xl:text-xl dark:text-darkgray    font-semibold font-raleway"
                      >
                        {t("Modal.price")}
                      </label>
                      {/* <Switch  
                          onChange={(e) => {
                            setNew_token_price_m(0);
                            setHide_set_price_m(!hide_set_price_m);
                          }}
                          checked={hide_set_price_m}
                        /> */}
                    </div>

                    {true && (
                      <div className="w-full flex gap-2">
                        <div className="w-[40px] h-[40px]  bg-center  border-2 rounded-full    justify-center items-center">
                          <img
                            className=" mt-2 m-auto  w-5 h-5 2xl:w-6 2xl:h-6  "
                            alt="near"
                            src={props.nearicon}
                          />
                        </div>

                        <div className="w-full relative rounded-md   flex  text-center border-2 ">
                          <input
                            type="number"
                            min="0.1"
                            max="100000000000000"
                            step="0.1"
                            className="w-4/6 text-xs  xl:text-lg  2xl:text-lg  2xl:h-10 pl-2 h-full"
                            placeholder={new_token_price_m}
                            onChange={(e) => {
                              set_new_price(e);
                            }}
                          />

                          <label className="w-2/6 py-2 text-xs items-center xl:text-lg 2xl:text-xl ">
                            {}≈{" "}
                            {(new_token_price_m * props.nearprice)
                              .toString()
                              .substring(0, 6)}
                            {}
                            USD
                          </label>
                        </div>
                      </div>
                    )}
                  </>
                  <hr className="border-t-2 border-yellow2 py-2	"></hr>
                  <div className="w-full flex justify-between">
                    <label
                      htmlFor="collections"
                      className=" text-sm  xl:text-xl  2xl:text-xl dark:text-darkgray    font-semibold font-raleway"
                    >
                      {t("addToken.addtocol")}
                    </label>
                    {/* <Switch
                        onChange={(e) => {
                          setColID_m(-1);
                          setHide_create_col_m(!hide_create_col_m);
                        }}
                        checked={hide_create_col_m}
                      /> */}
                  </div>

                  {true && (
                    <>
                      <div name="collections ">
                        <div className="flex justify-between "></div>

                        {noCollections ? (
                          <>
                            <div
                              name="collectinos"
                              className="  justify-center"
                            >
                              <p className="   text-center text-lg 2xl:text-xl leading-relaxed text-darkgray font-raleway">
                                {/* {props.message} */}
                              </p>
                            </div>
                            <select
                              className="text-darkgray 2xl:h-10 2xl:text-lg p-2 font-raleway"
                              onChange={(e) => {
                                setColID_m(e.target.value);
                                setColName_m(e.target.value);
                              }}
                            >
                              <option key={0} value={-1}>
                                {t("addToken.comboOpc")}
                              </option>
                              {collectionData.length > 0
                                ? collectionData.map((data) => (
                                    <option
                                      className=""
                                      key={data.id}
                                      value={data.id}
                                    >
                                      {data.title} - ID:{data.id}
                                    </option>
                                  ))
                                : null}
                            </select>

                          
                          </>
                        ) : (
                          <>
                            <div className="flex flex-col  justify-center">
                              <p className="text-darkgray text-sm 2xl:text-xl text-left underline decoration-solid	  mb-4">
                                {t("addToken.msgNoCol")}
                              </p>
                              <a
                                className="relative bg-lime-600 text-white text-center font-bold  text-sm  xl:text-lg  2xl:text-lg px-6 py-3 rounded-md   ease-linear transition-all duration-150  hover:scale-105"
                                href="/collection/create"
                              >
                                {t("addToken.btnCol")}
                              </a>
                            </div>
                          </>
                        )}
                      </div>
                    </>
                  )}

                  {/*  btn save*/}

                  {true && (
                    <>
                      <div className="xl:mt-6">
                        <input
                          type="checkbox"
                          className="2xl:h-5 2xl:w-5 "
                          name="terms"
                          id="terms"
                          value={terms_m}
                          onChange={AcceptTerms}
                        />{" "}
                        <label className="my-auto text-xs lg:text-md xl:text-lg 2xl:text-lg  text-darkgray">
                          <a
                            className="hover:underline hover:text-blue"
                            href="https://docs.nativo.art/internal-wiki/terminos-legales/terminos-y-condiciones"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {t("Modal.accept")}
                          </a>
                        </label>
                      </div>

                      <button
                        disabled={!terms_m}
                        title={t("MintNFT.AccetTerms")}
                        className={
                          !terms_m
                            ? "w-full  relative rounded-md px-4 py-2 bg-[#A4A2A4]  text-white    text-center hover:scale-105 tracking-tighter  font-open-sans text-xs lg:text-lg xl:text-2xl 2xl:text-2xl  font-bold "
                            : "w-full   relative rounded-md px-4 py-2 bg-white hover:bg-green-600  text-green-600  hover:text-white border-2 border-green-600 text-center hover:scale-105 tracking-tighter  font-open-sans text-xs lg:text-lg xl:text-2xl  2xl:text-2xl font-bold "
                        }
                        onClick={(e) => {
                          SetPrice_modal();
                        }}
                      >
                        {t("MintNFT.Continuecongrats")}
                      </button>
                    </>
                  )}
                  {/* <button
                      type="submit"
                      onClick={SkipPrice}
                      className={`w-full relative rounded-md px-4 py-2 text-white bg-[#A4A2A4] text-center hover:scale-105  tracking-tighter  font-open-sans text-xs  lg:text-lg xl:text-xl  2xl:text-5xl font-bold `}
                    >
                      {t("MintNFT.Skip")}
                    </button> */}
                </div>
              </div>

              </div>
             
            </div>
          </div>
        </div>
        <div className="opacity-25 fixed inset-0 z-30 bg-black"></div>
      </>
    )
  );
}
