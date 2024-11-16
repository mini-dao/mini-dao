export interface BasePendingTransaction {
  chain: string;
  tokenAddress: string;
  amount: string;
  chatId: number;
  messageId: number;
}

export interface BuyPendingTransaction extends BasePendingTransaction {
  type: "buy";
}

export interface SellPendingTransaction extends BasePendingTransaction {
  type: "sell";
}

export type PendingTransaction = BuyPendingTransaction | SellPendingTransaction;

export const pendingTransactions = new Map<string, PendingTransaction>();
