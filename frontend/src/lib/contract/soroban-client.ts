// @ts-nocheck
import { STELLAR_NETWORK, CONTRACT_ID } from "@/lib/env";

let rpcClient: any = null;

export async function getSorobanClient(): Promise<any> {
  if (!rpcClient) {
    // Dynamic import to avoid TypeScript resolution issues
    const { SorobanRpc } = await import("@stellar/stellar-sdk");
    rpcClient = new SorobanRpc.Server(STELLAR_NETWORK.rpcUrl, {
      allowHttp: false,
    });
  }
  return rpcClient;
}

export function getContractAddress(): string {
  if (!CONTRACT_ID) {
    throw new Error(
      "CONTRACT_ID not configured. Please set NEXT_PUBLIC_CONTRACT_ID in .env.local"
    );
  }
  return CONTRACT_ID;
}

export interface InvokeContractOptions {
  method: string;
  args?: any[];
  signers?: any[];
}

export async function simulateContractCall(
  method: string,
  args: any[] = []
): Promise<any> {
  const { Address, TransactionBuilder, contract, nativeToScVal, scValToNative, SorobanRpc } = await import(
    "@stellar/stellar-sdk"
  );
  const client = await getSorobanClient();
  const contractId = getContractAddress();

  try {
    const contractAddress = new Address(contractId);
    const source = await client.getAccount(contractId);

    // Create a contract invocation with simulated parameters
    const params = args.map((arg: any) => {
      if (typeof arg === "string") {
        return nativeToScVal(arg, { type: "string" });
      }
      if (typeof arg === "number") {
        return nativeToScVal(arg, { type: "u64" });
      }
      if (Array.isArray(arg)) {
        return nativeToScVal(arg, { type: "vec" });
      }
      return nativeToScVal(arg);
    });

    const tx = new TransactionBuilder(source, {
      fee: "100",
      networkPassphrase: STELLAR_NETWORK.networkPassphrase,
    })
      .addOperation(
        contract(method, contractAddress, ...params)
      )
      .setTimeout(30)
      .build();

    const client_tx = await client.simulateTransaction(tx);

    if (SorobanRpc.Api.isSimulationSuccess(client_tx)) {
      const result = client_tx.result?.retval;
      if (result) {
        return scValToNative(result);
      }
      return null;
    } else if (SorobanRpc.Api.isSimulationRestore(client_tx)) {
      throw new Error("Contract needs restore");
    } else if (SorobanRpc.Api.isSimulationError(client_tx)) {
      throw new Error(
        `Simulation error: ${client_tx.error?.message || "Unknown error"}`
      );
    }
  } catch (error) {
    console.error("Simulation error:", error);
    throw error;
  }
}
