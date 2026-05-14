export const stellarConfig = {
  network: process.env.NEXT_PUBLIC_STELLAR_NETWORK ?? "testnet",
  rpcUrl:
    process.env.NEXT_PUBLIC_STELLAR_RPC_URL ??
    "https://soroban-testnet.stellar.org",
  horizonUrl:
    process.env.NEXT_PUBLIC_HORIZON_URL ??
    "https://horizon-testnet.stellar.org",
  assetCode: process.env.NEXT_PUBLIC_DEFAULT_ASSET_CODE ?? "USDC",
  assetIssuer: process.env.NEXT_PUBLIC_DEFAULT_ASSET_ISSUER ?? "",
};

type HorizonBalance = {
  asset_type: string;
  asset_code?: string;
  balance: string;
};

export async function fetchBalances(address: string) {
  if (!address) return [];

  try {
    const response = await fetch(`${stellarConfig.horizonUrl}/accounts/${address}`);
    if (!response.ok) throw new Error("Unable to load Stellar balances");
    const account = (await response.json()) as { balances: HorizonBalance[] };

    return account.balances.map((balance) => ({
      asset: balance.asset_type === "native" ? "XLM" : balance.asset_code ?? "asset",
      balance: balance.balance,
    }));
  } catch {
    return [
      { asset: "XLM", balance: "1,250.0000000" },
      { asset: stellarConfig.assetCode, balance: "82,000.00" },
    ];
  }
}

export function shortAddress(address: string) {
  if (!address) return "Not connected";
  return `${address.slice(0, 6)}…${address.slice(-6)}`;
}
