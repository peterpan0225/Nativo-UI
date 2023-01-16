import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Tooltip from '@mui/material/Tooltip';
import { Tab  } from "@headlessui/react";
import { Accordion } from 'react-bootstrap-accordion'
import 'react-bootstrap-accordion/dist/index.css'

import { useHistory } from "react-router-dom";
import ModalRevender from "./modalRevender.component";
import TransferModal from "./transferModal.component"
import ApprovalModal from "./approvalModal.component"
import PriceModal from "./priceModal.component"
import load from "../assets/landingSlider/img/loader.gif";
import Pagination from '@mui/material/Pagination';
import { currencys } from "../utils/constraint";
import {
  getNearAccount,
  getNearContract,
} from "../utils/near_interaction";
import { ApolloClient, InMemoryCache, gql } from '@apollo/client'
import { useTranslation } from "react-i18next";
import InfiniteScroll from 'react-infinite-scroll-component';
import { useWalletSelector } from "../utils/walletSelector";
import { providers, utils } from "near-api-js";
import nearImage from '../assets/img/landing/trendingSection/Vector.png';
import { useLocation } from "react-router-dom";

function MyCollections(props) {
  //Hooks para el manejo de estados
  const [pagsale, setpagsale] = React.useState(0);
  const [pagCount, setpagCount] = React.useState("");
  const [chunksale, setchunksale] = React.useState(0);
  const { selector, modalWallet, accounts, accountId } = useWalletSelector();
  const [page, setpage] = React.useState(1);
  const [pageCreations, setpageCreations] = React.useState(1);
  const [pageCollections, setPageCollections] = React.useState(1);
  const [trigger, settrigger] = React.useState(true);
  const [ini, setini] = React.useState(true);
  const [firstID, setFirstID] = React.useState(-1);
  const [lastID, setLastID] = React.useState(-1);
  const [lastIDCollection, setLastIDCollection] = React.useState(-1);
  const [statePage, setStatePage] = React.useState(true)
  const [firstLoad, setFirstLoad] = React.useState(true)
  const [loadMsg, setLoadMsg] = React.useState(true)
  const [loadMsgCollections, setLoadMsgCollections] = React.useState(true);
  const [colSortOrd, setColSortOrd] = React.useState('desc');
  const [colSort, setColSort] = React.useState('collectionID');
  const [t, i18n] = useTranslation("global")
  const [triggerCol, setTriggerCol] = React.useState(true);
  const [nfts, setNfts] = useState({
    nfts: [],
    nftsCreations: [],
    collections: [],
    page: parseInt(window.localStorage.getItem("Mypage")),
    tokensPerPage: 3,
    tokensPerPageNear: 6,

    blockchain: localStorage.getItem("blockchain"),
    currency: currencys[parseInt(localStorage.getItem("blockchain"))],
  }); //state de los token nft
  const [modal, setModal] = useState({
    //state para la ventana modal
    show: false,
  });
  let [collections, setCollections] = React.useState({
    items: [],
    hasMore: true
  });
  const [hasDataCol, setHasDataCol] = React.useState(true);
  const [lastName, setLastName] = React.useState('');

  const [modalSub, setModalSub] = useState({
    //state para la ventana modal
    show: false,
  });

  const [transferModal, setTransferModal] = useState({
    show: false,
  });

  const [searchNftsModal, setSearchNftsModal] = useState({
    show: false,
  });

  const [approvalModal, setApprovalModal] = useState({
    show: false,
  });

  const [priceModal, setPriceModal] = useState({
    show: false,
  });
  const [allNfts, setAllNfts] = useState({nfts:[],contracts:[]});
  const [profile, setProfile] = useState({user:''});
  const location = useLocation();
  let imgs = [];
  const [myProfile, setMyProfile] = useState(false);

  const APIURL = process.env.REACT_APP_API_TG


 




  const [state, setState] = React.useState({
    items: Array.from({ length: 400 }),
    hasMore: true,
    hasMoreCreations: true,
    hasMoreCollections: true
  });

  function delay(n){
    return new Promise(function(resolve){
        setTimeout(resolve,n*1000);
    });
  }



  //Hook para el manejo de efectos
 

  React.useEffect(() => {
    const query = new URLSearchParams(location);
    console.log('QUERY', query.get('pathname').split('/')[1] + (process.env.REACT_APP_NEAR_ENV == 'mainnet' ? '.near' : '.testnet'));//.pathname.split('/')[0]);
    let user = query.get('pathname').split('/')[1] + (process.env.REACT_APP_NEAR_ENV == 'mainnet' ? '.near' : '.testnet');
    setProfile({ user: user}); 
    

 
    console.log("queryonfo",colSort + colSortOrd)
    async function getColData() {
        const queryData = `
        query($first: Int, $account: String){
            collections(first: $first,  orderBy: ${colSort}, orderDirection: ${colSortOrd}, where:{ owner_id: $account  }){
                id
                collectionID
                owner_id
                title
                timestamp
                mediaIcon
                mediaBanner,
                description,
                tokenCount,
                visibility
            }
        }
        `

        //Declaramos el cliente
        const client = new ApolloClient({
            uri: APIURL,
            cache: new InMemoryCache(),
        })

        await client
            .query({
                query: gql(queryData),
                variables: {
                    first: nfts.tokensPerPageNear,
                    account: user
                },
            })
            .then((data) => {
              console.log("DATa",data);
                setCollections({
                    ...collections,
                    items: collections.items.concat(data.data.collections)
                });
                if (data.data.collections.length <= 0) {
                  console.log("DATa<=0",data);
                    setHasDataCol(false);
                    console.log("aaaaajjj");
                    return
                } else {
                  console.log("DATa>=0",data);
                  setLastID(parseInt(data.data.collections[data.data.collections.length - 1].collectionID))
                  setLastName(data.data.collections[data.data.collections.length - 1].title)
                  setHasDataCol(true)
                }

                if(data.data.collections.length == 1 && !data.data.collections[0].visibility && user != accountId){
                  console.log("estoy en mi primer coleccion invisible");
                  setHasDataCol(false)
                  return;
                }
            })
            .catch((err) => {
                console.log('Error ferching data: ', err)
                setHasDataCol(false)
            })
            if (user == accountId) {
              setMyProfile(true)
            }
    }
    getColData()
}, [triggerCol])



  let fetchMoreColData = async () => {
    console.log('carga data colecciones')
    await delay(1)
    var sort
    var last
    if (colSortOrd == 'asc') {
        sort = 'gt'
    }
    else if (colSortOrd == 'desc') {
        sort = 'lt'
    }
    if (colSort == 'collectionID') {
        last = lastID.toString()
    }
    else if (colSort == 'title') {
        last = lastName
    }
    let colData;
    console.log("antes d ela query")
    console.log("profile", profile.user);
    const queryData = `
          query($first: Int, $lastTokenID: String, $account: String){
              collections(first: $first,  orderBy: ${colSort}, orderDirection: ${colSortOrd}, where: { ${colSort}_${sort}: $lastTokenID, owner_id: $account  }){
                id
                collectionID
                owner_id
                title
                timestamp
                mediaIcon
                mediaBanner,
                description,
                tokenCount,
                visibility
            }
          }
        `

    //Declaramos el cliente
    const client = new ApolloClient({
        uri: APIURL,
        cache: new InMemoryCache(),
    })

    await client
        .query({
            query: gql(queryData),
            variables: {
                first: nfts.tokensPerPageNear,
                lastTokenID: last,
                account: profile.user
            },
        })
        .then((data) => {
            if (data.data.collections.length <= 0) {
                setCollections({ ...collections, hasMore: false })
                return
            }
            if (data.data.collections.length < nfts.tokensPerPageNear) {
                setCollections({ ...collections, hasMore: false, items: collections.items.concat(data.data.collections) });
                setLastID(parseInt(data.data.collections[data.data.collections.length - 1].collectionID))
                setLastName(data.data.collections[data.data.collections.length - 1].title)
                return;
            }
            setCollections({
                ...collections,
                items: collections.items.concat(data.data.collections)
            });
            setLastID(parseInt(data.data.collections[data.data.collections.length - 1].collectionID))
            setLastName(data.data.collections[data.data.collections.length - 1].title)
            console.log(data.data.collections)
        })
        .catch((err) => {
            colData = 0
            console.log(err)
        })
      }
 

  let handleSortCollections = (data) => {
    if ('TimeDesc' == data.target.value) {
        if (colSortOrd == 'desc' && colSort == 'collectionID') {
            return;
        }
        console.log('entro time desc')
        setColSortOrd('desc')
        setColSort('collectionID')
        setCollections({
            ...collections,
            hasMore: true,
            items: []
        });
    }
    else if ('TimeAsc' == data.target.value) {
        if (colSortOrd == 'asc' && colSort == 'collectionID') {
            return;
        }
        console.log('entro time asc')
        setColSortOrd('asc')
        setColSort('collectionID')
        setCollections({
            ...collections,
            hasMore: true,
            items: []
        });
    }
    else if ('TitleAsc' == data.target.value) {
        if (colSortOrd == 'asc' && colSort == 'title') {
            return;
        }
        console.log('entro title asc')
        setColSortOrd('asc')
        setColSort('title')
        setCollections({
            ...collections,
            hasMore: true,
            items: []
        });
    }
    else if ('TitleDesc' == data.target.value) {
        if (colSortOrd == 'desc' && colSort == 'title') {
            return;
        }
        console.log('entro title desc')
        setColSortOrd('asc')
        setColSort('title')
        setCollections({
            ...collections,
            hasMore: true,
            items: []
        });
    }
    setTriggerCol(!triggerCol)
}

  return (
    <>
      <ul>
      {hasDataCol ? <>

          <li><InfiniteScroll
          dataLength={collections.items.length}
          next={fetchMoreColData}
          hasMore={collections.hasMore}
            loader={<h1 className="text-center font-clash-grotesk font-semibold w-full py-10 text-xl text-black">{t("tokCollection.loading")}</h1>}
            endMessage={
              <p className="text-center font-clash-grotesk font-semibold w-full py-10 text-xl text-black">
                {t("Explore.endCol")}
              </p>
            }
            className={"flex flex-wrap px-6 gap-6 lg:gap-4 lg:justify-start"}
          >
            <div className="flex flex-wrap  gap-4 lg:gap-[19px] justify-start w-full">
              {collections.items.map((nft, key) => {
                //obtenemos la data del token nft
                const item = nft;
                console.log('collecciobots', nft)
                console.log('Is this y profile?', myProfile);
                console.log('Is this collections visible?', item.visibility+ item.collectionID);
                console.log('KEEEY', key);
                if (myProfile) {
                  return (
                    <>
                    { key == 0 ?
                      <div className=" w-full pb-6  flex flex-row-reverse">
                        <select name="sort" className="text-base font-open-sans pl-3 py-2.5 border-outlinePressed dark:text-black md:w-[283px]" onChange={handleSortCollections}>
                          <option value="" disabled selected hidden>{t("Explore.sortBy")}</option>
                          <option value="TimeDesc">{t("Explore.sortTimeRec")}</option>
                          <option value="TimeAsc">{t("Explore.sortTimeOld")}</option>
                          <option value="TitleAsc">{t("Explore.sortTitAz")}</option>
                          <option value="TitleDesc">{t("Explore.sortTitZa")}</option>
                        </select>
                      </div> : ""
                    }
                    <div className="w-full sm:w-[280px] md:w-[350px] lg:w-[477px] xl:w-[397px] 2xl:w-[482px]" key={key}>
                      <a href={"/viewcollection/" + item.collectionID}
                      >
                        <div className="flex flex-row justify-items-center w-full" key={key}>

                          <div className="rounded-xl shadow-lg bg-white hover:scale-105 w-full ">
                            <div className="  overflow-hidden rounded-t-xl  bg-white ">

                              <img className="  h-[190px] object-cover object-center scale-150 w-full lg:h-[306px] " alt={item.description} src={`https://nativonft.mypinata.cloud/ipfs/${item.mediaBanner}`} />

                            </div>
                            <div className="flex flex-row  mb-4" name="card_detail">
                              <div className=" z-10 -mt-4 lg:-mt-8 ml-4        ">
                                <img className="  object-cover  rounded-md bg-white  border-2 border-white w-[90px] h-[90px] lg:w-[120px] lg:h-[120px] " src={`https://nativonft.mypinata.cloud/ipfs/${item.mediaIcon}`} alt={item.description} />
                              </div>

                              <div class="flex flex-col  mx-2 mt-2  ">
                                <p className="   w-[210px]  sm:w-[150px] md:w-[230px] lg:w-[305px] xl:w-[220px] 2xl:w-[280px] uppercase tracking-tighter text-black text-base font-open-sans font-extrabold collection-description h-[50px] justify-center items-center">{item.title}</p>
                                <p className="   w-[210px]  sm:w-[150px] md:w-[230px] lg:w-[305px] xl:w-[220px] 2xl:w-[280px] uppercase tracking-tighter text-xs text-left font-bold justify-center font-open-sans leading-4 text-black truncate">{t("Landing.popular_col-by") + " " + item.owner_id}</p>
                                <div className="   w-[210px]  sm:w-[150px] md:w-[230px] lg:w-[305px] xl:w-[220px] 2xl:w-[280px]   text-xs  text-black text-left justify-center font-normal font-open-sans truncate"><p className="w-full   text-xs text-black font-open-sans font-normal tracking-wide leading-4  text-left justify-center truncate uppercase"><b>{item.tokenCount > 999 ? "+" + item.tokenCount + "k " : item.tokenCount + " "}</b> {t("Landing.popular_col-tokens_on")}</p></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </a>
                    </div>
                    </>);
                } else {
                  if (item.visibility) {
                    return (
                      <>
                      { key == 0 ?
                        <div className=" w-full pb-6  flex flex-row-reverse">
                          <select name="sort" className="text-base font-open-sans pl-3 py-2.5 border-outlinePressed dark:text-black md:w-[283px]" onChange={handleSortCollections}>
                            <option value="" disabled selected hidden>{t("Explore.sortBy")}</option>
                            <option value="TimeDesc">{t("Explore.sortTimeRec")}</option>
                            <option value="TimeAsc">{t("Explore.sortTimeOld")}</option>
                            <option value="TitleAsc">{t("Explore.sortTitAz")}</option>
                            <option value="TitleDesc">{t("Explore.sortTitZa")}</option>
                          </select>
                        </div> : ""
                      }
                      <div className="w-full sm:w-[280px] md:w-[350px] lg:w-[477px] xl:w-[397px] 2xl:w-[482px]" key={key}>
                        <a href={"/viewcollection/" + item.collectionID}
                        >
                          <div className="flex flex-row justify-items-center w-full" key={key}>

                            <div className="rounded-xl shadow-lg bg-white hover:scale-105 w-full ">
                              <div className="  overflow-hidden rounded-t-xl  bg-white ">

                                <img className="  h-[190px] object-cover object-center scale-150 w-full lg:h-[306px] " alt={item.description} src={`https://nativonft.mypinata.cloud/ipfs/${item.mediaBanner}`} />

                              </div>
                              <div className="flex flex-row  mb-4" name="card_detail">
                                <div className=" z-10 -mt-4 lg:-mt-8 ml-4        ">
                                  <img className="  object-cover  rounded-md bg-white  border-2 border-white w-[90px] h-[90px] lg:w-[120px] lg:h-[120px] " src={`https://nativonft.mypinata.cloud/ipfs/${item.mediaIcon}`} alt={item.description} />
                                </div>

                                <div class="flex flex-col  mx-2 mt-2  ">
                                  <p className="   w-[210px]  sm:w-[150px] md:w-[230px] lg:w-[305px] xl:w-[220px] 2xl:w-[280px] uppercase tracking-tighter text-black text-base font-open-sans font-extrabold collection-description h-[50px] justify-center items-center">{item.title}</p>
                                  <p className="   w-[210px]  sm:w-[150px] md:w-[230px] lg:w-[305px] xl:w-[220px] 2xl:w-[280px] uppercase tracking-tighter text-xs text-left font-bold justify-center font-open-sans leading-4 text-black truncate">{t("Landing.popular_col-by") + " " + item.owner_id}</p>
                                  <div className="   w-[210px]  sm:w-[150px] md:w-[230px] lg:w-[305px] xl:w-[220px] 2xl:w-[280px]   text-xs  text-black text-left justify-center font-normal font-open-sans truncate"><p className="w-full   text-xs text-black font-open-sans font-normal tracking-wide leading-4  text-left justify-center truncate uppercase"><b>{item.tokenCount > 999 ? "+" + item.tokenCount + "k " : item.tokenCount + " "}</b> {t("Landing.popular_col-tokens_on")}</p></div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </a>
                      </div>
                      </>);
                  } else {
                    if(collections.items.length > 0){                       
                      return (<>{ key == 0 ?
                      <div className=" w-full pb-6  flex flex-row-reverse">
                        <select name="sort" className="text-base font-open-sans pl-3 py-2.5 border-outlinePressed dark:text-black md:w-[283px]" onChange={handleSortCollections}>
                          <option value="" disabled selected hidden>{t("Explore.sortBy")}</option>
                          <option value="TimeDesc">{t("Explore.sortTimeRec")}</option>
                          <option value="TimeAsc">{t("Explore.sortTimeOld")}</option>
                          <option value="TitleAsc">{t("Explore.sortTitAz")}</option>
                          <option value="TitleDesc">{t("Explore.sortTitZa")}</option>
                        </select>
                      </div> : ""
                     }</>)
                  }
                }

              }})}
            </div>
          </InfiniteScroll>
          </li>
          </>
          :
          <div className="md:container px-5  flex  justify-left h-96 items-center text-3xl ">
            <div className="flex flex-col justify-center w-full">
            {hasDataCol ?
                <h1 className="text-center font-clash-grotesk font-semibold w-full text-xl text-black">{t("MyNFTs.load-1")}</h1>
                : <>
                  {!myProfile ?
                    <div className="w-full flex justify-center">
                      <h1 className="text-center font-clash-grotesk font-semibold w-full text-xl text-black m-auto">{t("MyNFTs.publicProfileNotCollections")}</h1>
                    </div>
                     :
                    <div className="h-[390px] w-[210px] xl:w-[250px]  mt-10 m-auto md:mx-0" >
                     <a
                        href={"/collection/create"}
                      >
                        <div className="flex flex-row justify-center " >
                          <div className="trending-token w-full h-full rounded-xl shadow-lg   hover:scale-105 ">
                            <div className=" bg-white rounded-xl">
                              <div className="pb-3 object-cover object-center rounded-t-xl w-full h-[250px]  bg-[#F79336] flex">
                                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 80 80" fill="none" className="m-auto">
                                  <path d="M37.3 60H43.3V43.4H60V37.4H43.3V20H37.3V37.4H20V43.4H37.3V60ZM40 80C34.5333 80 29.3667 78.95 24.5 76.85C19.6333 74.75 15.3833 71.8833 11.75 68.25C8.11667 64.6167 5.25 60.3667 3.15 55.5C1.05 50.6333 0 45.4333 0 39.9C0 34.4333 1.05 29.2667 3.15 24.4C5.25 19.5333 8.11667 15.3 11.75 11.7C15.3833 8.1 19.6333 5.25 24.5 3.15C29.3667 1.05 34.5667 0 40.1 0C45.5667 0 50.7333 1.05 55.6 3.15C60.4667 5.25 64.7 8.1 68.3 11.7C71.9 15.3 74.75 19.5333 76.85 24.4C78.95 29.2667 80 34.4667 80 40C80 45.4667 78.95 50.6333 76.85 55.5C74.75 60.3667 71.9 64.6167 68.3 68.25C64.7 71.8833 60.4667 74.75 55.6 76.85C50.7333 78.95 45.5333 80 40 80ZM40.1 74C49.5 74 57.5 70.6833 64.1 64.05C70.7 57.4167 74 49.3667 74 39.9C74 30.5 70.7 22.5 64.1 15.9C57.5 9.3 49.4667 6 40 6C30.6 6 22.5833 9.3 15.95 15.9C9.31667 22.5 6 30.5333 6 40C6 49.4 9.31667 57.4167 15.95 64.05C22.5833 70.6833 30.6333 74 40.1 74Z" fill="#FDFCFD" />
                                </svg>
                              </div>
                              <div className="px-3 py-5">
                                <p className=" text-[#A4A2A4] text-base leading-6 text-ellipsis overflow-hidden whitespace-nowrap font-open-sans font-semibold uppercase text-center">{t("MyNFTs.addNewCol")}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </a>
                    </div>
                  }
                </>}
            </div>
          </div>}

      </ul>

    </>
    
  );
  
}


export default MyCollections;
