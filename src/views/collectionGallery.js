import React from "react";

import { currencys } from "../utils/constraint";
import { getNearContract, fromYoctoToNear, getNearAccount } from "../utils/near_interaction";
import { useParams, useHistory } from "react-router-dom";


import filtroimg from '../assets/landingSlider/img/filtro.png'
import loading from '../assets/landingSlider/img/loader.gif'
import Pagination from '@mui/material/Pagination';
import { Account } from "near-api-js";
import { ApolloClient, InMemoryCache, gql } from '@apollo/client'
import { useTranslation } from "react-i18next";

import InfiniteScroll from "react-infinite-scroll-component";
import verifyImage from '../assets/img/Check.png';
import { Fab } from "@mui/material";
import { useLocation } from "react-router-dom";


function LightEcommerceA() {
  const [Landing, setLanding] = React.useState({
    theme: "yellow",
    currency: currencys[parseInt(localStorage.getItem("blockchain"))],
    tokens: [],
    page: parseInt(window.localStorage.getItem("page")),
    pag: window.localStorage.getItem("pagSale"),
    blockchain: localStorage.getItem("blockchain"),
    tokensPerPage: 20,
    tokensPerPageNear: 20,
  });
  const [t, i18n] = useTranslation("global")
  const [esconder, setesconder] = React.useState(true);
  const [counter, setcounter] = React.useState();
  const [load, setload] = React.useState(true);
  const [pagsale, setpagsale] = React.useState(0);
  const [hasData, setHasData] = React.useState(true);
  const [pageCreations, setpageCreations] = React.useState(1);
  const [pagCount, setpagCount] = React.useState("");
  const [chunksale, setchunksale] = React.useState(0);
  const [totalCol, setTotalCol] = React.useState(0);
  const [page, setpage] = React.useState(1);
  const [ini, setini] = React.useState(true);
  const [firstID, setFirstID] = React.useState(-1);
  const [lastID, setLastID] = React.useState(-1);
  const [statePage, setStatePage] = React.useState(true)
  const [firstLoad, setFirstLoad] = React.useState(true)
  const [loadMsg, setLoadMsg] = React.useState(true)
  const [trigger, settrigger] = React.useState(true);
  const [search, setSearch] = React.useState({
    isSearch: false,
    skipSearch: 0,
    searchWord: "",
    hasMore: true
  });
  const [activeSearch, setActiveSearch] = React.useState(false)
  const [skipSearch, setSkipSearch] = React.useState(0);
  const [filtro, setfiltro] = React.useState({
    culture: "null",
    country: "null",
    type: "null",
    date: "null",
    price: "null",
  });
  let [collections, setCollections] = React.useState({
    items: [],
    hasMore: true
  });
  
  const APIURL = process.env.REACT_APP_API_TG;
  const location = useLocation();
  const handleChangePage = (e, value) => {
    // console.log(value)
    setpage(value)
    window.scroll(0, 0)
    settrigger(!trigger)
  }

  const handleBackPage = () => {
    console.log("Back")
    window.scroll(0, 0)
    setStatePage(false)
    settrigger(!trigger)
  }

  const handleForwardPage = () => {
    console.log("Forward")
    window.scroll(0, 0)
    setStatePage(true)
    settrigger(!trigger)
  }

  const modificarFiltro = (v) => {
    setfiltro(c => ({ ...c, ...v }))
  }

  function delay(n){
    return new Promise(function(resolve){
        setTimeout(resolve,n*1000);
    });
  }

  let fetchMoreData = async () => {
    await delay(.75)
    setpageCreations(pageCreations + 1);
    //instanciar contracto
    let contract = await getNearContract();
    let account = await getNearAccount();
    let colData;
    const queryData = `
          query($first: Int, $lastTokenID: Int){
              collections(first: $first,  orderBy: collectionID, orderDirection: desc, where: { collectionID_lt: $lastTokenID, visibility:true, tokenCount_gt:0}){
                id
                collectionID
                owner_id
                title
                timestamp
                mediaIcon
                mediaBanner,
                description,
                tokenCount
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
          first: Landing.tokensPerPage,
          lastTokenID: lastID
        },
      })
      .then((data) => {
        colData = data.data.collections;
        if (data.data.collections.length <= Landing.tokensPerPage) {
          setCollections({...collections, hasMore: false });
          setLastID(parseInt(data.data.collections[data.data.collections.length - 1].collectionID))
          return;
        }

        if (data.data.collections.length > Landing.tokensPerPage) {
          setCollections({...collections, hasMore: true });
           setLastID(parseInt(data.data.collections[data.data.collections.length - 1].collectionID))
        }
       
        setpage(page + 1)
      })
      .catch((err) => {
        colData = 0
      })


      if(colData != 0 ) {
        let col = colData.map((collection) => {
          return {
            title: collection.title,
            owner: collection.owner_id,
            tokenCount: collection.tokenCount,
            description: collection.description,
            mediaIcon: collection.mediaIcon,
            mediaBanner: collection.mediaBanner,
            collectionID: collection.collectionID
          };
        });
    
        await setLanding({
          ...Landing,
          tokens: col,
          nPages: 0,
        });
        setCollections({
          ...collections,
          items: collections.items.concat(col)
        });
      }
      

  }
  var colData;
  const { tokenid: owner } = useParams();
  React.useEffect(() => {
    // console.log("esto ---> ",owner);

    setload(c => true);
    (async () => {
      let toks, onSaleToks;
      let arr = [];

      if (Landing.blockchain == "0") {
        return
      } else {
        window.contr = await getNearContract();

        //instanciar contracto
        let contract = await getNearContract();
        let account = await getNearAccount();

        const query = new URLSearchParams(location.search);
        const searchWord = query.get('search');
        const searchWordTG  = decodeURIComponent(searchWord)

        if (searchWord === 'all') {
          const queryData = `
          query($first: Int){
          collections(first: $first,  orderBy: collectionID, orderDirection: desc, where:{visibility:true, tokenCount_gt:0}){
          id
          collectionID
          owner_id
          title
          timestamp
          mediaIcon
          mediaBanner,
          description,
          tokenCount
      }
      profiles (where : {id : $account}){
        id
        media
        biography
        socialMedia
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
                first: Landing.tokensPerPage,
              },
            })
            .then((data) => {
              //console.log("tokens data: ", data.data.tokens)
              colData = data.data.collections
              console.log(data.data.collections)
              if (data.data.collections.length <= 0) {
                setLoadMsg(false)
              }
              setFirstID(parseInt(data.data.collections[0].collectionID))
              setLastID(parseInt(data.data.collections[data.data.collections.length - 1].collectionID))
              setpage(page + 1)
              // colData = data.data.collections[0]
            })
            .catch((err) => {
              //console.log('Error ferching data: ', err)
              colData = 0
            })

          if (colData != 0) {


            let col = colData.map((collection) => {
              return {
                title: collection.title,
                owner: collection.owner_id,
                tokenCount: collection.tokenCount,
                description: collection.description,
                mediaIcon: collection.mediaIcon,
                mediaBanner: collection.mediaBanner,
                collectionID: collection.collectionID
              };
            });

            await setLanding({
              ...Landing,
              tokens: col,
              nPages: 0,
            });
            setCollections({
              ...collections,
              items: collections.items.concat(col)
            });

          } else {
            setTotalCol(0);
            setHasData(true);
          }

        } else {
          let originalSearchWord = searchWordTG;
          let replacedString = originalSearchWord.replace(/['"]+/g, '');
          let searchWordMap = replacedString.split(' ');
          let filterWords = searchWordMap.filter((word) => word !== "");
          let searchWordJoin = filterWords.map((word, i, arr) => {

            if (i + 1 === arr.length) {
              return word;
            } else {
              return word + " & ";
            }
          })
          let searchWordParsed = searchWordJoin.join(' ');
          const queryData2 = `  
          query($first: String!) 
           {
             collectionSearch(text: $first, skip: 0, first: 3) {
               id
               title
               description
               owner_id
               tokenCount
               mediaBanner
               mediaIcon
               collectionID
               timestamp

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
              query: gql(queryData2),
              variables: {
                first: searchWordParsed,
              },
            })
            .then((data) => {
              console.log('data', data);
              colData = data.data.collectionSearch;
            })
            .catch((err) => {
              console.log('err', err);
            })

          if (colData != 0) {
            let col = colData.map((collection) => {
              return {
                title: collection.title,
                owner: collection.owner_id,
                tokenCount: collection.tokenCount,
                description: collection.description,
                mediaIcon: collection.mediaIcon,
                mediaBanner: collection.mediaBanner,
                collectionID: collection.collectionID
              };
            });

            await setLanding({
              ...Landing,
              tokens: col,
              nPages: 0,
            });
            setCollections({
              ...collections,
              items: collections.items.concat(col)
            });

            setSearch({skipSearch : 3, hasMore: col.length == 3 ? true : false});

          } else {
            setTotalCol(0);
            setHasData(false);
          }
        }
      }

    })();
  }, [trigger]);

  const _handleKeyUp = async(e) => {
    e.preventDefault();
    setActiveSearch(true)
    let colData;

    let originalSearchWord = search.searchWord;
    let replacedString = originalSearchWord.replace(/['"]+/g,'');
    let searchWordMap = replacedString.split(' ');
    let filterWords =  searchWordMap.filter((word) => word !== "");
    let searchWordJoin = filterWords.map((word, i, arr) => {
 
      if (i + 1 === arr.length) {
        return word;
      } else {
        return word + " & ";
      }
    })
    let searchWord = searchWordJoin.join(' ');
  


    
      const queryData2 = `
         query($first: String!) 
            {
              collectionSearch(text: $first, skip: 0, first: 3) {
                id
                title
                description
                owner_id
                tokenCount
                mediaBanner
                mediaIcon
                collectionID
                timestamp

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
      query: gql(queryData2),
      variables: {
        first: searchWord,
      },
    })
      .then((data) => {
        console.log('data',data);
        colData = data.data.collectionSearch;
      })
      .catch((err) => {
        console.log('err',err);
      })

      let col = colData.map((collection) => {
        return {
          title: collection.title,
          owner: collection.owner_id,
          tokenCount: collection.tokenCount,
          description: collection.description,
          mediaIcon: collection.mediaIcon,
          mediaBanner: collection.mediaBanner,
          collectionID: collection.collectionID
        };
      });

      setCollections({
        ...collections,
        items: col
      });

      setSearch({searchWord: originalSearchWord, isSearch: true, skipSearch : 3, hasMore: col.length == 3 ? true : false});

     
  }

  let fetchMoreSearch = async() => {
    await delay(.75)
    let colData;
    
      const queryData2 = `
         query($first: String!) 
            {
              collectionSearch(text: $first, skip: ${search.skipSearch}, first: 3) {
                id
                title
                description
                owner_id
                tokenCount
                mediaBanner
                mediaIcon
                collectionID
                timestamp
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
      query: gql(queryData2),
      variables: {
        first: search.searchWord,
      },
    })
      .then((data) => {
        console.log('data',data);
        colData = data.data.collectionSearch;
      })
      .catch((err) => {
        console.log('err',err);
      })

      let col = colData.map((collection) => {
        return {
          title: collection.title,
          owner: collection.owner_id,
          tokenCount: collection.tokenCount,
          description: collection.description,
          mediaIcon: collection.mediaIcon,
          mediaBanner: collection.mediaBanner,
          collectionID: collection.collectionID
        };
      });

      setCollections({
        ...collections,
        items: collections.items.concat(col)
      });

      console.log('collection', col.length);
      setSearch({...search, skipSearch : search.skipSearch + 3, hasMore: col.length == 3 ? true : false});

      console.log('search', search);
      
  }


  let _cleanSearch = async() => {
  setSearch({isSearch: false,
    skipSearch: 0,
    searchWord: "",
    hasMore: true});
    setCollections({items: [],
      hasMore: true})
   settrigger(!trigger);
  }

  let _handleChange = async(e)=>{
    if(e.target.value=='' && activeSearch){ 
      setActiveSearch(false)
      _cleanSearch()
    }
    setSearch({...search, searchWord: e.target.value})
  }
return (
  <section className={"text-gray-600 body-font " + (ini && hasData ? "" : "dark:bg-darkgray")}>
    <div className={"pt-3 mx-auto dark:bg-darkgray "}>
      <div className="lg:w-full  h-[30px] flex my-8 justify-center">
        <h1 className="text-3xl lg:text-6xl font-black dark:text-white bg-darkgray m-0 px-6 font-raleway uppercase self-center">
          {t("Collections.title")}
        </h1>
      </div>

    
      {hasData ?
        <div>
          <InfiniteScroll
            dataLength={collections.items.length}
            next={!search.isSearch ? fetchMoreData : fetchMoreSearch}
            hasMore={!search.isSearch ? collections.hasMore : search.hasMore}
            loader={<h1 className="text-center w-full py-10 text-xl font-bold text-yellow2">{t("tokCollection.loading")}</h1>}
            endMessage={
              <p className="text-center w-full py-10 text-xl text-yellow2">
                <b>{t("Collections.end")}</b>
              </p>
            }
            className={"flex flex-wrap px-[20px]"}
          >
            {collections.items.map((i, index) => {
              return (
                <div className="w-full md:w-1/2 lg:w-1/3 xl:w-1/4 md:p-4" key={index}>
                  <a
                    href={"viewcollection/" + i.collectionID}
                  >
                    <div className="flex flex-row  mb-5 md:mb-0 justify-center " >
                      <div className="trending-token w-full rounded-20 hover:shadow-yellow1   hover:scale-105 ">
                        <div className=" bg-white rounded-20 pb-4 ">
                          <div className="">
                            <img
                              className="object-cover object-center rounded-t-xlarge h-[12rem] md:h-48  w-full bg-center"
                              src={`https://nativonft.mypinata.cloud/ipfs/${i.mediaBanner}`}
                              alt={i.description}
                            />
                          </div>

                          <div className="w-[125px] h-[125px]  bg-circle bg-center rounded-full border-4 border-white relative bg-cover mx-auto -mt-[100px]" style={{ backgroundImage: `url(https://nativonft.mypinata.cloud/ipfs/${i.mediaIcon})` }} >
                          </div>
                          <div className=" px-4">

                            <div className="capitalize text-black text-base text-ellipsis overflow-hidden whitespace-nowrap  font-raleway font-bold text-center">{i.title}</div>

                            <div className="flex justify-center pt-2">
                              {/* <div className="text-black text-sm font-raleway font-normal   "><span className="font-bold">Tokens:</span> {i.tokenCount}</div> */}



                            </div>
                          </div>
                          <div className=" px-6 font-raleway text-xs text-right mx-auto justify-center text-ellipsis overflow-hidden">{t("tokCollection.createdBy")} <a href={`profile/${i.owner.split('.')[0]}`} className="font-raleway text-xs font-bold text-blue2 text-ellipsis overflow-hidden">{i.owner}</a></div>
                        </div>
                      </div>
                    </div>
                  </a>
                </div>
              )
            })}
          </InfiniteScroll>
        </div>
        :
        <div className=" mx-auto flex   md:flex-row flex-col text-yellow2 justify-center h-96 items-center text-4xl font-bold">
          <div className="flex flex-col justify-center">
            <h1 className="text-center">{t("Collections.load-2")}</h1>
            <button
                  className={`w-fit mx-auto mt-2 text-white bg-yellow2 border-0 py-2 px-6 focus:outline-none  rounded-md font-open-sans font-extrabold text-lg md:flex`}
                  onClick={() =>{window.location = "collections?search=all"}}>

                  {t("Navbar.search-all")}
                </button>
          </div>
        </div>
      }



    </div>
  </section>
);
    }

export default LightEcommerceA;
