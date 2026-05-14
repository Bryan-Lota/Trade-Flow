import { fetchBalances, stellarConfig } from "@/lib/stellar";
import type { WalletState } from "@/types";

type FreighterWindowApi = {
  isConnected?: () => Promise<boolean> | boolean;
  requestAccess?: () => Promise<string>;
  getAddress?: () => Promise<{ address: string } | string>;
  getNetwork?: () => Promise<{ network: string } | string>;
  signTransaction?: (xdr: string, opts?: { networkPassphrase?: string }) => Promise<string>;
};

declare global {
  interface Window {
    freighterApi?: FreighterWindowApi;
  }
}

function getFreighter(): FreighterWindowApi {
  if (typeof window === "undefined" || !window.freighterApi) {
    throw new Error("Freighter is not available. Install or unlock the browser extension.");
  }

  return window.freighterApi;
}

export async function connectFreighter(): Promise<WalletState> {
  try {
    const api = getFreighter();
    const connected = api.isConnected ? await api.isConnected() : true;

    if (!connected) {
      throw new Error("Freighter is not available. Install or unlock the browser extension.");
    }

    const access = api.requestAccess ? await api.requestAccess() : "";
    const addressResult = api.getAddress ? await api.getAddress() : access;
    const networkResult = api.getNetwork ? await api.getNetwork() : stellarConfig.network;
    const address =
      typeof addressResult === "string" ? addressResult : addressResult.address;
    const network =
      typeof networkResult === "string" ? networkResult : networkResult.network;

    return {
      isConnected: true,
      address,
      network: network || stellarConfig.network,
      balances: await fetchBalances(address),
    };
  } catch (error) {
    return {
      isConnected: false,
      address: "",
      network: stellarConfig.network,
      balances: [],
      error:
        error instanceof Error
          ? error.message
          : "Unable to connect Freighter. Demo mode remains available.",
    };
  }
}

export async function signXdr(unsignedXdr: string) {
  const api = getFreighter();
  if (!api.signTransaction) return unsignedXdr;
  return api.signTransaction(unsignedXdr, { networkPassphrase: "Test SDF Network ; September 2015" });
}
