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
/* global BigInt */

function Explore() {
    const { selector, modal, accounts, accountId } = useWalletSelector();
    const [t, i18n] = useTranslation("global")
    const [Landing, setLanding] = React.useState({
        tokensPerPageNear: 15,
    });
    let [collections, setCollections] = React.useState({
        items: [],
        hasMore: true
    });
    let [artists, setArtists] = React.useState({
        items: [],
        hasMore: true
    });
    const [index, setIndex] = React.useState(0)
    const [lastUsername, setLastUsername] = React.useState("");
    const [lastTimestamp, setLastTimestamp] = React.useState();
    const [hasData, setHasData] = React.useState(false)
    const [artSortOrd, setArtSortOrd] = React.useState('desc')
    const [artSort, setArtSort] = React.useState('timestamp')
    const [trigger, setTrigger] = React.useState(true)

    const APIURL = process.env.REACT_APP_API_TG

    function delay(n) {
        return new Promise(function (resolve) {
            setTimeout(resolve, n * 1000);
        });
    }

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
                        setHasData(false)
                    }
                    setLastUsername(data.data.profiles[data.data.profiles.length - 1].username)
                    setLastTimestamp(data.data.profiles[data.data.profiles.length - 1].timestamp)
                    setHasData(true)
                })
                .catch((err) => {
                    console.log('Error ferching data: ', err)
                    setHasData(false)
                })
        }
        getArtData()
    }, [trigger])

    let fetchMoreDataArtists = async () => {
        console.log(lastUsername)
        await delay(.75)
        var sort
        var last
        if (artSortOrd == 'asc') {
            sort = 'gt'
        }
        else if (artSortOrd == 'desc') {
            sort = 'lt'
        }
        if(artSort=='timestamp'){
            last = lastTimestamp
        }
        else if(artSort=='username'){
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
                setArtists({
                    ...artists,
                    items: artists.items.concat(data.data.profiles)
                });
                console.log(data.data.profiles)
                setLastUsername(data.data.profiles[data.data.profiles.length - 1].username)
                setLastTimestamp(data.data.profiles[data.data.profiles.length - 1].timestamp)
                if (data.data.profiles.length < Landing.tokensPerPageNear) {
                    setArtists({ ...artists, hasMore: false, items: artists.items.concat(data.data.profiles) });
                    setLastUsername(data.data.profiles[data.data.profiles.length - 1].username)
                    setLastTimestamp(data.data.profiles[data.data.profiles.length - 1].timestamp)
                    return;
                }
            })
            .catch((err) => {
                console.log(err)
                colData = 0
            })
    }

    let handleSortArtists = (data) => {
        if ('TimeDesc' == data.target.value) {
            if (artSortOrd == 'desc' && artSort == 'timestamp') {
                return;
            }
            setArtSort('timestamp')
            setArtSortOrd('desc')
            setArtists({
                ...artists,
                items: []
            });
        }
        else if ('TimeAsc' == data.target.value) {
            if (artSortOrd == 'asc'  && artSort == 'timestamp') {
                return;
            }
            setArtSort('timestamp')
            setArtSortOrd('asc')
            setArtists({
                ...artists,
                items: []
            });
        }
        else if ('UseAsc' == data.target.value) {
            if (artSortOrd == 'asc'  && artSort == 'username') {
                return;
            }
            setArtSort('username')
            setArtSortOrd('asc')
            setArtists({
                ...artists,
                items: []
            });
        }
        else if ('UseDesc' == data.target.value) {
            if (artSortOrd == 'desc'  && artSort == 'username') {
                return;
            }
            setArtSort('username')
            setArtSortOrd('desc')
            setArtists({
                ...artists,
                items: []
            });
        }
        setTrigger(!trigger)
    }

    return (
        <div className="pb-4">
            <button className="pt-6 font-open-sans dark:text-grey3 text-xl px-6 flex flex-row py-3"><img src={arrow} alt="flecha" width={24} height={24} /> <p className="pl-2.5">Atras</p></button>
            <h1 className="dark:text-black text-left px-6 pt-[5px] pb-8 w-full text-3xl font-clash-grotesk font-semibold leading-9">Explora todas las Colecciones</h1>
            <div className="px-6 lg:px-12 w-full pb-6 flex flex-row-reverse">
                <select name="sort" className="text-base font-open-sans pl-3 py-2.5 border-outlinePressed dark:text-black md:w-[283px]" onChange={handleSortArtists}>
                    <option value="" disabled selected hidden>Sort by</option>
                    <option value="TimeAsc">Time  (old to recent)</option>
                    <option value="TimeDesc">Time  (recent to old)</option>
                    <option value="UseAsc">Username  (A-Z)</option>
                    <option value="UseDesc">Username  (Z-A)</option>
                </select>
            </div>
            {hasData ?
                <div>
                    <InfiniteScroll
                        dataLength={artists.items.length}
                        next={fetchMoreDataArtists}
                        hasMore={artists.hasMore}
                        loader={<h1 className="text-center w-full py-10 text-xl font-bold text-yellow2">{t("tokCollection.loading")}</h1>}
                        endMessage={
                            <p className="text-center w-full py-10 text-xl text-yellow2">
                                <b>{t("tokCollection.end")}</b>
                            </p>
                        }
                        className={"flex flex-wrap px-6 lg:px-12 gap-4 lg:justify-between"}
                    >
                        {artists.items.map((item, key) => {
                            return (
                                <div className="w-full lg:w-[450px]" key={key}>
                                    <a href={`profile/${item.username.split('.')[0]}`}>
                                        <div className="flex flex-wrap flex-row justify-between items-center">
                                            <p className="w-auto font-clash-grotesk font-semibold text-3xl text-outlinePressed">{key+1}</p>
                                            <div className="bg-white rounded-xl drop-shadow-md py-2 w-[300px] lg:w-[400px] h-[100px]">
                                                <div className="px-[7px] flex flex-wrap flex-row">
                                                    <div className="h-[84px] w-[84px]">
                                                        <img src={`https://nativonft.mypinata.cloud/ipfs/${item.media}`} alt="userImg" className="rounded-md object-cover object-center w-[84px] h-[84px]" />
                                                    </div>
                                                    <div className="flex flex-col-reverse pl-4">
                                                        <p className="w-[159px] font-open-sans text-xs font-normal overflow-hidden uppercase">{item.socialMedia.includes('@')? item.socialMedia : "@"+item.socialMedia}</p>
                                                        <h1 className="font-open-sans text-base font-extrabold w-[159px]">{item.username}</h1>
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