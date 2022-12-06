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

    async function futureFeatureMsg(section) {
        Swal.fire({
            background: '#0a0a0a',
            width: '800',
            html:
                '<div class="">' +
                '<div class="font-open-sans  text-base font-extrabold text-white mb-4 text-left uppercase">' + t("Navbar.comming") + '</div>' +
                '<div class="font-open-sans  text-sm text-white text-left">' + t("Navbar.commingSubtitle") + '</div>' +
                '</div>',
            showCloseButton: true,
            showCancelButton: false,
            showConfirmButton: false,

            position: window.innerWidth < 640 ? 'bottom' : 'center'
        });
    }

    let handleSortTokens = (data) => {
        if ('oldRecent' == data.target.value) {
            if (!tokSort) {
                return;
            }
            setTokSort(!tokSort)
            setTokens({
                ...tokens,
                items: []
            });
        }
        else if ('recentOld') {
            if (tokSort) {
                return;
            }
            setTokSort(!tokSort)
            setTokens({
                ...tokens,
                items: []
            });
        }
    }

    let fetchMoreData = async () => {
        await delay(.5)
        const { network } = selector.options;
        const provider = new providers.JsonRpcProvider({ url: network.nodeUrl });
        if (tokSort) {
            let limit = true
            let indexQuery
            let lastLimit
            if (index > Landing.tokensPerPageNear) {
                indexQuery = index - Landing.tokensPerPageNear
                setIndex(index - Landing.tokensPerPageNear)
            }
            else {
                indexQuery = 0
                lastLimit = parseInt(index)
                limit = false
                setIndex(0)
            }
            if (index <= 0) {
                setTokens({ ...tokens, hasMore: false });
                return;
            }
            let payload = {
                nft_contract_id: process.env.REACT_APP_CONTRACT,
                from_index: indexQuery.toString(),
                limit: (limit ? Landing.tokensPerPageNear : lastLimit),
            }
            const args_toks = btoa(JSON.stringify(payload))
            const owner = await provider.query({
                request_type: "call_function",
                account_id: process.env.REACT_APP_CONTRACT_MARKET,
                method_name: "get_sales_by_nft_contract_id",
                args_base64: args_toks,
                finality: "optimistic",
            })
            let toks = JSON.parse(Buffer.from(owner.result).toString())
            setTokens({
                ...tokens,
                items: tokens.items.concat(toks.reverse())
            });
        }
        else {
            let supplyPayload = {
                nft_contract_id: process.env.REACT_APP_CONTRACT
            }
            const args_b64 = btoa(JSON.stringify(supplyPayload))
            const supply = await provider.query({
                request_type: "call_function",
                account_id: process.env.REACT_APP_CONTRACT_MARKET,
                method_name: "get_supply_by_nft_contract_id",
                args_base64: args_b64,
                finality: "optimistic",
            })
            let nft_total_supply = JSON.parse(Buffer.from(supply.result).toString())
            if (index >= nft_total_supply) {
                setTokens({ ...tokens, hasMore: false });
                return;
            }
            let payload = {
                nft_contract_id: process.env.REACT_APP_CONTRACT,
                from_index: index.toString(),
                limit: Landing.tokensPerPageNear,
            }
            setIndex(index + Landing.tokensPerPageNear)
            const args_toks = btoa(JSON.stringify(payload))
            const owner = await provider.query({
                request_type: "call_function",
                account_id: process.env.REACT_APP_CONTRACT_MARKET,
                method_name: "get_sales_by_nft_contract_id",
                args_base64: args_toks,
                finality: "optimistic",
            })
            let toks = JSON.parse(Buffer.from(owner.result).toString())
            setTokens({
                ...tokens,
                items: tokens.items.concat(toks)
            });
        }
    };

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

    let fetchMoreDataArtists = async () => {
        await delay(.75)
        var sort
        var last
        if (artSortOrd == 'asc') {
            sort = 'gt'
        }
        else if (artSortOrd == 'desc') {
            sort = 'lt'
        }
        if (artSort == 'timestamp') {
            last = lastTimestamp
        }
        else if (artSort == 'username') {
            last = lastUsername
        }
        let colData;
        const queryData = `
              query($first: Int, $lastUsername: String){
                  profiles(first: $first,  orderBy: ${artSort}, orderDirection: ${artSortOrd}, where: { ${artSort}_${sort}: $lastUsername }){
                    username
                    media
                    biography
                    tokBought
                    tokCreated
                    socialMedia
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
                query: gql(queryData),
                variables: {
                    first: Landing.tokensPerPageNear,
                    lastUsername: last
                },
            })
            .then((data) => {
                if (data.data.profiles.length <= 0) {
                    setArtists({ ...artists, hasMore: false })
                    return
                }
                if (data.data.profiles.length < Landing.tokensPerPageNear) {
                    setArtists({ ...artists, hasMore: false, items: artists.items.concat(data.data.profiles) });
                    setLastUsername(data.data.profiles[data.data.profiles.length - 1].username)
                    setLastTimestamp(data.data.profiles[data.data.profiles.length - 1].timestamp)
                    return;
                }
                setArtists({
                    ...artists,
                    items: artists.items.concat(data.data.profiles)
                });
                setLastUsername(data.data.profiles[data.data.profiles.length - 1].username)
                setLastTimestamp(data.data.profiles[data.data.profiles.length - 1].timestamp)
            })
            .catch((err) => {
                console.log(err)
                colData = 0
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

    let handleSortArtists = (data) => {
        if ('TimeDesc' == data.target.value) {
            if (artSortOrd == 'desc' && artSort == 'timestamp') {
                return;
            }
            setArtSort('timestamp')
            setArtSortOrd('desc')
            setArtCount(true)
            setArtists({
                ...artists,
                hasMore: true,
                items: []
            });
        }
        else if ('TimeAsc' == data.target.value) {
            if (artSortOrd == 'asc' && artSort == 'timestamp') {
                return;
            }
            setArtSort('timestamp')
            setArtSortOrd('asc')
            setArtCount(false)
            setArtists({
                ...artists,
                hasMore: true,
                items: []
            });
        }
        else if ('UseAsc' == data.target.value) {
            if (artSortOrd == 'asc' && artSort == 'username') {
                return;
            }
            setArtSort('username')
            setArtSortOrd('asc')
            setArtists({
                ...artists,
                hasMore: true,
                items: []
            });
        }
        else if ('UseDesc' == data.target.value) {
            if (artSortOrd == 'desc' && artSort == 'username') {
                return;
            }
            setArtSort('username')
            setArtSortOrd('desc')
            setArtists({
                ...artists,
                hasMore: true,
                items: []
            });
        }
        setTrigger(!trigger)
    }

    let handleData = (data) => {
        data = data.target.value
        if ((data == 'tok' || data == 'col' || data == 'art')) {
            if (data == 'tok') {
                console.log('carga tok')
                setTokData(true)
                setColData(false)
                setArtData(false)
            }
            else if (data == 'col') {
                console.log('carga col')
                setTokData(false)
                setColData(true)
                setArtData(false)
            }
            else if (data == 'art') {
                console.log('carga art')
                setTokData(false)
                setColData(false)
                setArtData(true)
            }
        }
    }

    React.useEffect(() => {
        if (urlParams.get('search') == 'tokens') {
            setTokData(true)
            setColData(false)
            setArtData(false)
        }
        else if (urlParams.get('search') == 'collections') {
            setTokData(false)
            setColData(true)
            setArtData(false)
        }
        else if (urlParams.get('search') == 'artists') {
            setTokData(false)
            setColData(false)
            setArtData(true)
        }
    }, [])

    React.useEffect(() => {
        async function getData() {
            let supplyPayload = {
                nft_contract_id: process.env.REACT_APP_CONTRACT
            }
            //instanciar contracto
            const args_b64 = btoa(JSON.stringify(supplyPayload))
            const { network } = selector.options;
            const provider = new providers.JsonRpcProvider({ url: network.nodeUrl });
            const owner = await provider.query({
                request_type: "call_function",
                account_id: process.env.REACT_APP_CONTRACT_MARKET,
                method_name: "get_supply_by_nft_contract_id",
                args_base64: args_b64,
                finality: "optimistic",
            })
            let nft_total_supply = JSON.parse(Buffer.from(owner.result).toString())
            setIndex(nft_total_supply)
            if (nft_total_supply > 0) {
                setHasData(true)
                if (tokSort) {
                    if (nft_total_supply <= Landing.tokensPerPageNear) {
                        let payload = {
                            nft_contract_id: process.env.REACT_APP_CONTRACT,
                            from_index: (0).toString(),
                            limit: parseInt(nft_total_supply),
                        }
                        setIndex(0)

                        const args_toks = btoa(JSON.stringify(payload))
                        const { network } = selector.options;
                        const provider = new providers.JsonRpcProvider({ url: network.nodeUrl });
                        const owner = await provider.query({
                            request_type: "call_function",
                            account_id: process.env.REACT_APP_CONTRACT_MARKET,
                            method_name: "get_sales_by_nft_contract_id",
                            args_base64: args_toks,
                            finality: "optimistic",
                        })
                        let toks = JSON.parse(Buffer.from(owner.result).toString())
                        setTokens({
                            ...tokens,
                            items: tokens.items.concat(toks.reverse())
                        });
                    }
                    else {
                        let payload = {
                            nft_contract_id: process.env.REACT_APP_CONTRACT,
                            from_index: (nft_total_supply - Landing.tokensPerPageNear).toString(),
                            limit: Landing.tokensPerPageNear,
                        }
                        setIndex(nft_total_supply - Landing.tokensPerPageNear)

                        const args_toks = btoa(JSON.stringify(payload))
                        const { network } = selector.options;
                        const provider = new providers.JsonRpcProvider({ url: network.nodeUrl });
                        const owner = await provider.query({
                            request_type: "call_function",
                            account_id: process.env.REACT_APP_CONTRACT_MARKET,
                            method_name: "get_sales_by_nft_contract_id",
                            args_base64: args_toks,
                            finality: "optimistic",
                        })
                        let toks = JSON.parse(Buffer.from(owner.result).toString())
                        setTokens({
                            ...tokens,
                            items: tokens.items.concat(toks.reverse())
                        });
                    }
                }
                else {
                    let payload = {
                        nft_contract_id: process.env.REACT_APP_CONTRACT,
                        from_index: (0).toString(),
                        limit: Landing.tokensPerPageNear,
                    }
                    setIndex(Landing.tokensPerPageNear)

                    const args_toks = btoa(JSON.stringify(payload))
                    const { network } = selector.options;
                    const provider = new providers.JsonRpcProvider({ url: network.nodeUrl });
                    const owner = await provider.query({
                        request_type: "call_function",
                        account_id: process.env.REACT_APP_CONTRACT_MARKET,
                        method_name: "get_sales_by_nft_contract_id",
                        args_base64: args_toks,
                        finality: "optimistic",
                    })
                    let toks = JSON.parse(Buffer.from(owner.result).toString())
                    setTokens({
                        ...tokens,
                        items: tokens.items.concat(toks)
                    });
                }
            }
        }
        getData()
    }, [tokSort])

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

    React.useEffect(() => {
        async function getArtData() {
            const queryData = `
            query($first: Int){
                profiles(first: $first, orderBy: ${artSort}, orderDirection: ${artSortOrd}){
                    username
                    media
                    biography
                    tokBought
                    tokCreated
                    socialMedia
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
                    query: gql(queryData),
                    variables: {
                        first: Landing.tokensPerPageNear,
                    },
                })
                .then((data) => {
                    setArtists({
                        ...artists,
                        items: artists.items.concat(data.data.profiles)
                    });
                    if (data.data.profiles.length <= 0) {
                        setHasDataArt(false)
                    }
                    setLastUsername(data.data.profiles[data.data.profiles.length - 1].username)
                    setLastTimestamp(data.data.profiles[data.data.profiles.length - 1].timestamp)
                    setHasDataArt(true)
                })
                .catch((err) => {
                    console.log('Error ferching data: ', err)
                    setHasDataArt(false)
                })
        }
        getArtData()
    }, [trigger])
    return (
        <>
            {/* <button className="pt-6 font-open-sans dark:text-grey3 text-xl px-6 lg:px-12 flex flex-row py-3"><img src={arrow} alt="flecha" width={24} height={24} /> <p className="pl-2.5">Atras</p></button> */}
            <div className="flex flex-col lg:flex-row px-6 lg:px-12 bg-inherit lg:bg-grayColor pb-[30px] pt-[51px] lg:py-12">
                {/* Titulos de la Pagina */}
                {tokData ? <p className="dark:text-black text-left w-full text-3xl lg:text-[35px] xl:text-[45px] 2xl:text-[60px] font-clash-grotesk font-semibold leading-9">{t("Explore.titleTok")}</p> : ""}
                {colData ? <p className="dark:text-black text-left w-full text-3xl lg:text-[35px] xl:text-[45px] 2xl:text-[60px] font-clash-grotesk font-semibold leading-9">{t("Explore.titleCol")}</p> : ""}
                {artData ? <p className="dark:text-black text-left w-full text-3xl lg:text-[35px] xl:text-[45px] 2xl:text-[60px] font-clash-grotesk font-semibold leading-9">{t("Explore.titleArt")}</p> : ""}
                <div className="font-open-sans text-base lg:text-[18px] xl:text-[27px] text-grey3 flex flex-row pt-[30px] lg:pt-0">
                    <button value="tok" onClick={handleData} className={`px-3 lg:px-9 hover:text-black hover:font-black ${tokData ? "text-black font-black border-b-2 border-yellow4 disabled" : ""}`}>{t("Explore.tabTok")}</button>
                    <button value="col" onClick={handleData} className={`px-3 lg:px-9 hover:text-black hover:font-black ${colData ? "text-black font-black border-b-2 border-yellow4 disabled" : ""}`}>{t("Explore.tabCol")}</button>
                    <button value="art" onClick={handleData} className={`px-3 lg:px-9 hover:text-black hover:font-black ${artData ? "text-black font-black border-b-2 border-yellow4 disabled" : ""}`}>{t("Explore.tabArt")}</button>
                </div>
            </div>

            {/* Galerias */}
            {tokData ?
                <>
                    <div className="px-6 lg:px-12 w-full pb-6 lg:py-12 flex flex-row-reverse">
                        <select name="sort" className="text-base font-open-sans pl-3 py-2.5 border-outlinePressed dark:text-black md:w-[283px]" onChange={handleSortTokens}>
                            <option value="" disabled selected hidden>{t("Explore.sortBy")}</option>
                            <option value="recentOld">{t("Explore.sortTimeRec")}</option>
                            <option value="oldRecent">{t("Explore.sortTimeOld")}</option>
                        </select>
                    </div>
                    {hasData ?
                        <div className="mb-8">
                            <InfiniteScroll
                                dataLength={tokens.items.length}
                                next={fetchMoreData}
                                hasMore={tokens.hasMore}
                                loader={<h1 className="text-center font-clash-grotesk font-semibold w-full py-10 text-xl text-black">{t("tokCollection.loading")}</h1>}
                                endMessage={
                                    <p className="text-center font-clash-grotesk font-semibold w-full py-10 text-xl text-black">
                                        {t("tokCollection.end")}
                                    </p>
                                }
                                className={"flex flex-wrap px-6 lg:px-12 place-content-center gap-4 md:justify-between"}
                            >
                                {tokens.items.map((item, key) => {
                                    console.log(item)
                                    return (
                                        <div className="w-full xs:w-[163px] h-[284px] sm:w-[185px] md:w-[165px] lg:w-[215px] xl:w-[280px] 2xl:w-[340px] xl:h-[490px] " key={key}>
                                            <a
                                                href={"/detail/" + item.token_id}
                                            >
                                                <div className="flex flex-row justify-center " key={key}>
                                                    <div className="trending-token w-full h-full rounded-xl shadow-lg   hover:scale-105 ">
                                                        <div className=" bg-white rounded-xl">
                                                            <div className="pb-3">
                                                                <img
                                                                    className="object-cover object-center rounded-t-xl w-full h-[163px] lg:w-[340px] xl:h-[340px]"
                                                                    src={`https://nativonft.mypinata.cloud/ipfs/${item.media}`}
                                                                    alt={item.description}
                                                                />
                                                            </div>
                                                            <div className="px-3 py-1">
                                                                <p className=" text-black text-base leading-6 text-ellipsis overflow-hidden whitespace-nowrap  font-open-sans font-extrabold uppercase">{item.title}</p>
                                                                <div className="flex justify-start">
                                                                    <div className=" text-base font-open-sans font-semibold py-2 text-yellow4 flex">  <img
                                                                        className="w-[16px] h-[16px] my-auto mr-2"
                                                                        src={nearImage}
                                                                        alt={item.description}
                                                                        width={15}
                                                                        height={15}
                                                                    /> {fromYoctoToNear(item.price)} NEAR</div>
                                                                </div>
                                                            </div>
                                                            <div className="text-black px-3 font-open-sans text-[10px] font-semibold leading-4 uppercase mx-auto justify-center text-ellipsis overflow-hidden py-3 xl:pb-[23px]">
                                                                <a href={`profile/${item.creator_id.split('.')[0]}`} className="text-ellipsis overflow-hidden">{t("tokCollection.createdBy") + ":"} {item.creator_id}</a></div>
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
                                <p className="font-open-sans text-base dark:text-black">{t("Explore.noResTok")}</p>
                            </div>
                        </div>
                    }
                </>
                :
                ""
            }

            {colData ?
                <>
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
                                            <a href={"/collection/" + item.collectionID}
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
                                                                <div className="   w-auto uppercase tracking-tighter text-xs text-left font-bold justify-center font-open-sans leading-4 text-black truncate">{t("Landing.popular_col-by") + " " + item.owner_id}</div>
                                                                <div className="   w-auto   text-xs  text-black text-left justify-center font-normal font-open-sans truncate"> <p className="w-full   text-xs text-black font-open-sans font-normal tracking-wide leading-4  text-left justify-center truncate">{item.tokenCount > 999 ? "+" + item.tokenCount + "k " : item.tokenCount + " "} {t("Landing.popular_col-tokens_on")}</p></div>
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
                :
                ""}

            {artData ?
                <>
                    <div className="px-6 lg:px-12 w-full pb-6 lg:py-12 flex flex-col-reverse md:flex-row-reverse md:justify-between">
                        <select name="sort" className="text-base font-open-sans pl-3 py-2.5 border-outlinePressed dark:text-black md:w-[283px]" onChange={handleSortArtists}>
                            <option value="" disabled selected hidden>{t("Explore.sortBy")}</option>
                            <option value="TimeDesc">{t("Explore.sortTimeRec")}</option>
                            <option value="TimeAsc">{t("Explore.sortTimeOld")}</option>
                            {/* <option value="UseAsc">{t("Explore.sortUserAz")}</option>
                            <option value="UseDesc">{t("Explore.sortUserZa")}</option> */}
                        </select>
                        <div className="font-open-sans text-base text-grey3 flex flex-row pb-4 md:pb-0 ">
                            <button className={`px-3 lg:px-6 hover:text-black hover:font-black ${artData ? "text-black font-black border-b-2 border-yellow4 disabled" : ""}`}>{t("Explore.tabRecent")}</button>
                            <button onClick={async () => { futureFeatureMsg("test") }} className={`px-3 lg:px-6 hover:text-black hover:font-black`}>{t("Explore.tabTopSell")}</button>
                        </div>
                    </div>
                    {hasData ?
                        <div className="mb-8">
                            <InfiniteScroll
                                dataLength={artists.items.length}
                                next={fetchMoreDataArtists}
                                hasMore={artists.hasMore}
                                loader={<h1 className="text-center font-clash-grotesk font-semibold w-full py-10 text-xl text-black">{t("tokCollection.loading")}</h1>}
                                endMessage={
                                    <p className="text-center font-clash-grotesk font-semibold w-full py-10 text-xl text-black">
                                        {t("Explore.endArt")}
                                    </p>
                                }
                                className={"flex flex-wrap px-6 lg:px-12 gap-4 justify-center"}
                            >
                                {artists.items.map((item, key) => {
                                    var count
                                    if(artCount){
                                        count = key + 1
                                    }
                                    else{
                                        count = (artists.items.length) - key
                                    }
                                    return (
                                        <div className="w-full sm:w-[280px] md:w-[350px] lg:w-[295px] xl:w-[380px] 2xl:w-[440px]" key={key}>
                                            <a href={`profile/${item.username.split('.')[0]}`}>
                                                <div className="flex flex-wrap flex-row justify-between items-center hover:scale-105">
                                                    <p className="w-auto font-clash-grotesk font-semibold text-[25px] text-outlinePressed">{count}</p>
                                                    <div className="bg-white rounded-xl py-2 shadow-lg w-[290px] sm:w-[240px] md:w-[300px] lg:w-[260px] xl:w-[340px] 2xl:w-[400px] h-[100px] ">
                                                        <div className="px-[7px] flex flex-wrap flex-row">
                                                            <div className="h-[84px] w-[84px]">
                                                                <img src={`https://nativonft.mypinata.cloud/ipfs/${item.media}`} alt="userImg" className="rounded-md object-cover object-center w-[84px] h-[84px]" />
                                                            </div>
                                                            <div className="flex flex-col-reverse pl-4 w-[190px] sm:w-[140px] md:w-[200px] lg:w-[160px] xl:w-[240px] 2xl:w-[300px]">
                                                                <p className="font-open-sans text-[10px] xl:text-xs font-normal leading-[15px] tracking-[1px] overflow-hidden uppercase text-ellipsis whitespace-nowrap">{item.socialMedia.includes('@') ? item.socialMedia : "@" + item.socialMedia}</p>
                                                                <p className="font-open-sans text-xs xl:text-base font-extrabold uppercase text-ellipsis overflow-hidden whitespace-nowrap">{item.username}</p>
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
                                <p className="font-open-sans text-4xl dark:text-black font-bold pb-3">{t("Explore.noResult")}</p>
                                <p className="font-open-sans text-base dark:text-black">{t("Explore.noResArt")}</p>
                            </div>
                        </div>
                    }
                </>
                :
                ""}
        </>
    );
}

export default Explore;