import React, { useEffect, useState } from "react";

export const MAINNET_ASSETS_URL = "https://api.garden.finance/v2/chains";
export const TESTNET_ASSETS_URL =
  "https://testnet.api.garden.finance/v2/chains";

export const CHAIN_NAMES = {
  bnbchain: "BNB Chain",
  bnbchain_testnet: "BNB Chain Testnet",
};

export const getChainName = (chain) => {
  return CHAIN_NAMES[chain] || chain;
};

export const trimAssetName = (id) => {
  const ASSET_NAME_OVERRIDE = {
    "cbbtc": "cbBTC",
    "ibtc" : "iBTC",
    "ubtc" : "uBTC",
  };
  
  const assetName = id.split(":")[1];
  const override = ASSET_NAME_OVERRIDE[assetName.toLowerCase()];
  return override || assetName.toUpperCase();
};

export const titilize = (chain) => {
  const chainSplit = chain.split("_");
  const firstWord =
    chainSplit[0].charAt(0).toUpperCase() + chainSplit[0].slice(1);
  const secondWord =
    chainSplit.length > 1
      ? chainSplit[1].charAt(0).toUpperCase() + chainSplit[1].slice(1)
      : "";
  return firstWord + " " + secondWord;
};

export const getExplorerUrl = (chain, address, explorer_url) => {
  if (chain.includes("bitcoin")) {
    return "/contracts/bitcoin";
  } else if (chain.includes("starknet")) {
    return explorer_url + "contract/" + address + "#overview";
  } else if (chain.includes("solana")) {
    return (
      explorer_url +
      "/address/" +
      "2bag6xpshpvPe7SJ9nSDLHpxqhEAoHPGpEkjNSv7gxoF" +
      (chain.includes("testnet") ? "?cluster=devnet" : "")
    );
  } else if (chain.includes("sui")) {
    return explorer_url + "/object/" + address;
  } else {
    return explorer_url + "/address/" + address + "#code";
  }
};

export const AssetRow = ({ chain, assets }) => {
  // console.log(assets)
  return (
    <tr>
      <td
        className="flex items-center gap-2 w-full whitespace-nowrap border-r-[1px] border-[#e5e1e2] dark:border-[#454143]/50"
        colSpan={4}
      >
        <Frame className="pointer-events-none w-[20px]">
          <img width="20" src={chain.icon} alt={chain.chain} className="w-full"/>
        </Frame>
        <strong>{titilize(getChainName(chain.chain))}</strong>
      </td>
      <td colSpan={4}>
        <div className="flex gap-4 flex-wrap mx-2">
          {assets.map((asset, i) => (
            <a
              key={i}
              href={getExplorerUrl(
                chain.chain,
                asset.htlc?.address,
                chain.explorer_url
              )}
              className="border-none flex items-center gap-2"
            >
              <Frame className="pointer-events-none w-[20px]">
                <img width="20" src={asset.icon} alt={asset.id} className="w-full"/>
              </Frame>
              <span>{trimAssetName(asset.id)}</span>
            </a>
          ))}
        </div>
      </td>
    </tr>
  );
};

export const getAssets = async (url = MAINNET_ASSETS_URL) => {
  try {
    const response = await fetch(url);
    const data = await response.json();
    if (data.status.includes("OK")) {
      return [];
    }
    const sortedResult = data.result.sort((a, b) => {
      return a.chain.localeCompare(b.chain);
    });
    console.log(sortedResult[0].assets[0].htlc.address);
    return sortedResult;
  } catch (error) {
    console.log("Error fetching assets", error);
    return [];
  }
};

export const SupportedAssets = ({ url }) => {
  const [supportedAssetsConfig, setSupportedAssetsConfig] = useState([]);

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const assetsConfig = await getAssets(url);
        setSupportedAssetsConfig(assetsConfig);
      } catch (error) {
        console.error("Failed to fetch assets:", error);
      }
    };

    fetchAssets();
  }, []);

  return (
    <table className="w-full table-auto border-collapse">
      <thead>
        <tr>
          <th>Chain</th>
          <th colSpan="4">Asset HTLCs</th>
        </tr>
      </thead>
      <tbody>
        {supportedAssetsConfig.map((chainConfig, i) => (
          <AssetRow
            key={i}
            chain={{
              chain: chainConfig.chain,
              icon: chainConfig.icon,
              explorer_url: chainConfig.explorer_url,
            }}
            assets={chainConfig.assets}
          />
        ))}
      </tbody>
    </table>
  );
};
