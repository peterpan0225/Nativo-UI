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

      //evitar que el usuario pueda volver a hacer click hasta que termine el minado
     

    /* Si se cargaron las imagenes a pinata desde el state */ 
   let res= await uploadFilesPinata();
   

    if(  res.status===true ){
     
      saveCollection(res.avatar_cid,res.banner_cid)
      return;
    }
   else{
    console.log("no subio algo")
    return;
   }
      



    },
  });

 async function saveCollection(acd1,bcd2) {
    // console.log("Hola");
  //  console.log("🪲 ~ file: Collection.view.js:416 ~ saveCollection ~ type", type)

    let contract = await getNearContract();
    const owner = await getNearAccount()
    let payloadCol
    if(type){
      payloadCol = {
        title: formik.values.title,
        description: formik.values.description,
        media_icon: formik.values.avatar,
        media_banner: formik.values.banner,
        website:formik.values.website,
        twitter:formik.values.twitter,
        visibility: false,
        _id: colId,
        _type: "edit"
      }
    }
    else{
      payloadCol = {
        title: formik.values.title,
        description: formik.values.description,
        media_icon: acd1,
        media_banner: bcd2,
        website:formik.values.website,
        twitter:formik.values.twitter,
        visibility: true,
        _id: "0",
        _type: "create"
      }
    }     
    
  
     console.log("🪲 ~ file: Collection.view.js:432 ~ saveCollection ~ payloadCol", payloadCol)

   
 
    const wallet = await selector.wallet();

  
    wallet.signAndSendTransaction({
      signerId: accountId,
      receiverId: process.env.REACT_APP_CONTRACT_MARKET,
      actions: [
        {
          type: "FunctionCall",
          params: {
            methodName: "add_new_user_collection",
            args: payloadCol,
            gas: 300000000000000,
            deposit: 1,
          }
        }
      ]
    })
    // Swal.fire({
    //   html:
    //   '<div>'+
    //   '<div class="font-open-sans dark:text-darkgray text-xl font-bold">' +  t("CreateCol.succ-title") + '</div>'+ 
    //   '<div class="font-open-sans dark:text-darkgray  text-sm">' + t("CreateCol.succ-msg")+ '</div>'+
    //   '</div>',
    //   icon: 'success',
    // }).then(function () {
    //   window.location.href = "/create"
    // })
  }

  /**
   * hace que cuando se toque la imagen se cambien el valor de touch de formik
   */
  function imageAvatarClick() {
    formik.setFieldTouched("avatar");
  }
  /* 
  
  /* 
  Esta funcion toma el archivo y lo guarda en el state 
  */
  async function saveAvatarFilePinata(e) {

    try {
      let file = e.target.files[0];

    setmint({
      ...mint,
      avatar: URL.createObjectURL(e.target.files[0]),
      avatar_file:e.target.files[0],
      avatar_name: file?.name,
    });
    console.log(
      "🪲 ~ file: Collection.view.js:490 ~ saveAvatarFilePinata ~ mint",
      mint
    );
    } catch (error) {
      console.log("canceled")
    }
    
  }

  /**
   * hace que cuando se toque la imagen se cambien el valor de touch de formik
   */
  function imageBannerClick() {
    formik.setFieldTouched("banner");
  }
  /*
  Esta funcion toma el archivo del state y lo sube a pinata para recuperar el CID
  */
  const uploadFilesPinata = async ()=> {
    let respo={
      avatar_cid:"",
      banner_cid:"",
      status:false
    }
    if (!mint.avatar){
      Swal.fire({
        position: 'top-center',
        icon: 'warning',
        title: t("CreateCol.erruploadAvatar"),
        showConfirmButton: false,
        timer:4000
        
      })
       
      return respo ;
    }
    if (!mint.banner){
      Swal.fire({
        position: 'top-center',
        icon: 'warning',
        title: t("CreateCol.erruploadBanner"),
        showConfirmButton: false,
        timer:4000
        
      })
      return respo;
    }
    
    else{
      console.log("Uploading   ")
      Swal.fire({
        html:'<div className="text-center h-30 w-30">'
+       ' <svg role="status" class="inline mr-3 w-10 h-10 text-white  animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">'
+       ' <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB"/>'
+       ' <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"/>'
+       ' </svg>'
+' </div>',
        position: 'top-center',
        title: t("CreateCol.uploadingAvatar"),
        showConfirmButton: false,
        
      })


      let acid = await uploadFileAPI(mint.avatar_file);
      formik.setFieldValue("avatar", acid);

      setAcid(acid)
      let bcid = await uploadFileAPI(mint.banner_file);
      formik.setFieldValue("banner", bcid);
      setBcid(bcid)


      respo={
        avatar_cid:acid,
        banner_cid:bcid,
        status:true
      }
      Swal.close()
      return respo;
    }
    
  }
  /* 
  Esta funcion toma el archivo y lo guarda en el state 
  */
  async function saveBannerFilePinata(e) {
    try {
      let file = e.target.files[0];

      setmint({
        ...mint,
        banner: URL.createObjectURL(e.target.files[0]),
        banner_file:e.target.files[0],
        banner_name: file?.name,
      });
      console.log(
        "🪲 ~ file: Collection.view.js:490 ~ saveAvatarFilePinata ~ mint",
        mint
      );
    } catch (error) {
      console.log("canceled")
    }
   
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

 
  
  function handle_title(e) {
    setType_info({ ...type_info, title: e.target.value });
    console.log(
      "🪲 ~ file: Mint.view.js ~ line 420 ~ handle_title ~ setType_info",
      type_info
    );
  }
  function handle_website(e) {
    setType_info({ ...type_info, website: e.target.value });
  }
  function handle_twitter(e) {
    setType_info({ ...type_info, twitter: e.target.value });
  }

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
      title: t("Modal.skip_tittle"),
      text: t("Modal.skip_collection_description"),
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
                 
                  <div className="w-full   h-[280px]   md:h-[250px] lg:h-[280px]  xl:h-[350px]  overflow-hidden rounded-t-2xl   bg-[#EBEBEB]">
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
                    className="w-full flex rounded-b-2xl   pt-4 px-4    bg-white h-full md:h-[100px] lg:h-[120px] xl:h-[140px]"
                  >

<div className="w-1/3">
<div className=" w-[120px]  h-[120px] lg:w-[140px]  lg:h-[140px] xl:w-[170px]  xl:h-[170px] -translate-y-14 xl:-translate-y-16   md:translate-x-2 overflow-hidden border border-white   bg-[#EBEBEB]">
                    {mint?.avatar && (
                      <img
                        className=" w-full h-full  object-cover object-center "
                        alt="avatar"
                        src={mint?.avatar}
                      />
                    )}
                  </div>
</div>

  <div className="sm:w-2/3   xl:-translate-x-8 2xl:-translate-x-16">
 <div className=" w-full  h-[100px] -translate-y-4   translate-x-10 md:translate-x-2   flex flex-col pt-2 pl-2 border border-white   bg-transparent">
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
