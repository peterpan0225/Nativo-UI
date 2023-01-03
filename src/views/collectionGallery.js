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
import searchImg from "../assets/img/explore/youtube_searched_for.png"
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

  function delay(n) {
    return new Promise(function (resolve) {
      setTimeout(resolve, n * 1000);
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
          setCollections({ ...collections, hasMore: false });
          setLastID(parseInt(data.data.collections[data.data.collections.length - 1].collectionID))
          return;
        }

        if (data.data.collections.length > Landing.tokensPerPage) {
          setCollections({ ...collections, hasMore: true });
          setLastID(parseInt(data.data.collections[data.data.collections.length - 1].collectionID))
        }

        setpage(page + 1)
      })
      .catch((err) => {
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
        const searchWordTG = decodeURIComponent(searchWord)

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
             collectionSearch(text: $first, skip: 0, first: 8) {
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

            setSearch({ skipSearch: 8, hasMore: col.length == 8 ? true : false });

          } else {
            setTotalCol(0);
            setHasData(false);
          }
        }
      }

    })();
  }, [trigger]);

  const _handleKeyUp = async (e) => {
    e.preventDefault();
    setActiveSearch(true)
    let colData;

    let originalSearchWord = search.searchWord;
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
    let searchWord = searchWordJoin.join(' ');




    const queryData2 = `
         query($first: String!) 
            {
              collectionSearch(text: $first, skip: 0, first: 8) {
                id,
                collectionID,
                owner_id,
                title,
                timestamp,
                mediaIcon,
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
        query: gql(queryData2),
        variables: {
          first: searchWord,
        },
      })
      .then((data) => {
        console.log('data', data);
        colData = data.data.collectionSearch;
      })
      .catch((err) => {
        console.log('err', err);
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

    setSearch({ searchWord: originalSearchWord, isSearch: true, skipSearch: 8, hasMore: col.length == 8 ? true : false });


  }

  let fetchMoreSearch = async () => {
    await delay(.75)
    let colData;

    const queryData2 = `
         query($first: String!) 
            {
              collectionSearch(text: $first, skip: ${search.skipSearch}, first: 8) {
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
        query: gql(queryData2),
        variables: {
          first: search.searchWord,
        },
      })
      .then((data) => {
        console.log('data', data);
        colData = data.data.collectionSearch;
      })
      .catch((err) => {
        console.log('err', err);
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
    setSearch({ ...search, skipSearch: search.skipSearch + 8, hasMore: col.length == 8 ? true : false });

    console.log('search', search);

  }


  let _cleanSearch = async () => {
    setSearch({
      isSearch: false,
      skipSearch: 0,
      searchWord: "",
      hasMore: true
    });
    setCollections({
      items: [],
      hasMore: true
    })
    settrigger(!trigger);
  }

  let _handleChange = async (e) => {
    if (e.target.value == '' && activeSearch) {
      setActiveSearch(false)
      _cleanSearch()
    }
    setSearch({ ...search, searchWord: e.target.value })
  }
  return (
    <section>
      <div>
        <div className="flex flex-col lg:flex-row px-6 lg:px-12 bg-inherit lg:bg-grayColor pb-[30px] pt-[51px] lg:py-12">
          {/* Titulos de la Pagina */}
          <p className="dark:text-black text-left w-full text-3xl lg:text-[35px] xl:text-[45px] 2xl:text-[60px] font-clash-grotesk font-semibold leading-9">{t("Explore.searchTit")}</p>
        </div>


        {hasData ?
          <div className="py-6">
            <InfiniteScroll
              dataLength={collections.items.length}
              next={!search.isSearch ? fetchMoreData : fetchMoreSearch}
              hasMore={!search.isSearch ? collections.hasMore : search.hasMore}
              loader={<h1 className="text-center font-clash-grotesk font-semibold w-full py-10 text-xl text-black">{t("tokCollection.loading")}</h1>}
              endMessage={
                <p className="text-center font-clash-grotesk font-semibold w-full py-10 text-xl text-black">
                  {t("Explore.endCol")}
                </p>
              }
              className={"flex flex-wrap px-6 lg:px-[46px] gap-4 lg:gap-[19px] justify-center"}
            >
              {collections.items.map((item, key) => {
                return (
                  <div className="w-full sm:w-[280px] md:w-[350px] lg:w-[455px] xl:w-[380px] 2xl:w-[440px]" key={key}>
                    <a href={"/viewcollection/" + item.collectionID}>
                      <div className="flex flex-row justify-items-center w-full" key={key}>

                        <div className="rounded-xl shadow-lg bg-white hover:scale-105 w-full ">
                          <div className="  overflow-hidden rounded-t-md  bg-white ">
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
                )
              })}
            </InfiniteScroll>
          </div>
          :
          <div className="w-full flex flex-row px-6 py-40 items-center justify-center">
            <img src={searchImg} alt="Lupa" width={96} height={96} className="w-[96px] h-[96px]" />
            <div className="flex flex-col pl-4">
              <h1 className="font-open-sans text-4xl dark:text-black font-bold pb-3">{t("Explore.noResult")}</h1>
              <p className="font-open-sans text-base dark:text-black">{t("Explore.noResCol")}</p>
            </div>
          </div>
        }



      </div>
    </section>
  );
}

export default LightEcommerceA;
