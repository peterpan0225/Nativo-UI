import React from "react";
import { providers, utils } from "near-api-js";
import InfiniteScroll from "react-infinite-scroll-component";
import { useWalletSelector } from "../utils/walletSelector";
import { fromYoctoToNear } from "../utils/near_interaction";
import { useTranslation } from "react-i18next";
import nearImage from '../assets/img/landing/trendingSection/Vector.png';
import filterLogo from "../assets/img/explore/filter.png"
import arrow from "../assets/img/explore/arrow-right.png"
import search from "../assets/img/explore/youtube_searched_for.png"

function Explore() {
    const { selector, modal, accounts, accountId } = useWalletSelector();
    const [t, i18n] = useTranslation("global")
    const [Landing, setLanding] = React.useState({
        tokensPerPageNear: 20,
    });
    let [tokens, setTokens] = React.useState({
        items: [],
        hasMore: true
    })
    const [index, setIndex] = React.useState(0)
    const [hasData, setHasData] = React.useState(false)
    const [tokSort, setTokSort] = React.useState(true)

    function delay(n) {
        return new Promise(function (resolve) {
            setTimeout(resolve, n * 1000);
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
    return (
        <>
            <button className="pt-6 font-open-sans dark:text-grey3 text-xl px-6 lg:px-12 flex flex-row py-3"><img src={arrow} alt="flecha" width={24} height={24} /> <p className="pl-2.5">Atras</p></button>
            <h1 className="dark:text-black text-left px-6 lg:px-12 pt-[5px] pb-8 w-full text-3xl font-clash-grotesk font-semibold leading-9">Explora todos los Tokens</h1>
            <div className="px-6 lg:px-12 w-full pb-6 flex flex-row-reverse">
                <select name="sort" className="text-base font-open-sans pl-3 py-2.5 border-outlinePressed dark:text-black md:w-[283px] " onChange={handleSortTokens}>
                    <option value="" disabled selected hidden>Sort by</option>
                    <option value="oldRecent">Time  (old to recent)</option>
                    <option value="recentOld">Time  (recent to old)</option>
                </select>
            </div>
            {hasData ?
                <div>
                    <InfiniteScroll
                        dataLength={tokens.items.length}
                        next={fetchMoreData}
                        hasMore={tokens.hasMore}
                        loader={<h1 className="text-center w-full py-10 text-xl font-bold text-yellow2">{t("tokCollection.loading")}</h1>}
                        endMessage={
                            <p className="text-center w-full py-10 text-xl text-yellow2">
                                <b>{t("tokCollection.end")}</b>
                            </p>
                        }
                        className={"flex flex-wrap px-6 lg:px-12 place-content-center gap-4 md:justify-between"}
                    >
                        {tokens.items.map((item, key) => {
                            return (
                                <div className="w-full xs:w-[163px] h-[284px] sm:w-1/3 md:w-[225px] lg:w-[340px] lg:h-[490px] " key={key}>
                                    <a
                                        href={"/detail/" + item.token_id}
                                    >
                                        <div className="flex flex-row mb-10 md:mb-0 w-full justify-center" key={key}>
                                            <div className="trending-token w-full rounded-20 drop-shadow-md hover:scale-105 ">
                                                <div className=" bg-white rounded-xl">
                                                    <div className="pb-3">
                                                        <img
                                                            className="object-cover object-center rounded-t-xl h-[163px] lg:h-[340px] w-full "
                                                            src={`https://nativonft.mypinata.cloud/ipfs/${item.media}`}

                                                            alt={item.description}
                                                        />
                                                    </div>
                                                    <div className="px-3 lg:px-[18px] py-1 lg:py-0">
                                                        <div className=" text-black text-base leading-6 text-ellipsis overflow-hidden whitespace-nowrap lg:whitespace-normal font-open-sans font-extrabold uppercase lg:pt-0.5 lg:h-[60px]">{item.title}</div>
                                                        <div className="flex justify-start">
                                                            <div className=" text-base font-open-sans font-semibold py-2 lg:py-0 lg:pt-2 text-yellow4 flex">  <img
                                                                className="w-[16px] h-[16px] my-auto mr-2"
                                                                src={nearImage}
                                                                alt={item.description}
                                                                width={15}
                                                                height={15}
                                                            /> {fromYoctoToNear(item.price)} NEAR</div>
                                                        </div>
                                                    </div>
                                                    <div className="text-black px-3 lg:px-[18px] font-open-sans text-xs font-semibold leading-4 uppercase mx-auto justify-center text-ellipsis overflow-hidden py-3">
                                                        <a href={`profile/${item.creator_id.split('.')[0]}`} className=" text-ellipsis overflow-hidden">{item.creator_id}</a></div>
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

        </>
    );
}

export default Explore;