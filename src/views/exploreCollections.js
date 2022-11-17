import React from "react";
import { providers, utils } from "near-api-js";
import InfiniteScroll from "react-infinite-scroll-component";
import { useWalletSelector } from "../utils/walletSelector";
import { fromYoctoToNear } from "../utils/near_interaction";
import { useTranslation } from "react-i18next";
import { ApolloClient, InMemoryCache, gql } from '@apollo/client'
import nearImage from '../assets/img/landing/trendingSection/Vector.png';
import filterLogo from "../assets/img/explore/filter.png"
import arrow from "../assets/img/explore/arrow-right.png"
import search from "../assets/img/explore/youtube_searched_for.png"

function Explore() {
    const { selector, modal, accounts, accountId } = useWalletSelector();
    const [t, i18n] = useTranslation("global")
    const [Landing, setLanding] = React.useState({
        tokensPerPageNear: 14,
    });
    let [tokens, setTokens] = React.useState({
        items: [],
        hasMore: true
    })
    let [collections, setCollections] = React.useState({
        items: [],
        hasMore: true
    });
    const [index, setIndex] = React.useState(0)
    const [lastID, setLastID] = React.useState(-1);
    const [lastName, setLastName] = React.useState('')
    const [hasData, setHasData] = React.useState(false)
    const [colSortOrd, setColSortOrd] = React.useState('desc')
    const [colSort, setColSort] = React.useState('collectionID')
    const [trigger, setTrigger] = React.useState(true)

    const APIURL = process.env.REACT_APP_API_TG

    function delay(n) {
        return new Promise(function (resolve) {
            setTimeout(resolve, n * 1000);
        });
    }

    React.useEffect(() => {
        async function getColData() {
            const queryData = `
            query($first: Int){
                collections(first: $first,  orderBy: ${colSort}, orderDirection: ${colSortOrd}, where:{visibility:true, tokenCount_gt:0}){
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
                        first: Landing.tokensPerPageNear,
                    },
                })
                .then((data) => {
                    console.log(data.data.collections)
                    setCollections({
                        ...collections,
                        items: collections.items.concat(data.data.collections)
                    });
                    if (data.data.collections.length <= 0) {
                        setHasData(false)
                    }
                    setLastID(parseInt(data.data.collections[data.data.collections.length - 1].collectionID))
                    setLastName(data.data.collections[data.data.collections.length - 1].title)
                    setHasData(true)
                })
                .catch((err) => {
                    console.log('Error ferching data: ', err)
                    setHasData(false)
                })
        }
        getColData()
    }, [trigger])

    let fetchMoreData = async () => {
        await delay(.75)
        var sort
        var last
        if (colSortOrd == 'asc') {
            sort = 'gt'
        }
        else if (colSortOrd == 'desc') {
            sort = 'lt'
        }
        if(colSort == 'collectionID'){
            last = lastID
        }
        else if(colSort == 'title'){
            last = lastName
        }
        let colData;
        const queryData = `
              query($first: Int, $lastTokenID: String){
                  collections(first: $first,  orderBy: ${colSort}, orderDirection: ${colSortOrd}, where: { ${colSort}_${sort}: $lastTokenID, visibility:true, tokenCount_gt:0}){
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
                    first: Landing.tokensPerPageNear,
                    lastTokenID: last
                },
            })
            .then((data) => {
                console.log(data.data.collections)
                setCollections({
                    ...collections,
                    items: collections.items.concat(data.data.collections)
                });
                setLastID(parseInt(data.data.collections[data.data.collections.length - 1].collectionID))
                setLastName(data.data.collections[data.data.collections.length - 1].title)
                if (data.data.collections.length < Landing.tokensPerPageNear) {
                    setCollections({ ...collections, hasMore: false , items: collections.items.concat(data.data.collections)});
                    setLastID(parseInt(data.data.collections[data.data.collections.length - 1].collectionID))
                    setLastName(data.data.collections[data.data.collections.length - 1].title)
                    return;
                }
            })
            .catch((err) => {
                colData = 0
            })
    }

    let handleSortCollections = (data) => {
        if ('TimeDesc' == data.target.value) {
            if (colSortOrd == 'desc' && colSort =='collectionID') {
                return;
            }
            console.log('entro time desc')
            setColSortOrd('desc')
            setColSort('collectionID')
            setCollections({
                ...collections,
                items: []
            });
        }
        else if ('TimeAsc' == data.target.value) {
            if (colSortOrd == 'asc' && colSort =='collectionID') {
                return;
            }
            console.log('entro time asc')
            setColSortOrd('asc')
            setColSort('collectionID')
            setCollections({
                ...collections,
                items: []
            });
        }
        else if ('TitleAsc' == data.target.value) {
            if (colSortOrd == 'asc' && colSort =='title') {
                return;
            }
            console.log('entro title asc')
            setColSortOrd('asc')
            setColSort('title')
            setCollections({
                ...collections,
                items: []
            });
        }
        else if ('TitleDesc' == data.target.value) {
            if (colSortOrd == 'desc' && colSort =='title') {
                return;
            }
            console.log('entro title desc')
            setColSortOrd('asc')
            setColSort('title')
            setCollections({
                ...collections,
                items: []
            });
        }
        setTrigger(!trigger)
    }

    return (
        <div className="pb-4">
            <button className="pt-6 font-open-sans dark:text-grey3 text-xl px-6 flex flex-row py-3"><img src={arrow} alt="flecha" width={24} height={24} /> <p className="pl-2.5">Atras</p></button>
            <h1 className="dark:text-black text-left px-6 pt-[5px] pb-8 w-full text-3xl font-clash-grotesk font-semibold leading-9">Explora todas las Colecciones</h1>
            <div className="px-6 lg:px-[46px] w-full pb-6 flex flex-row-reverse">
                <select name="sort" className="text-base font-open-sans pl-3 py-2.5 border-outlinePressed dark:text-black md:w-[283px]" onChange={handleSortCollections}>
                    <option value="" disabled selected hidden>Sort by</option>
                    <option value="TimeAsc">Time  (old to recent)</option>
                    <option value="TimeDesc">Time  (recent to old)</option>
                    <option value="TitleAsc">Title  (A-Z)</option>
                    <option value="TitleDesc">Title  (Z-A)</option>
                </select>
            </div>
            {hasData ?
                <div>
                    <InfiniteScroll
                        dataLength={collections.items.length}
                        next={fetchMoreData}
                        hasMore={collections.hasMore}
                        loader={<h1 className="text-center w-full py-10 text-xl font-bold text-yellow2">{t("tokCollection.loading")}</h1>}
                        endMessage={
                            <p className="text-center w-full py-10 text-xl text-yellow2">
                                <b>{t("tokCollection.end")}</b>
                            </p>
                        }
                        className={"flex flex-wrap px-6 lg:px-[46px] gap-4 lg:gap-[19px] md:justify-center"}
                    >
                        {collections.items.map((item, key) => {
                            return (
                                <div className="w-full md:w-[360px] lg:w-[460px]" key={key}>
                                    <a href={"/collection/" + item.collectionID}
                                    >
                                        <div className="flex flex-row drop-shadow-md justify-items-center w-full " key={key}>

                                            <div className="rounded-md drop-shadow-md   w-full  bg-white hover:scale-105 ">
                                                <div className=" best-seller font-open-sans  font-bold text-xlg ">{t("Landing.popular_col-best-seller")}</div>
                                                <div className="  overflow-hidden rounded-t-md w-full md:w-full  lg:w-full  bg-white   ">

                                                    <img className="  h-[288px] lg:h-[306px] mx-auto  object-cover object-center scale-150	w-full " alt={item.description} src={`https://nativonft.mypinata.cloud/ipfs/${item.mediaBanner}`} />

                                                </div>
                                                <div className="flex flex-row  mb-4   " name="card_detail">
                                                    <div className=" z-10 -mt-8 ml-4        ">
                                                        <img className="  object-cover  rounded-md bg-white  border-2 border-white min-w-[90px] max-w-[90px] min-h-[90px] max-h-[90px]  " src={`https://nativonft.mypinata.cloud/ipfs/${item.mediaIcon}`} alt={item.description} />
                                                    </div>

                                                    <div class="flex flex-col  mx-2 mt-2  ">
                                                        <div className="   w-full uppercase tracking-tighter text-black text-base font-open-sans max-h-[24px] text-ellipsis overflow-hidden font-extrabold collection-description justify-center items-center">{item.title}</div>
                                                        <div className="   w-full uppercase tracking-tighter text-xs text-left font-bold justify-center font-open-sans leading-4 text-black  text-ellipsis overflow-hidden whitespace-pre">{t("Landing.popular_col-by") + " " + item.owner_id}</div>
                                                        <div className="   w-full   text-xs  text-black text-left justify-center font-normal font-open-sans  text-ellipsis overflow-hidden whitespace-nowrap">{item.tokenCount > 999 ? "+" + item.tokenCount + "k " : item.tokenCount + " "} <p className="w-full   text-xs text-black font-open-sans font-normal tracking-wide leading-4  text-left justify-center "> {t("Landing.popular_col-tokens_on")}</p></div>
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
                <div className="w-full flex flex-row px-6 py-40 items-center">
                    <img src={search} alt="Lupa" width={96} height={96} className="w-[96px] h-[96px]" />
                    <div className="flex flex-col pl-4">
                        <h1 className="font-open-sans text-4xl dark:text-black font-bold pb-3">No results</h1>
                        <p className="font-open-sans text-base dark:text-black">We searched far and wide and couldn't find any tokens matching your search</p>
                    </div>
                </div>
            }

        </div>
    );
}

export default Explore;