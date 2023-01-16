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
  fromYoctoToNear,
  fromNearToYocto,
  ext_call,
  getNFTContractsByAccount,
  getNFTByContract
} from "../utils/near_interaction";
import Swal from 'sweetalert2';
import { ApolloClient, InMemoryCache, gql } from '@apollo/client'
import { useTranslation } from "react-i18next";
import InfiniteScroll from 'react-infinite-scroll-component';
import SearchNftsModal from "./searchNftsModal.component";
import { useWalletSelector } from "../utils/walletSelector";
import { providers, utils } from "near-api-js";
import nearImage from '../assets/img/landing/trendingSection/Vector.png';
import { useLocation } from "react-router-dom";

function MyCreations(props) {
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
  const [loadMsgCreations, setLoadMsgCreations] = React.useState(true)
  const [loadMsgCollections, setLoadMsgCollections] = React.useState(true);
  const [collections, setCollections] = React.useState(true)
  const [t, i18n] = useTranslation("global")
  const [nfts, setNfts] = useState({
    nfts: [],
    nftsCreations: [],
    collections: [],
    page: parseInt(window.localStorage.getItem("Mypage")),
    tokensPerPage: 6,
    tokensPerPageNear: 6,

    blockchain: localStorage.getItem("blockchain"),
    currency: currencys[parseInt(localStorage.getItem("blockchain"))],
  }); //state de los token nft
  const [modal, setModal] = useState({
    //state para la ventana modal
    show: false,
  });

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
  let imgs = [];

  const APIURL = process.env.REACT_APP_API_TG;
  const [profile, setProfile] = useState({user:''});
  const location = useLocation();
  const [tokSort, setTokSort] = React.useState(true);
  const [index, setIndex] = React.useState(0);
  const [myProfile, setMyProfile] = useState(false);

  async function makeATransfer(tokenID) {
    setTransferModal({
      ...state,
      show: true,
      title: t("MyNFTs.modalTransTitle"),
      message: t("MyNFTs.modalTransMsg"),
      loading: false,
      disabled: false,
      tokenID: tokenID,
      change: setTransferModal,
      buttonName: 'X',
      tokenId: 'hardcoded'
    })
  }

  async function makeAApproval(tokenID, title, media, creator, description) {
    setApprovalModal({
      ...state,
      show: true,
      title: t("MyNFTs.modalAppTitle"),
      message: t("MyNFTs.modalAppMsg"),
      loading: false,
      disabled: false,
      tokenID: tokenID,
      title: title,
      media: media,
      creator: creator,
      description: description,
      change: setApprovalModal,
      buttonName: 'X',
      tokenId: 'hardcoded'
    })
  }

  async function makeChangePrice(tokenID) {
    setPriceModal({
      ...state,
      show: true,
      title: t("MyNFTs.modalPriTitle"),
      message: t("MyNFTs.modalPriMsg"),
      loading: false,
      disabled: false,
      tokenID: tokenID,
      change: setPriceModal,
      buttonName: 'X',
      tokenId: 'hardcoded'
    })
  }




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

  const fetchMoreDataCreator = async () => {
    await delay(.75)
    setpageCreations(pageCreations + 1);
    if(tokSort){
      let limit = true;
      let indexQuery;
      let lastLimit;



      if (index > nfts.tokensPerPageNear) {
        indexQuery = index - nfts.tokensPerPageNear;
        setIndex(index - nfts.tokensPerPageNear);
      }
      else {
        indexQuery = 0;
        lastLimit = parseInt(index);
        limit = false;
        setIndex(0);
      }

      if (index <= 0) {
        setState({...state, hasMoreCreations: false });
        return;
      }
      let contract = await getNearContract();
    let paramsSupplyForOwner = {
      account_id: profile.user
    };
    // let totalTokensByOwner = await contract.nft_supply_for_creator(paramsSupplyForOwner);
    const supply_payload = btoa(JSON.stringify(paramsSupplyForOwner))
    const { network } = selector.options;
    const provider = new providers.JsonRpcProvider({ url: network.nodeUrl });
    const res = await provider.query({
      request_type: "call_function",
      account_id: process.env.REACT_APP_CONTRACT,
      method_name: "nft_supply_for_creator",
      args_base64: supply_payload,
      finality: "optimistic",
    })
    let totalTokensByOwner = JSON.parse(Buffer.from(res.result).toString())

    if (nfts.nftsCreations.length >= totalTokensByOwner) {
      setState({...state, hasMoreCreations: false });
      return;
    }
    let payload = {
      account_id: profile.user,
      from_index: indexQuery.toString(),
      limit: (limit ? nfts.tokensPerPage : lastLimit),
    };
    // let nftsPerOwnerArr = await contract.nft_tokens_for_creator(payload);
    const nft_payload = btoa(JSON.stringify(payload))
    const res_nft = await provider.query({
      request_type: "call_function",
      account_id: process.env.REACT_APP_CONTRACT,
      method_name: "nft_tokens_for_creator",
      args_base64: nft_payload,
      finality: "optimistic",
    })
    let nftsPerOwnerArr = JSON.parse(Buffer.from(res_nft.result).toString())
    // //convertir los datos al formato esperado por la vista
    let nftsArr = nftsPerOwnerArr.map((tok, i) => {
      let onSale = false
      imgs.push(false);
      let data = Object.entries(tok.approved_account_ids)
      data.map((approval, i) => {
        if (approval.includes(process.env.REACT_APP_CONTRACT_MARKET)) {
          onSale = true
          console.log("Esta a la venta en nativo")
        }
      })
      fetch("https://nativonft.mypinata.cloud/ipfs/" + tok.media).then(request => request.blob()).then(() => {

        imgs[i] = true;
      });

      return {
        tokenID: tok.token_id,
        approval: tok.approved_account_ids,
        onSale: onSale,
        description: tok.metadata.description,
        // onSale: tok.on_sale,// tok.metadata.on_sale,
        // onAuction: tok.on_auction,
        data: JSON.stringify({
          title: tok.metadata.title,//"2sdfeds",// tok.metadata.title,
          image: tok.metadata.media,//"vvvvvvvvvvvvvv",//tok.metadata.media,
          description: tok.metadata.description,
          creator: tok.creator_id
        }),
      };
    });
    let newValue = nfts.nftsCreations.concat(nftsArr.reverse());
    setNfts({...nfts, nftsCreations: newValue });

    } else {
      let contract = await getNearContract();
    let paramsSupplyForOwner = {
      account_id: profile.user
    };
    // let totalTokensByOwner = await contract.nft_supply_for_creator(paramsSupplyForOwner);
    const supply_payload = btoa(JSON.stringify(paramsSupplyForOwner))
    const { network } = selector.options;
    const provider = new providers.JsonRpcProvider({ url: network.nodeUrl });
    const res = await provider.query({
      request_type: "call_function",
      account_id: process.env.REACT_APP_CONTRACT,
      method_name: "nft_supply_for_creator",
      args_base64: supply_payload,
      finality: "optimistic",
    })
    let totalTokensByOwner = JSON.parse(Buffer.from(res.result).toString())
    if (nfts.nftsCreations.length >= totalTokensByOwner) {
      setState({...state, hasMoreCreations: false });
      return;
    }
    let payload = {
      account_id: profile.user,
      from_index: (pageCreations * nfts.tokensPerPage).toString(),
      limit: nfts.tokensPerPage,
    };
    // let nftsPerOwnerArr = await contract.nft_tokens_for_creator(payload);
    const nft_payload = btoa(JSON.stringify(payload))
    const res_nft = await provider.query({
      request_type: "call_function",
      account_id: process.env.REACT_APP_CONTRACT,
      method_name: "nft_tokens_for_creator",
      args_base64: nft_payload,
      finality: "optimistic",
    })
    let nftsPerOwnerArr = JSON.parse(Buffer.from(res_nft.result).toString())
    // //convertir los datos al formato esperado por la vista
    let nftsArr = nftsPerOwnerArr.map((tok, i) => {
      let onSale = false
      imgs.push(false);
      let data = Object.entries(tok.approved_account_ids)
      data.map((approval, i) => {
        if (approval.includes(process.env.REACT_APP_CONTRACT_MARKET)) {
          onSale = true
          console.log("Esta a la venta en nativo")
        }
      })
      fetch("https://nativonft.mypinata.cloud/ipfs/" + tok.media).then(request => request.blob()).then(() => {

        imgs[i] = true;
      });
  
      return {
        tokenID: tok.token_id,
        approval: tok.approved_account_ids,
        onSale: onSale,
        description: tok.metadata.description,
        // onSale: tok.on_sale,// tok.metadata.on_sale,
        // onAuction: tok.on_auction,
        data: JSON.stringify({
          title: tok.metadata.title,//"2sdfeds",// tok.metadata.title,
          image: tok.metadata.media,//"vvvvvvvvvvvvvv",//tok.metadata.media,
          description: tok.metadata.description,
          creator: tok.creator_id
        }),
      };
    });
    let newValue = nfts.nftsCreations.concat(nftsArr);
    setNfts({...nfts, nftsCreations: newValue });

    }

    
  };







  //Hook para el manejo de efectos
  useEffect(() => {
    (async () => {
      window.localStorage.setItem("Mypage", 0);



      if (nfts.blockchain == "0") {
        return
      } else {
        let contract = await getNearContract();
        let account = await getNearAccount();
        const query = new URLSearchParams(location);
        let user = query.get('pathname').split('/')[1] + (process.env.REACT_APP_NEAR_ENV == 'mainnet' ? '.near' : '.testnet');
        setProfile({ user: user});      
        
        if (user == accountId) {
          setMyProfile(true)
        }
      
        const supply_payload = btoa(JSON.stringify({ account_id: query.get('pathname').split('/')[1]+ (process.env.REACT_APP_NEAR_ENV == 'mainnet' ? '.near' : '.testnet') }))
        const { network } = selector.options;
        const provider = new providers.JsonRpcProvider({ url: network.nodeUrl });

        const res_numNFTCrea = await provider.query({
          request_type: "call_function",
          account_id: process.env.REACT_APP_CONTRACT,
          method_name: "nft_supply_for_creator",
          args_base64: supply_payload,
          finality: "optimistic",
        })
        let numNFTCreations = JSON.parse(Buffer.from(res_numNFTCrea.result).toString())
        setIndex(numNFTCreations)
 

        console.log('numNFTCreations', numNFTCreations)
        if (numNFTCreations == 0) {
          setLoadMsgCreations(false)
        }

        if(tokSort){
        
        let payloadCreations = {
          account_id: query.get('pathname').split('/')[1] + (process.env.REACT_APP_NEAR_ENV == 'mainnet' ? '.near' : '.testnet'),
          from_index: (numNFTCreations < nfts.tokensPerPage ? "0" : (numNFTCreations - nfts.tokensPerPage).toString()),
          limit: nfts.tokensPerPage,
        };
        setIndex(numNFTCreations < nfts.tokensPerPage ? 0 : (numNFTCreations - nfts.tokensPerPage))

        const tokCrea_payload = btoa(JSON.stringify(payloadCreations))
        const res_tokCrea = await provider.query({
          request_type: "call_function",
          account_id: process.env.REACT_APP_CONTRACT,
          method_name: "nft_tokens_for_creator",
          args_base64: tokCrea_payload,
          finality: "optimistic",
        })
        let nftsPerOwnerArrCreations = JSON.parse(Buffer.from(res_tokCrea.result).toString())

        // //convertir los datos al formato esperado por la vista
        let nftsArrCreations = nftsPerOwnerArrCreations.map((tok, i) => {
          console.log(tok)
          let onSale = false
          //console.log("X->",  tok  )
          imgs.push(false);
          let data = Object.entries(tok.approved_account_ids)
          data.map((approval, i) => {
            if (approval.includes(process.env.REACT_APP_CONTRACT_MARKET)) {
              onSale = true
              console.log("Esta a la venta en nativo")
            }
          })
          fetch("https://nativonft.mypinata.cloud/ipfs/" + tok.media).then(request => request.blob()).then(() => {

            imgs[i] = true;
          });
          return {
            tokenID: tok.token_id,
            approval: tok.approved_account_ids,
            onSale: onSale,
            description: tok.metadata.description,
            // onSale: tok.on_sale,// tok.metadata.on_sale,
            // onAuction: tok.on_auction,
            data: JSON.stringify({
              title: tok.metadata.title,//"2sdfeds",// tok.metadata.title,
              image: tok.metadata.media,//"vvvvvvvvvvvvvv",//tok.metadata.media,
              description: tok.metadata.description,
              creator: tok.creator_id
            }),
          };
        });


        setNfts({
          ...nfts,
          nftsCreations: nftsArrCreations.reverse(),
          owner: accountId,
        });
        } else {
          //ARR for Creators 
        
        let payloadCreations = {
          account_id: query.get('pathname').split('/')[1] + (process.env.REACT_APP_NEAR_ENV == 'mainnet' ? '.near' : '.testnet'),
          from_index: "0",
          limit: nfts.tokensPerPage,
        };

        const tokCrea_payload = btoa(JSON.stringify(payloadCreations))
        const res_tokCrea = await provider.query({
          request_type: "call_function",
          account_id: process.env.REACT_APP_CONTRACT,
          method_name: "nft_tokens_for_creator",
          args_base64: tokCrea_payload,
          finality: "optimistic",
        })
        let nftsPerOwnerArrCreations = JSON.parse(Buffer.from(res_tokCrea.result).toString())

        // //convertir los datos al formato esperado por la vista
        let nftsArrCreations = nftsPerOwnerArrCreations.map((tok, i) => {
          console.log(tok)
          let onSale = false
          //console.log("X->",  tok  )
          imgs.push(false);
          let data = Object.entries(tok.approved_account_ids)
          data.map((approval, i) => {
            if (approval.includes(process.env.REACT_APP_CONTRACT_MARKET)) {
              onSale = true
              console.log("Esta a la venta en nativo")
            }
          })
          fetch("https://nativonft.mypinata.cloud/ipfs/" + tok.media).then(request => request.blob()).then(() => {

            imgs[i] = true;
          });
          return {
            tokenID: tok.token_id,
            approval: tok.approved_account_ids,
            onSale: onSale,
            description: tok.metadata.description,
            // onSale: tok.on_sale,// tok.metadata.on_sale,
            // onAuction: tok.on_auction,
            data: JSON.stringify({
              title: tok.metadata.title,//"2sdfeds",// tok.metadata.title,
              image: tok.metadata.media,//"vvvvvvvvvvvvvv",//tok.metadata.media,
              description: tok.metadata.description,
              creator: tok.creator_id
            }),
          };
        });


        setNfts({
          ...nfts,
          nftsCreations: nftsArrCreations,
          owner: accountId,
        });

        }


        


      }


    })();
  }, [tokSort]);
  

  function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
  }

  let handleSortTokens = (data) => {
    if ('oldRecent' == data.target.value) {
      if (!tokSort) {
        return;
      }
      setTokSort(!tokSort)
      setNfts({
        ...nfts,
        nftsCreations: []
      });
      setState({...state, hasMoreCreations : true});
      setpageCreations(1);

      setAllNfts({nftsCreations: allNfts});
    }
    else if ('recentOld') {
      if (tokSort) {
        return;
      }
      setTokSort(!tokSort)
      setNfts({
        ...nfts,
        nftsCreations: []
      });
      setpageCreations(1);
      setState({...state, hasMoreCreations : true});

     
    }
  }


  return (
    <>
      <ul>
      {loadMsgCreations ?
      <>
        
            <li><InfiniteScroll
            dataLength={nfts.nftsCreations.length}
            next={fetchMoreDataCreator}
            hasMore={state.hasMoreCreations}
            loader={<h1 className="text-center font-clash-grotesk font-semibold w-full py-10 text-xl text-black">{t("tokCollection.loading")}</h1>}
            endMessage={
                <p className="text-center font-clash-grotesk font-semibold w-full py-10 text-xl text-black">
                    {t("tokCollection.end")}
                </p>
            }
            className={"flex flex-wrap px-6 gap-6 lg:gap-4 lg:justify-start"}
          >
              {nfts.nftsCreations.map((nft, key) => {


                const itemNft = nft;
                const item = JSON.parse(nft.data);
                return (
                  <>
                    {
                      key == 0 ?
                        <div className=" w-full pb-6  flex flex-row-reverse">
                          <select name="sort" className="text-base font-open-sans pl-3 py-2.5 border-outlinePressed dark:text-black md:w-[283px]" onChange={handleSortTokens}>
                            <option value="" disabled selected hidden>{t("Explore.sortBy")}</option>
                            <option value="recentOld">{t("Explore.sortTimeRec")}</option>
                            <option value="oldRecent">{t("Explore.sortTimeOld")}</option>
                          </select>
                        </div> : ""
                    }
                    <div className="w-full grow md:grow-0 xs:w-[150px] h-[279px] lg:h-[350px] sm:w-[180px] md:w-[160px] lg:w-[232px]  xl:w-[295px] 2xl:w-[284px] xl:h-[395px] 2xl:h-[485px] " key={key}>
                      <a
                        href={"/detail/" + itemNft.tokenID}
                      >
                        <div className="flex flex-row justify-center " >
                          <div className="trending-token w-full h-full rounded-xl shadow-lg   hover:scale-105 ">
                            <div className=" bg-white rounded-xl">
                              <div className="pb-3">
                                <img
                                  className="object-cover object-center rounded-t-xl w-full h-[163px] lg:h-[250px] lg:w-[340px] xl:h-[300px] 2xl:h-[340px]"
                                  src={`https://nativonft.mypinata.cloud/ipfs/${item.image}`}
                                  alt={item.description}
                                />
                              </div>
                              <div className="px-3 py-1">
                                <p className=" text-black text-base leading-6 text-ellipsis overflow-hidden whitespace-nowrap font-open-sans font-extrabold uppercase">{item.title}</p>
                                <a href={`/${item.creator.split('.')[0]}`}><p className="text-black py-3 font-open-sans text-[10px] xl:pb-[23px] font-semibold leading-4 text-ellipsis overflow-hidden whitespace-nowrap uppercase">{t("tokCollection.createdBy") + ":"} {item.creator}</p></a>
                              </div>
                            </div>
                          </div>
                        </div>
                      </a>
                    </div>
                  </>

                );})}
       
          </InfiniteScroll>
          </li>
          </>
          :
          <div className="md:container px-5  flex  justify-left h-96 items-center text-3xl ">
            <div className="flex flex-col justify-center w-full ">
            {loadMsgCreations ?
                <h1 className="text-center font-clash-grotesk font-semibold w-full text-xl text-black">{t("MyNFTs.load-1")}</h1>
                : <>
                  {!myProfile ?
                    <div className="w-full flex justify-center">
                      <h1 className="text-center font-clash-grotesk font-semibold w-full text-xl text-black  m-auto">{t("MyNFTs.publicProfileNotNFT")}</h1>
                    </div> 
                    :
                    <div className=" h-[390px] w-[210px] xl:w-[250px]  mt-10 m-auto md:mx-0" >
                      <a
                        href={"/create"}
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
                                <p className=" text-[#A4A2A4] text-base leading-6 text-ellipsis overflow-hidden whitespace-nowrap font-open-sans font-semibold uppercase text-center">{t("MyNFTs.addNewToken")}</p>
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


export default MyCreations;
