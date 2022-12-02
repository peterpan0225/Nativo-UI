import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useFormik } from "formik";
import * as Yup from "yup";
import { ApolloClient, InMemoryCache, gql } from "@apollo/client";
import { acceptedFormats, currencys } from "../utils/constraint";
// import load from "../assets/landingSlider/img/loader.gif";
// import uploadImg from "../assets/img/UPLOAD.png";
import back_arrow from "../assets/img/Back_arrow.png";
import upfile from "../assets/img/upfile.png";
import nearicon from "../assets/img/Vectornear.png";
import loading from "../assets/img/loading.gif";

import { useHistory } from "react-router";

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
function LightHeroE(props) {
  const { selector, modal, accounts, accountId } = useWalletSelector();
  //este estado contiene toda la info de el componente
  const [mint, setmint] = React.useState({
    file: undefined,
    blockchain: localStorage.getItem("blockchain"),
    name: undefined,
  });
  const [type_info, setType_info] = useState({
    title: "",
    description: "",
    collection: 0,
    royalties: {},
  });
  const history = useHistory();
  const [colID, setColID] = useState(-1);
  const [colName, setColName] = useState("");

  const [t, i18n] = useTranslation("global");
  const [loading, setLoading] = useState(false);

  const [noCollections, setNoCollections] = useState(false);
  const [collectionData, setCollectionData] = useState([]);

  const [addTokenModal, setAddTokenModal] = useState({
    show: false,
  });
  const [state, setstate] = useState();

  const [hide_create_col, setHide_create_col] = useState(false);
  const [hide_create_roy, setHide_create_roy] = useState(false);

  const [actualDate, setactualDate] = useState("");

  const [formFields, setFormFields] = useState([]);

  const handleFormChange = (event, index) => {
    let data = [...formFields];
    data[index][event.target.name] = event.target.value;
    setFormFields(data);
  };

  const addFields = () => {
    let object = {
      account: "",
      percent: "",
    };
    if (formFields.length == 6) {
      return;
    }
    setFormFields([...formFields, object]);
  };

  const removeFields = (index) => {
    let data = [...formFields];
    data.splice(index, 1);
    setFormFields(data);
  };
  const removeallFields = () => {
    setFormFields([]);
  };

  const APIURL = process.env.REACT_APP_API_TG;
  //guardara todos los valores del formulario

  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      price: 0,
      culture: "",
      country: "",
      image: "",
      date: "",
      hrs: "",
      min: "",
      titleCol: "",
      descriptionCol: "",
      contractCol: "",
    },
    //validaciones
    validationSchema: Yup.object({
      title: Yup.string()
        .max(60, t("MintNFT.maxTitle"))
        .required(t("MintNFT.required"))
        .min(5, t("MintNFT.minTitle")),

      description: Yup.string()
        .max(1000, t("MintNFT.maxDesc"))
        .required(t("MintNFT.required"))
        .min(5, t("MintNFT.minDesc")),

      // price: Yup.number()
      //   .required(t("MintNFT.required"))
      //   .positive(t("MintNFT.posPrice"))
      //   .moreThan(0.09999999999999, t("MintNFT.morePrice"))
      //   .min(0.1, t("MintNFT.minPrice")),

      image: Yup.string().required(t("MintNFT.required")),
    }),
    onSubmit: async (values) => {
      //evitar que el usuario pueda volver a hacer click hasta que termine el minado
      setmint({ ...mint, onSubmitDisabled: true });
      // alert("quieto vaquero")
      let account;
      if (mint.blockchain == "0") {
        //primero nos aseguramos de que la red de nuestro combo sea igual a la que esta en metamask
        //console.log(account);
      }

      // console.log(JSON.stringify(values))
      const fecha = values.date.split("-");
      let dateSTR = fecha[1] + "-" + fecha[2] + "-" + fecha[0];
      // console.log(dateSTR)
      const date = new Date(dateSTR);
      date.setDate(date.getDate());
      date.setHours(values.hrs);
      date.setMinutes(values.min);
      if (date < Date.now()) {
        alert(
          "La fecha y hora para la subasta debe de ser mayor a la fecha y hora actual"
        );
        window.location.reload();
        return;
      }
      let token;
      if (mint.blockchain == "0") {
        //los datos de la transacccion
        // token = await getContract()
        //   .methods.minar(
        //     account,
        //     JSON.stringify(values),
        //     fromETHtoWei(values.price)
        //   )
        //   .send({ from: account })
        //   .catch((err) => {
        //     return err;
        //   });
      } else {
        console.log("blockchain");
        let percentage = 0;
        let royalties = {};
        let success = true;
        let royalText = "";

        if (formFields.length > 0) {
          console.log("formfields");

          formFields.map(async (data, index) => {
            console.log("each formfields");

            if (data.account == "" || data.percent == "") {
              Swal.fire({
                icon: "error",
                html:
                  "<div>" +
                  '<div class="font-open-sans dark:text-darkgray text-xl font-bold">' +
                  t("MintNFT.swVoid") +
                  "</div>" +
                  '<div class="font-open-sans dark:text-darkgray  text-sm">' +
                  t("MintNFT.swVoidTxt") +
                  "</div>" +
                  "</div>",
                confirmButtonColor: "#E79211",
              });
              setmint({ ...mint, onSubmitDisabled: false });
              success = false;
              return;
            }
            if (
              !data.account.includes(
                process.env.REACT_APP_NEAR_ENV == "mainnet"
                  ? ".near"
                  : ".testnet"
              )
            ) {
              Swal.fire({
                html:
                  "<div>" +
                  '<div class="font-open-sans dark:text-darkgray text-xl font-bold">' +
                  t("MintNFT.swNet") +
                  "</div>" +
                  '<div class="font-open-sans dark:text-darkgray  text-sm">' +
                  t("MintNFT.swNetTxt") +
                  (process.env.REACT_APP_NEAR_ENV == "mainnet"
                    ? ".near"
                    : ".testnet") +
                  "</div>" +
                  "</div>",
                icon: "error",
                confirmButtonColor: "#E79211",
              });
              setmint({ ...mint, onSubmitDisabled: false });
              success = false;
              return;
            }
            let account = data.account;
            let percent = data.percent;
            percentage = percentage + parseFloat(percent);
            console.log("index", index);
            let info = JSON.parse(
              '{"' + account + '" : ' + percent * 100 + "}"
            );
            royalText = royalText + account + " : " + percent + "%<br>";
            royalties = { ...royalties, ...info };
          });

          if (percentage > 50) {
            Swal.fire({
              html:
                "<div>" +
                '<div class="font-open-sans dark:text-darkgray text-xl font-bold">' +
                t("MintNFT.swPer") +
                "</div>" +
                '<div class="font-open-sans dark:text-darkgray  text-sm">' +
                t("MintNFT.swPerTxt") +
                "</div>" +
                "</div>",
              icon: "error",
              confirmButtonColor: "#E79211",
            });
            success = false;
            setmint({ ...mint, onSubmitDisabled: false });
            return;
          }
        }

        //heres start the batch transaction
        const transactions = [];

        //processs verify the token info(done)

        //buld the payload
        //call the sing transactions
        let contract = await getNearContract();
        const data = await contract.account.connection.provider.block({
          finality: "final",
        });
        const dateActual = data.header.timestamp / 1000000;
        const owner = accountId;
        console.log(fromNearToYocto(values.price));
        let payload = {
          metadata: {
            title: values.title,
            description: values.description,
            media: values.image,
          },
          receiver_id: owner,
        };
        console.log(
          "🪲 ~ file: Mint.view.js ~ line 315 ~ onSubmit: ~ payload",
          payload
        );
        let amount = fromNearToYocto(process.env.REACT_APP_FEE_CREATE_NFT);
        // console.log(royalText);
        if (success) {
          console.log("success ");

          if (Object.keys(royalties) != 0) {
            console.log("crear nft ");

            payload = { ...payload, ...{ perpetual_royalties: royalties } };
            Swal.fire({
              html:
                "<div>" +
                '<div class="font-open-sans dark:text-darkgray text-xl font-bold">' +
                t("MintNFT.swVer") +
                "</div>" +
                '<div class="font-open-sans dark:text-darkgray  text-sm">' +
                royalText +
                "</div>" +
                "</div>",
              icon: "warning",
              showCancelButton: true,
              confirmButtonColor: "#E79211",
              cancelButtonColor: "#d33",
              confirmButtonText: "Crear NFT",
            }).then(async (result) => {
              if (result.isConfirmed) {
                console.log("confirmed ");

                console.log("Creando NFT");
                const wallet = await selector.wallet();
                transactions.push({
                  signerId: accountId,
                  receiverId: process.env.REACT_APP_CONTRACT,
                  actions: [
                    {
                      type: "FunctionCall",
                      params: {
                        methodName: "nft_mint",
                        args: payload,
                        gas: 300000000000000,
                        deposit: amount,
                      },
                    },
                  ],
                });

                //verify if the token will be push to a collection

                if (colID != -1) {
                  let Col_payload = {
                    contract_id: process.env.REACT_APP_CONTRACT,
                    title: values.title,
                    description: values.description,
                    media: values.image,
                    collection_id: colID,
                  };
                  console.log(
                    "🪲 ~ file: Mint.view.js ~ line 277 ~ onSubmit: ~ Col_payload",
                    Col_payload
                  );

                  transactions.push({
                    signerId: accountId,
                    receiverId: process.env.REACT_APP_CONTRACT_MARKET,
                    actions: [
                      {
                        type: "FunctionCall",
                        params: {
                          methodName: "add_token_to_collection_xcc",
                          args: Col_payload,
                          gas: 300000000000000,
                          deposit: 0,
                        },
                      },
                    ],
                  });
                }

                console.table(transactions);

                return wallet
                  .signAndSendTransactions({ transactions })
                  .catch((err) => {
                    alert("Failed to add messages exception " + err);
                    console.log("Failed to add messages");

                    throw err;
                  });

                // let tokenres = await contract.nft_mint(
                //   payload,
                //   300000000000000,
                //   amount,
                // )
              } else if (result.isDismissed) {
                console.log("not confirmd ");

                setmint({ ...mint, onSubmitDisabled: false });
              }
            });
          } else {
            const wallet = await selector.wallet();
            transactions.push({
              signerId: accountId,
              receiverId: process.env.REACT_APP_CONTRACT,
              actions: [
                {
                  type: "FunctionCall",
                  params: {
                    methodName: "nft_mint",
                    args: payload,
                    gas: 300000000000000,
                    deposit: amount,
                  },
                },
              ],
            });

            //verify if the token will be push to a collection

            if (colID != -1) {
              let Col_payload = {
                contract_id: process.env.REACT_APP_CONTRACT,
                title: values.title,
                description: values.description,
                media: values.image,
                collection_id: colID,
              };
              console.log(
                "🪲 ~ file: Mint.view.js ~ line 277 ~ onSubmit: ~ Col_payload",
                Col_payload
              );

              transactions.push({
                signerId: accountId,
                receiverId: process.env.REACT_APP_CONTRACT_MARKET,
                actions: [
                  {
                    type: "FunctionCall",
                    params: {
                      methodName: "add_token_to_collection_xcc",
                      args: Col_payload,
                      gas: 300000000000000,
                      deposit: 0,
                    },
                  },
                ],
              });
            }

            console.table("without royalties", transactions);

            return wallet
              .signAndSendTransactions({ transactions })
              .catch((err) => {
                alert("Failed to add messages exception " + err);
                console.log("Failed to add messages");

                throw err;
              });
            // let tokenres = await contract.nft_mint(
            //   payload,
            //   300000000000000,
            //   amount,
            // )
          }
        }
      }
      //if de error
    },
  });

  /**
   * hace que cuando se toque la imagen se cambien el valor de touch de formik
   */
  function imageClick() {
    formik.setFieldTouched("image");
  }
  /**
   * cada vez que el usuario cambia de archivo se ejecuta esta funcion
   *
   */

  async function uploadFilePinata(e) {
    let file = e.target.files[0];
    console.log(
      "🪲 ~ file: Mint.view.js ~ line 477 ~ uploadFilePinata ~ file",
      file
    );
    setmint({
      ...mint,
      file: URL.createObjectURL(e.target.files[0]),
      name: file?.name,
    });
    let cid = await uploadFileAPI(file);
    formik.setFieldValue("image", cid);
    console.log(cid);
  }
  async function handleAddToken() {
    console.log("Hola este es el handle");
    console.log(colID);
    console.log(
      "🪲 ~ file: Mint.view.js ~ line 414 ~ handleAddToken ~ colID",
      colID
    );
    if (colID <= -1) {
      console.log(
        "🪲 ~ file: Mint.view.js ~ line 416 ~ handleAddToken ~ colID",
        colID
      );
      Swal.fire({
        title: t("addToken.alert1-title"),
        text: t("addToken.alert1-msg"),
        icon: "error",
        confirmButtonColor: "#E79211",
      });
      return;
    }
    Swal.fire({
      title: t("addToken.alert2-title"),
      text: t("addToken.alert2-msg"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#E79211",
      cancelButtonColor: "#d33",
      confirmButtonText: "Agregar NFT",
    }).then(async (result) => {
      if (result.isConfirmed) {
        console.log("Agregando NFT a una coleccion");
        let payload = {
          contract_id: process.env.REACT_APP_CONTRACT,
          owner_id: props.tokens.owner,
          token_id: props.tokens.tokenID,
          title: props.jdata.title,
          description: props.jdata.description,
          media: props.jdata.image,
          creator: props.jdata.creator,
          price: 10,
          collection_id: parseInt(colID),
        };
        console.log(payload);
        // ext_call(process.env.REACT_APP_CONTRACT_MARKET, 'add_token_to_collection', payload, 300000000000000, 1)
        const wallet = await selector.wallet();
        wallet.signAndSendTransaction({
          signerId: accountId,
          receiverId: process.env.REACT_APP_CONTRACT_MARKET,
          actions: [
            {
              type: "FunctionCall",
              params: {
                methodName: "add_token_to_collection",
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
  async function makeAddToken() {
    console.log("Add token to collection");
    setAddTokenModal({
      ...state,
      show: true,
      title: t("Detail.msgAddToken"),
      message: t("Detail.msgAddToken2"),
      loading: false,
      disabled: false,
      change: setAddTokenModal,
      buttonName: "X",
      tokenId: "hardcoded",
    });
  }

  const format = (v) => {
    return v < 10 ? "0" + v : v;
  };
  const fechaActual = async () => {
    let contract = await getNearContract();
    const data = await contract.account.connection.provider.block({
      finality: "final",
    });
    const dateActual = new Date(data.header.timestamp / 1000000);
    const fs =
      format(dateActual.getFullYear()) +
      "-" +
      format(dateActual.getMonth() + 1) +
      "-" +
      format(dateActual.getDate());
    setactualDate(fs);
  };

  const setHide_create_nft = (e) => {
    setHide_create_col(false);
  };
  const setHide_create_coll = (e) => {
    setHide_create_col(true);
  };
  function handle_title(e) {
    setType_info({ ...type_info, title: e.target.value });
    console.log(
      "🪲 ~ file: Mint.view.js ~ line 420 ~ handle_title ~ setType_info",
      type_info
    );
  }
  useEffect(() => {
    (async () => {
      setColName(t("MintNFT.sweetTitle"));
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
    })();

    let urlParams = new URLSearchParams(window.location.search);
    console.log("🪲 ~ file: mintNft.view.js ~ line 375 ~ urlParams", urlParams);
    let execTrans = urlParams.has("transactionHashes");
    console.log("🪲 ~ file: mintNft.view.js ~ line 377 ~ execTrans", execTrans);
    if (execTrans) {
      window.location.href = "/congratulation";
    }

    return;
  }, [props]);

  return (
    <section className="text-gray-600 body-font   bg-[#F1EDF2]   h-full">
      {loading ? (
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
                className="w-full bg-white md:w-2/5 lg:w-4/12 lg:items-center "
              >
                <div name="cancel" className="mt-4 px-8   text-white  ">
                  <Button
                    className=" hover:bg-black  "
                    onClick={history.goBack}
                  >
                    <img className="" alt="back_arrow" src={back_arrow}></img>{" "}
                    <a className=" normal-case px-2 my-4 text-[#616161]">
                      {t("MintNFT.cancel")}{" "}
                    </a>
                  </Button>
                </div>
                <div className="w-full h-full pb-6 flex flex-col px-10       ">
                  <div classn="tab flex flex-row drop-shadow-md ">
                    <button onClick={setHide_create_nft}>
                      <h3 className=" text-black py-2 rounded-md    hover:scale-110 tracking-tighter text-4xl 	 font-open-sans font-bold ">
                        {" "}
                        {t("MintNFT.createNFT")}
                      </h3>
                    </button>
                  </div>

                  <div name="nft" hidden={hide_create_col}>
                    <p className="my-4  text-base text-[#0A0A0A] font-open-sans font-bold  ">
                      {t("MintNFT.upImage")}{" "}
                    </p>

                    <div className="overflow-hidden   ">
                      {/*mint?.file && (
                        
                        <img
                          className="rounded-md    m-auto  object-cover object-center "
                          alt="hero"
                          src={mint?.file}
                        />
                      )*/}
                      <label className={` `}>
                        <div className="flex w-full  ">
                          {mint?.file ? (
                            <div className="flex flex-col  relative     text-sm h-30 dark:bg-[#EBEBEB] dark:text-darkgray   rounded-lg justify-center  text-center   w-full ">
                              
                              <img
                          className="w-full h-60 xl:h-72 2xl:h-92 rounded-md    m-auto  object-cover object-center "
                          alt="hero"
                          src={mint?.file}
                          
                        />
                        {/* <div name="text img" className=" w-full flex rounded-lg flex-col  justify-center  absolute opacity-0 hover:opacity-80  bg-black ">
                             <p className="absolute top-1/2 w-full  text-center text-white   -translate-y-1/2  text-md truncate m-auto">{mint?.name}</p>
                              <span className="absolute top-1/2  w-full   text-white  border border-white  -translate-y-1 text-sm rounded-md	uppercase font-bold  m-auto  py-2">
                                
                                {t("MintNFT.changeImg")}
                              </span>
                        </div> */}
                             
                            </div>
                          ) : <br></br>}

{!mint?.file &&

(
  <div className="flex flex-col      text-sm h-[150px] dark:bg-[#EBEBEB] dark:text-darkgray   rounded-md justify-center  text-center   w-full ">
    <img
      src={upfile}
      className="h-[50px]  pt-4 object-contain"
    ></img>
    <span className="text-sm  mx-2 lg:text-md pt-6">
      {" "}
      {t("MintNFT.file_type")}
    </span>
  </div>
)
}
                         
                        </div>
                        <input
                          onChange={uploadFilePinata}
                          onClick={imageClick}
                          type="file"
                          id="image"
                          name="image"
                          className={`  hidden `}
                          accept={acceptedFormats}
                        />
                      </label>
                      {formik.touched.image && formik.errors.image ? (
                        <div className="flex leading-7 text-sm text-red-600 text-center  justify-center  font-open-sans">
                          {formik.errors.image}
                        </div>
                      ) : null}
                    </div>

                    <form onSubmit={formik.handleSubmit} className="   ">
                      <div className="fomr">
                        <div name="title" className="my-4">
                          <div className="flex justify-between ">
                            <label
                              htmlFor="title"
                              className="   dark:text-darkgray mt-2 text-base text-[#0A0A0A] font-open-sans font-bold"
                            >
                              {t("MintNFT.titleTxt")}
                            </label>
                            {formik.touched.title && formik.errors.title ? (
                              <div className=" text-sm text-red-600 font-open-sans">
                                {formik.errors.title}
                              </div>
                            ) : null}
                          </div>
                          <input
                            type="text"
                            id="title"
                            name="title"
                            onBlur={(e) => handle_title(e)}
                            {...formik.getFieldProps("title")}
                            className={`font-open-sans mt-1 p-2 border border-[#A4A2A4] h-full dark: dark:text-darkgray   text-left rounded-md justify-center w-full`}
                            placeholderTextColor="#000"
                            placeholder={t("MintNFT.write_title")}
                          />
                        </div>
                        <div name="description" className="mb-">
                          <div className="flex mt-2 justify-between ">
                            <label
                              htmlFor="description"
                              className="  dark:text-darkgray  text-base text-[#0A0A0A] font-open-sans font-bold "
                            >
                              {t("MintNFT.descTxt")}
                            </label>
                            {formik.touched.description &&
                            formik.errors.description ? (
                              <div className="leading-7 text-sm text-red-600 font-open-sans">
                                {formik.errors.description}
                              </div>
                            ) : null}
                          </div>

                          <div className="  font-open-sans   border border-[#A4A2A4]   dark: dark:text-darkgray  rounded-l text-left g justify-center  w-full h-[130px] mx-0     mb-2 ">
                            <textarea
                              type="textarea"
                              id="description"
                              name="description"
                              placeholder={t("MintNFT.maxTitle2")}
                              rows="5"
                              {...formik.getFieldProps("description")}
                              className={`font-open-sans p-2 h-full dark:bg-white dark:text-darkgray rounded-md   text-left justify-center  w-full`}
                            />
                          </div>
                        </div>

                        <div name=" " className="my-2">
                          <div className="flex justify-between ">
                            <label
                              htmlFor="royalties"
                              className=" text-sm  dark:text-darkgray   uppercase font-semibold font-raleway"
                            >
                              {t("MintNFT.lblRoyalties")}
                            </label>

                            <label class="inline-flex relative items-center mr-5 cursor-pointer">
                              <input
                                type="checkbox"
                                className="sr-only peer"
                                checked={hide_create_roy}
                                readOnly
                              />
                              <div
                                onClick={() => {
                                  removeallFields();
                                  setHide_create_roy(!hide_create_roy);
                                }}
                                className="w-11 h-6 bg-gray-200 rounded-full peer  peer-focus:ring-green-300  peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#F79336]"
                              ></div>
                            </label>
                          </div>

                          <div>
                            <div>
                              {formFields.map((form, index) => {
                                return (
                                  <div
                                    key={index}
                                    className="w-full flex my-2 gap-1 "
                                  >
                                    <div className="flex  rounded-md  w-8/12         ">
                                      <input
                                        name="account"
                                        placeholder={t("MintNFT.placeAccount")}
                                        className="font-open-sans text-xs p-2 h-full dark:bg-white dark:text-darkgray border border-[#A4A2A4] text-left rounded-md justify-center     w-full"
                                        onChange={(event) =>
                                          handleFormChange(event, index)
                                        }
                                        value={form.name}
                                      />
                                    </div>

                                    <div className="   rounded-md  w-2/12         border border-[#A4A2A4]   ">
                                      <input
                                        type="number"
                                        min="0.1"
                                        step="0.1"
                                        name="percent"
                                        placeholder={"%"} //t("MintNFT.placePercent")}
                                        className="font-open-sans text-xs  p-1  h-full dark:bg-white dark:text-darkgray     rounded-md justify-center  w-full "
                                        onChange={(event) =>
                                          handleFormChange(event, index)
                                        }
                                        value={form.age}
                                      />
                                    </div>
                                    <button
                                      type="button"
                                      onClick={() => removeFields(index)}
                                      className="w-2/12 rounded-md  content-fit font-bold dark:text-white    border-2 border-red-600  hover:bg-red-600   text-sm uppercase font-open-sans"
                                    >
                                      <svg
                                        fill="#c61a09"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        width="20px"
                                        height="24px"
                                      >
                                        <path d="M 10 2 L 9 3 L 4 3 L 4 5 L 5 5 L 5 20 C 5 20.522222 5.1913289 21.05461 5.5683594 21.431641 C 5.9453899 21.808671 6.4777778 22 7 22 L 17 22 C 17.522222 22 18.05461 21.808671 18.431641 21.431641 C 18.808671 21.05461 19 20.522222 19 20 L 19 5 L 20 5 L 20 3 L 15 3 L 14 2 L 10 2 z M 7 5 L 17 5 L 17 20 L 7 20 L 7 5 z M 9 7 L 9 18 L 11 18 L 11 7 L 9 7 z M 13 7 L 13 18 L 15 18 L 15 7 L 13 7 z" />
                                      </svg>
                                    </button>
                                  </div>
                                );
                              })}
                            </div>

                            <div
                              className={
                                !hide_create_roy
                                  ? "hidden"
                                  : "relative group mt-4 rounded-md"
                              }
                            >
                              {/* <div className="absolute -inset-0.5 bg-[#5aee8c]  rounded-md   opacity-70 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt group-hover:-inset-1"></div> */}
                              <button
                                type="button"
                                onClick={addFields}
                                className="relative w-1/2 text-sm rounded-md dark:text-[#F79336] font-bold border-2 border-[#F79336] py-2   uppercase font-open-sans"
                              >
                                {t("MintNFT.btnRoyalties")}
                              </button>
                            </div>

                            {/* <div name="collections " className="my-4">
                            <div className="flex justify-between ">
                            <label
                              htmlFor="collections"
                              className=" text-sm  dark:text-darkgray   uppercase font-semibold font-raleway"
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
                                      console.log("🪲 ~ file: Mint.view.js ~ line 808 ~ LightHeroE ~ e", e.target.value?.key)
                                      setColID(e.target.value);
                                      setColName(e.target.value);
                                      console.log("🪲 ~ file: Mint.view.js ~ line 808 ~ LightHeroE ~ e", e.target.key)
                                    }}
                                  >
                                    <option key={0} value={-1}>
                                      {t("addToken.comboOpc")}
                                    </option>
                                    {collectionData.length > 0
                                      ? collectionData.map((data) => (
                                          <option className="bg-indigo-500" key={data.id} value={data.id}>
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
                                      className="relative bg-lime-600 text-white text-center font-bold uppercase text-sm px-6 py-3 rounded-md   ease-linear transition-all duration-150  hover:scale-105"
                                      href="/collectionData/create"
                                    >
                                      {t("addToken.btnCol")}
                                    </a>
                                  </div>
                                </>
                              )}
                            </div> */}
                          </div>

                          <div className="relative group mt-10 rounded-md">
                            {/* <div className="absolute -inset-0.5 bg-gradient-to-r from-[#f2b159] to-[#ca7e16] rounded-full blur opacity-70 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt group-hover:-inset-1"></div> */}
                            <button
                              type="submit"
                              className={`relative w-full bg-yellow2 rounded-md uppercase font-open-sans text-base px-6 py-2 font-bold border-2 border-yellow2 dark:text-white`}
                              disabled={mint?.onSubmitDisabled}
                            >
                              {t("MintNFT.createNFT")}
                            </button>
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>
                  
                </div>
              </div>
              {window.innerWidth >= 640 ? (
                <div
                  name="nft_detail"
                  className={
                    "  px-4 md:px-8  py-8  md:py-20  lg:mx-auto  w-full md:w-3/5  lg:w-3/6 xl:w-5/12  2xl:1/2 drop-shadow-2xl       md:flex-row flex-col  md:justify-center    "
                  }
                >
                  <p className=" w-full  text-base font-bold  text-left my-4">
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
                      {mint?.file && (
                        <img
                          className=" w-full h-full  object-cover object-center "
                          alt="hero"
                          src={mint?.file}
                        />
                      )}
                    </div>
                    <div
                      name="card_det"
                      className="w-full rounded-b-2xl   pt-4 px-4    bg-white h-full md:h-[170px]"
                    >
                      <p className=" text-black uppercase text-2xl truncate   md:text-3xl  font-bold font-open-sans">
                        {formik.values.title
                          ? formik.values.title
                          : t("MintNFT.write_title")}
                      </p>
                      <p className=" text-black normal-case text-md truncate   md:text-lg   font-open-sans">
                        {formik.values.description
                          ? formik.values.description
                          : t("MintNFT.descTxt")}
                      </p>

                      <div className="py-2 flex">
                        <img
                          className=" mt-1 w-5 h-5   "
                          alt="near"
                          src={nearicon}
                        />

                        <p className="text-[#F79336] ml-4 normal-case font-bold font-open-sans    text-lg ">
                          {" "}
                          {t("MintNFT.PendingPrice")}
                        </p>
                      </div>

                      <div className="flex ">
                      <p className="text-black content-en leading-5 ml-2 mb-2 font-open-sans tracking-[3.45px] text-sm md:text-md ">
                                              {t("tokCollection.createdBy")} : 
                                                
                                            </p>
                                            <p className="text-black content-en  mb-2 font-open-sans font-bold text-sm md:text-md ">
                                              
                                              {  window.localStorage.getItem("logged_account")}
                                            </p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <></>
              )}
            </div>
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
