import React from "react";
import { providers, utils } from "near-api-js";
import InfiniteScroll from "react-infinite-scroll-component";
import { useWalletSelector } from "../utils/walletSelector";
import { fromYoctoToNear } from "../utils/near_interaction";
import { ApolloClient, InMemoryCache, gql } from '@apollo/client'
import { useTranslation } from "react-i18next";
import Swal from 'sweetalert2';
import nearImage from '../assets/img/landing/trendingSection/Vector.png';
import filterLogo from "../assets/img/explore/filter.png"
import arrow from "../assets/img/explore/arrow-right.png"
import search from "../assets/img/explore/youtube_searched_for.png"

function Explore() {
    const { selector, modal, accounts, accountId } = useWalletSelector();
    const [t, i18n] = useTranslation("global")
    const [Landing, setLanding] = React.useState({
        tokensPerPageNear: 24,
    });
    let [tokens, setTokens] = React.useState({
        items: [],
        hasMore: true
    })
    let [collections, setCollections] = React.useState({
        items: [],
        hasMore: true
    });
    let [artists, setArtists] = React.useState({
        items: [],
        hasMore: true
    });
    const [index, setIndex] = React.useState(0)
    const [hasData, setHasData] = React.useState(false)
    const [tokSort, setTokSort] = React.useState(true)
    const [lastID, setLastID] = React.useState(-1);
    const [lastName, setLastName] = React.useState('')
    const [hasDataCol, setHasDataCol] = React.useState(false)
    const [colSortOrd, setColSortOrd] = React.useState('desc')
    const [colSort, setColSort] = React.useState('collectionID')
    const [triggerCol, setTriggerCol] = React.useState(true)
    const [lastUsername, setLastUsername] = React.useState("");
    const [lastTimestamp, setLastTimestamp] = React.useState();
    const [hasDataArt, setHasDataArt] = React.useState(false)
    const [artSortOrd, setArtSortOrd] = React.useState('desc')
    const [artSort, setArtSort] = React.useState('timestamp')
    const [artCount, setArtCount] = React.useState(true)
    const [counter, setCounter] = React.useState()
    const [trigger, setTrigger] = React.useState(true)
    const [tokData, setTokData] = React.useState(true)
    const [colData, setColData] = React.useState(false)
    const [artData, setArtData] = React.useState(false)

    const APIURL = process.env.REACT_APP_API_TG

    const data = window.location.search;
    const urlParams = new URLSearchParams(data);

    function delay(n) {
        return new Promise(function (resolve) {
            setTimeout(resolve, n * 1000);
        });
    }

    let fetchMoreColData = async () => {
        console.log('carga data colecciones')
        await delay(.75)
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
                if (data.data.collections.length <= 0) {
                    setCollections({ ...collections, hasMore: false })
                    return
                }
                if (data.data.collections.length < Landing.tokensPerPageNear) {
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

    // let handleData = (data) => {
    //     data = data.target.value
    //     if ((data == 'tok' || data == 'col' || data == 'art')) {
    //         if (data == 'tok') {
    //             console.log('carga tok')
    //             setTokData(true)
    //             setColData(false)
    //             setArtData(false)
    //         }
    //         else if (data == 'col') {
    //             console.log('carga col')
    //             setTokData(false)
    //             setColData(true)
    //             setArtData(false)
    //         }
    //         else if (data == 'art') {
    //             console.log('carga art')
    //             setTokData(false)
    //             setColData(false)
    //             setArtData(true)
    //         }
    //     }
    // }

    // React.useEffect(() => {
    //     if (urlParams.get('search') == 'tokens') {
    //         setTokData(true)
    //         setColData(false)
    //         setArtData(false)
    //     }
    //     else if (urlParams.get('search') == 'collections') {
    //         setTokData(false)
    //         setColData(true)
    //         setArtData(false)
    //     }
    //     else if (urlParams.get('search') == 'artists') {
    //         setTokData(false)
    //         setColData(false)
    //         setArtData(true)
    //     }
    // }, [])

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
                    setCollections({
                        ...collections,
                        items: collections.items.concat(data.data.collections)
                    });
                    if (data.data.collections.length <= 0) {
                        setHasDataCol(false)
                    }
                    setLastID(parseInt(data.data.collections[data.data.collections.length - 1].collectionID))
                    setLastName(data.data.collections[data.data.collections.length - 1].title)
                    setHasDataCol(true)
                })
                .catch((err) => {
                    console.log('Error ferching data: ', err)
                    setHasDataCol(false)
                })
        }
        getColData()
    }, [triggerCol])

    return (
        <>
            {/* <button className="pt-6 font-open-sans dark:text-grey3 text-xl px-6 lg:px-12 flex flex-row py-3"><img src={arrow} alt="flecha" width={24} height={24} /> <p className="pl-2.5">Atras</p></button> */}
            <div className="flex flex-col lg:flex-row px-6 lg:px-12 bg-inherit lg:bg-grayColor pb-[30px] pt-[51px] lg:py-12">
                {/* Titulos de la Pagina */}
                <p className="dark:text-black text-left w-full text-3xl lg:text-[35px] xl:text-[45px] 2xl:text-[60px] font-clash-grotesk font-semibold leading-9">{t("Explore.searchTit")}</p>
            </div>

            <div className="px-6 lg:px-12 w-full pb-6 lg:py-12 flex flex-row-reverse">
                <select name="sort" className="text-base font-open-sans pl-3 py-2.5 border-outlinePressed dark:text-black md:w-[283px]" onChange={handleSortCollections}>
                    <option value="" disabled selected hidden>{t("Explore.sortBy")}</option>
                    <option value="TimeDesc">{t("Explore.sortTimeRec")}</option>
                    <option value="TimeAsc">{t("Explore.sortTimeOld")}</option>
                    <option value="TitleAsc">{t("Explore.sortTitAz")}</option>
                    <option value="TitleDesc">{t("Explore.sortTitZa")}</option>
                </select>
            </div>
            {hasDataCol ?
                <div className="mb-8">
                    <InfiniteScroll
                        dataLength={collections.items.length}
                        next={fetchMoreColData}
                        hasMore={collections.hasMore}
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
                                    <a href={"/viewcollection/" + item.collectionID}
                                    >
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
                    <img src={search} alt="Lupa" width={96} height={96} className="w-[96px] h-[96px]" />
                    <div className="flex flex-col pl-4">
                        <h1 className="font-open-sans text-4xl dark:text-black font-bold pb-3">{t("Explore.noResult")}</h1>
                        <p className="font-open-sans text-base dark:text-black">{t("Explore.noResCol")}</p>
                    </div>
                </div>
            }
        </>
    );
}

export default Explore;