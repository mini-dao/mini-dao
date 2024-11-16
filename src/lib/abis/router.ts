export const router = [
  {
    inputs: [
      {
        internalType: "address",
        name: "w",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_pair",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_amount",
        type: "uint256",
      },
    ],
    name: "addLiquidity",
    outputs: [
      {
        internalType: "uint256",
        name: "shares",
        type: "uint256",
      },
      {
        components: [
          {
            internalType: "enum DataTypes.LiquidityChangeType",
            name: "liquidityChangeType",
            type: "uint8",
          },
          {
            internalType: "address",
            name: "token0",
            type: "address",
          },
          {
            internalType: "address",
            name: "token1",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "amount0",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "amount1",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "shares",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "reserve0",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "reserve1",
            type: "uint256",
          },
        ],
        internalType: "struct DataTypes.LiquidityChangeData",
        name: "liquidityChangeData",
        type: "tuple",
      },
    ],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_pair",
        type: "address",
      },
    ],
    name: "buy",
    outputs: [
      {
        internalType: "uint256",
        name: "amountOut",
        type: "uint256",
      },
      {
        components: [
          {
            internalType: "uint256",
            name: "amountIn",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "amountOut",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "tokenIn",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "reserve0",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "reserve1",
            type: "uint256",
          },
        ],
        internalType: "struct DataTypes.SwapData",
        name: "swapData",
        type: "tuple",
      },
    ],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_pair",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_shares",
        type: "uint256",
      },
    ],
    name: "removeLiquidity",
    outputs: [
      {
        internalType: "uint256",
        name: "amount0",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "amount1",
        type: "uint256",
      },
      {
        components: [
          {
            internalType: "enum DataTypes.LiquidityChangeType",
            name: "liquidityChangeType",
            type: "uint8",
          },
          {
            internalType: "address",
            name: "token0",
            type: "address",
          },
          {
            internalType: "address",
            name: "token1",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "amount0",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "amount1",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "shares",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "reserve0",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "reserve1",
            type: "uint256",
          },
        ],
        internalType: "struct DataTypes.LiquidityChangeData",
        name: "liquidityChangeData",
        type: "tuple",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_pair",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_amountIn",
        type: "uint256",
      },
    ],
    name: "sell",
    outputs: [
      {
        internalType: "uint256",
        name: "amountOut",
        type: "uint256",
      },
      {
        components: [
          {
            internalType: "uint256",
            name: "amountIn",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "amountOut",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "tokenIn",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "reserve0",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "reserve1",
            type: "uint256",
          },
        ],
        internalType: "struct DataTypes.SwapData",
        name: "swapData",
        type: "tuple",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "weth",
    outputs: [
      {
        internalType: "contract WETH",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "sender",
        type: "address",
      },
      {
        components: [
          {
            internalType: "enum DataTypes.LiquidityChangeType",
            name: "liquidityChangeType",
            type: "uint8",
          },
          {
            internalType: "address",
            name: "token0",
            type: "address",
          },
          {
            internalType: "address",
            name: "token1",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "amount0",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "amount1",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "shares",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "reserve0",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "reserve1",
            type: "uint256",
          },
        ],
        indexed: false,
        internalType: "struct DataTypes.LiquidityChangeData",
        name: "liquidityChangeData",
        type: "tuple",
      },
    ],
    name: "LiquidityChange",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "sender",
        type: "address",
      },
      {
        components: [
          {
            internalType: "uint256",
            name: "amountIn",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "amountOut",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "tokenIn",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "reserve0",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "reserve1",
            type: "uint256",
          },
        ],
        indexed: false,
        internalType: "struct DataTypes.SwapData",
        name: "swapData",
        type: "tuple",
      },
    ],
    name: "Swap",
    type: "event",
  },
] as const;
