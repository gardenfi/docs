const { useEffect, useState } = React;

export const MAINNET_ASSETS_URL = "https://api.garden.finance/v2/chains";
export const TESTNET_ASSETS_URL =
  "https://testnet.api.garden.finance/v2/chains";

/** Static snapshot for crawler/SEO only (visible table uses API). Update from https://api.garden.finance/v2/chains and testnet API when adding chains. */
export const MAINNET_CHAINS_STATIC = [
  { chain: "arbitrum", name: "Arbitrum", assets: ["WBTC", "iBTC"] },
  { chain: "base", name: "Base", assets: ["cbBTC"] },
  { chain: "bitcoin", name: "Bitcoin", assets: ["BTC"] },
  { chain: "bnbchain", name: "BNB Chain", assets: ["BTCB"] },
  { chain: "botanix", name: "Botanix", assets: ["BTC"] },
  { chain: "citrea", name: "Citrea", assets: ["cBTC"] },
  { chain: "ethereum", name: "Ethereum", assets: ["USDT", "WBTC", "cbBTC", "USDC"] },
  { chain: "hyperevm", name: "HyperEVM", assets: ["uBTC"] },
  { chain: "megaeth", name: "MegaETH", assets: ["BTC.b"] },
  { chain: "monad", name: "Monad", assets: ["MON", "USDC"] },
  { chain: "solana", name: "Solana", assets: ["SOL", "CASH", "USDC", "cbBTC"] },
  { chain: "spark", name: "Spark", assets: ["BTC"] },
  { chain: "starknet", name: "Starknet", assets: ["WBTC"] },
  { chain: "tron", name: "Tron", assets: ["USDT"] },
];

export const TESTNET_CHAINS_STATIC = [
  { chain: "alpen_signet", name: "Alpen Signet", assets: ["BTC"] },
  { chain: "alpen_testnet", name: "Alpen Testnet", assets: ["sBTC", "USDC"] },
  { chain: "arbitrum_sepolia", name: "Arbitrum Sepolia", assets: ["iBTC", "USDC2", "WBTC", "USDC", "SEED"] },
  { chain: "base_sepolia", name: "Base Sepolia", assets: ["iBTC", "cbLTC", "WBTC", "USDT", "USDC", "cbXRP"] },
  { chain: "bitcoin_testnet", name: "Bitcoin Testnet", assets: ["BTC"] },
  { chain: "bnbchain_testnet", name: "BNB Chain Testnet", assets: ["WBTC"] },
  { chain: "citrea_testnet", name: "Citrea Testnet", assets: ["WCBTC", "WBTC", "CBTC", "cbBTC", "USDC", "USDT"] },
  { chain: "ethereum_sepolia", name: "Ethereum Sepolia", assets: ["WBTC", "USDC", "ETH"] },
  { chain: "hyperevm_testnet", name: "HyperEVM Testnet", assets: ["USDC"] },
  { chain: "litecoin_testnet", name: "Litecoin Testnet", assets: ["LTC"] },
  { chain: "monad_testnet", name: "Monad Testnet", assets: ["cbBTC", "USDC"] },
  { chain: "solana_testnet", name: "Solana Testnet", assets: ["SOL", "USDC", "CASH", "cbBTC"] },
  { chain: "spark_regtest", name: "Spark Regtest", assets: ["BTC"] },
  { chain: "starknet_sepolia", name: "Starknet Sepolia", assets: ["WBTC"] },
  { chain: "tron_shasta", name: "Tron Shasta", assets: ["USDT", "WBTC"] },
  { chain: "xrpl_testnet", name: "XRP Ledger Testnet", assets: ["XRP"] },
];

export const CHAIN_NAMES = {
  bnbchain: "BNB Chain",
  bnbchain_testnet: "BNB Chain Testnet",
  megaeth: "MegaETH",
  hyperevm: "HyperEVM",
};

export const getChainName = (chain) => {
  return CHAIN_NAMES[chain] || chain;
};

export const trimAssetName = (id) => {
  const ASSET_NAME_OVERRIDE = {
    cbbtc: "cbBTC",
    ibtc: "iBTC",
    ubtc: "uBTC",
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

export const shouldUseSquareLogo = (chain) => {
  return chain === "base" || chain === "base_sepolia";
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
  const useSquareLogo = shouldUseSquareLogo(chain.chain);

  return (
    <tr>
      <td
        className="flex items-center gap-2 w-full whitespace-nowrap border-r-[1px] border-[#e5e1e2] dark:border-[#454143]/50"
        colSpan={4}
      >
        <Frame
          className={`pointer-events-none w-[20px] ${
            useSquareLogo ? " rounded-none " : ""
          }`}
        >
          <img
            src={chain.icon}
            alt={chain.chain}
            className="aspect-square w-full"
          />
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
                <img
                  src={asset.icon}
                  alt={asset.id}
                  className="aspect-square w-full"
                />
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
    if (!data.status.includes("Ok")) {
      return [];
    }
    const sortedResult = data.result.sort((a, b) => {
      return a.chain.localeCompare(b.chain);
    });
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

/**
 * Static list of supported chains and assets for crawlers/indexing.
 * Rendered in the DOM but visually hidden so it does not affect the live UI.
 * Data is passed from MDX (MAINNET_CHAINS_STATIC / TESTNET_CHAINS_STATIC above) so crawlers get a static snapshot.
 */
export const SupportedChainsStaticSEO = ({
  mainnetChains = [],
  testnetChains = [],
}) => {
  const formatList = (chains) =>
    chains.map((c) => `${c.name}: ${(c.assets || []).join(", ")}`).join("; ");

  return (
    <div
      className="absolute w-px h-px -left-[10000px] overflow-hidden"
      aria-hidden="true"
      data-crawler-only
    >
      <p>Supported chains mainnet: {formatList(mainnetChains)}.</p>
      <p>Supported chains testnet: {formatList(testnetChains)}.</p>
    </div>
  );
};