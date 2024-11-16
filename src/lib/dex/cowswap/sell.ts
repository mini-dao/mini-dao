import {
  OrderBookApi,
  OrderQuoteSideKindSell,
  OrderSigningUtils,
  type UnsignedOrder,
} from "@cowprotocol/cow-sdk";
import type { Signer } from "@ethersproject/abstract-signer";
import type { Account, Address, Chain } from "viem";
import { getWethToken } from "./get-weth-token";

export const sell = async ({
  account,
  chain,
  token,
  amount,
}: {
  account: Account;
  chain: Chain;
  token: Address;
  amount: string;
}) => {
  const orderBookApi = new OrderBookApi({ chainId: chain.id });

  const { quote } = await orderBookApi.getQuote({
    sellToken: token,
    buyToken: getWethToken(chain),
    from: account.address,
    receiver: account.address,
    sellAmountBeforeFee: amount,
    kind: OrderQuoteSideKindSell.SELL,
  });

  const orderSigningResult = await OrderSigningUtils.signOrder(
    quote as UnsignedOrder,
    chain.id,
    account as unknown as Signer
  );

  const orderUid = await orderBookApi.sendOrder(
    Object.assign({}, quote, orderSigningResult)
  );

  const order = await orderBookApi.getOrder(orderUid);

  const trades = await orderBookApi.getTrades({ orderUid });

  console.log("[cowswap]", "sell", { orderId: orderUid, order, trades });
};
