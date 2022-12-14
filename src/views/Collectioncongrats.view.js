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

import { useParams, useHistory } from "react-router-dom";

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
import { asyncAct } from "@testing-library/react/dist/act-compat";
function LightHeroE(props) {
  const { selector, modal, accounts, accountId } = useWalletSelector();
  //este estado contiene toda la info de el componente
  const [mint, setmint] = React.useState({
    avatar: undefined,
    banner: undefined,
    avatar_file: undefined,
    banner_file: undefined,
    banner_name: undefined,
    avatar_name: undefined,
    banner_cid: undefined,
    avatar_cid: undefined,
    blockchain: localStorage.getItem("blockchain"),

  });
  const [type_info, setType_info] = useState({
    title: "",
    description: "",
    website: "",
    twitter: "",
  });
  const history = useHistory();
  const [colID, setColID] = useState(-1);
  const [colName, setColName] = useState("");
  const [aCDI, setAcid] = useState("");
  const [bCDI, setBcid] = useState("");

  const [t, i18n] = useTranslation("global");
  const [loading, setLoading] = useState(false);

  const [noCollections, setNoCollections] = useState(false);
  const [collectionData, setCollectionData] = useState([]);

  const [addTokenModal, setAddTokenModal] = useState({
    show: false,
  });

  const [hide_create_col, setHide_create_col] = useState(false);
  const [hide_create_roy, setHide_create_roy] = useState(false);

  const [actualDate, setactualDate] = useState("");
  const [colId, setColId] = useState()
  const [visibility, setVisibility] = useState(false)
  const [type, setType] = useState(false)
  
  const [formFields, setFormFields] = useState([]);

  const handleFormChange = (event, index) => {
    let data = [...formFields];
    data[index][event.target.name] = event.target.value;
    setFormFields(data);
  };
 

  const APIURL = process.env.REACT_APP_API_TG;
  //guardara todos los valores del formulario

  const formik = useFormik({
    initialValues: {
   
      avatar: "",
      banner: "",
      title:"",
      description:"",
      titleCol: "",
      website: "",
      twitter: "",
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
      website: Yup.string()
        .max(1000, t("MintNFT.maxDesc"))
        .required(t("MintNFT.required"))
        .min(5, t("MintNFT.minDesc")),
      twitter: Yup.string()
        .max(1000, t("MintNFT.maxDesc"))
        .required(t("MintNFT.required"))
        .matches(/^[0A-Za-z0-9]/, t("CreateCol.errTwitter"))
        .min(5, t("MintNFT.minDesc")),

      // price: Yup.number()
      //   .required(t("MintNFT.required"))
      //   .positive(t("MintNFT.posPrice"))
      //   .moreThan(0.09999999999999, t("MintNFT.morePrice"))
      //   .min(0.1, t("MintNFT.minPrice")),

      // avatar: Yup.string().required(t("MintNFT.required")),

      // banner: Yup.string().required(t("MintNFT.required")),
    }),
    onSubmit: async (values) => {
 
    

    },
  });
 
 
 
 
  const { state } = useParams();

  useEffect(() => {
    (async () => {



      const query = `
      query ($id: String){
        collections(first:1,orderBy:id,orderDirection:desc ,where:{owner_id:$id}){
          id
          owner_id
          collectionID
          title
          description
          mediaIcon
          mediaBanner
          visibility
           
          timestamp
        }
      }
    `

    const client = new ApolloClient({
      uri: APIURL,
      cache: new InMemoryCache(),
    })
    console.log(type)
    await client.query({
        query: gql(query),
        variables: {
          id: accountId
        }
    })
    .then((data)=> {
      console.log("🪲 ~ file: Collection.view.js:478 ~ .then ~ data", data)
      let col = data.data.collections[0];

      setmint({
      ...mint,
      avatar:  `https://nativonft.mypinata.cloud/ipfs/${col.mediaIcon}` ,
      banner:  `https://nativonft.mypinata.cloud/ipfs/${col.mediaBanner}`
    });
      formik.setFieldValue("title", col.title);
      
      // console.log('last collection: ',data.data.collections[0])
      // collectionData = data.data.collections[0]
    })
    .catch((err) =>{
      console.log('error: ',err)
    })


return





    })()
  },[])
  const SkipPrice = () => {
    Swal.fire({
      background: '#0a0a0a',
      width: '800',
      html:
        '<div class="">' +
        '<div class="font-open-sans  text-base font-extrabold text-white mb-4 text-left uppercase">' +  t("Modal.skip_tittle") + '</div>' +
        '<div class="font-open-sans  text-sm text-white text-left">' + t("Modal.skip_collection_description") + '</div>' +
        '</div>',
      confirmButtonText: t("Modal.skip_accept"),
      cancelButtonText: "No",
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
        window.location.href = "/mynfts";
      }
    });
  };
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
                className="w-full bg-white md:w-2/5 lg:w-5/12 xl:w-4/12 2xl:w-4/12 lg:items-center "
              >
                 
                <div className="w-full h-full pt-16   flex flex-col px-10       ">
                  <div classn="tab flex flex-row drop-shadow-md ">
                    <button  >
                      <h3 className=" text-black py-4 rounded-md    hover:scale-110 tracking-tighter text-4xl md:text-3xl	lg:text-4xl  font-open-sans font-bold ">
                        {" "}
                        {t("MintNFT.congrats")}
                      </h3>
                    </button>
                  </div>
                  <p name="yourColl" className="font-bold text-base pb-4">
                  {t("CreateCol.succ-msg")}
                  </p>
                  <p name="Nowyou" className=" text-sm pb-4">
                  {t("CreateCol.succ-now")}
                  </p>
                  <div className="w-full flex flex-col gap-2">
                     
                        <button
                          className={`w-full relative px-4 py-2 my-2 bg-yellow2  rounded-md  text-white   text-center hover:scale-105 tracking-tighter  font-open-sans text-xs lg:text-lg  xl:text-xl   font-bold `}
                          onClick={(e) => {
                            window.location.href = "/create";
                          }}
                        >
                          {t("CreateCol.createNFT")}
                        </button>
                     

                      

                      {/*  btn save*/}

                       
                      <button
                        type="submit"
                        onClick={SkipPrice}
                        className={`w-full relative rounded-md px-4 py-2 my-2 text-white bg-[#A4A2A4] text-center hover:scale-105  tracking-tighter  font-open-sans text-xs  lg:text-lg xl:text-xl   font-bold `}
                      >
                        {t("MintNFT.Skip")}
                      </button>
                    </div>
                   
                </div>
              </div>

              <div
                name="nft_detail"
                className={
                  "  md:block px-4 md:px-8  py-8  md:py-20  lg:mx-auto  w-full md:w-3/5  lg:w-3/6 xl:w-6/12  2xl:1/2 drop-shadow-2xl       md:flex-row flex-col  md:justify-center    "
                }
              >
                <p className=" w-full   text-lg xl:text-xl font-bold  text-left my-4">
                  {t("CreateCol.prevCol")}
                </p>
                <div
                  name="card"
                  className={
                    hide_create_col
                      ? " sm:hidden "
                      : "" + "rounded-2xl flex flex-col    "
                  }
                >
                 
                  <div className="w-full   h-[250px]   md:h-[250px] lg:h-[280px]  xl:h-[350px]  overflow-hidden rounded-t-2xl   bg-[#EBEBEB]">
                    {mint?.banner && (
                      <img
                        className=" w-full h-full  object-cover object-center "
                        alt="banner"
                        src={mint?.banner}
                      />
                    )}
                  </div>
                  <div
                    name="card_det"
                    className="w-full flex rounded-b-2xl    pl-4 xl:pl-8 bg-white h-full md:h-[100px] lg:h-[120px] xl:h-[170px]" //px-4
                  >

<div className="w-2/6">
<div className=" -translate-y-6 md:-translate-y-10 xl:-translate-y-16 w-[100px]  h-[100px] md:w-[120px]  md:h-[120px]    lg:w-[140px]  lg:h-[140px] xl:w-[200px]  xl:h-[200px] overflow-hidden border border-white   bg-[#EBEBEB]">{/* -translate-y-14 xl:-translate-y-16   md:translate-x-2   */}
                    {mint?.avatar && (
                      <img
                        className=" w-full h-full  object-cover object-center "
                        alt="avatar"
                        src={mint?.avatar}
                      />
                    )}
                  </div>
</div>
  <div className="w-4/6  ">   {/*  xl:-translate-x-8 2xl:-translate-x-16  */}
  <div className=" w-full  h-[100px]   flex flex-col pt-2  lg:pl-2 border border-white   bg-transparent"> {/* -translate-y-4   translate-x-10 md:translate-x-2   */}
                   {formik.values.title ?
                   <p className="normal-case  text-lg lg:text-xl xl:text-2xl truncate font-bold  ">
                  
                   {formik.values.title }
                 </p> :
                     <p className="normal-case  text-lg lg:text-xl xl:text-2xl truncate font-bold  ">
                  
                     {t("CreateCol.titleCol")}
                   </p> 
                  }
                   <p className="text-black font-bold     font-open-sans  text-xs  lg:text-sm  xl:text-lg ">
                        {t("CreateCol.by")} :   {  window.localStorage.getItem("logged_account")}
                    </p>
                   <p className="text-black  mt-4  content-en   font-open-sans  text-[10px] lg:text-xs xl:text-md ">
                     ITEMS       
                    </p>
                  </div>
  </div>               
                  
                 

                 
                                               
                                            
                                           
                  </div>
                </div>
              </div>
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
