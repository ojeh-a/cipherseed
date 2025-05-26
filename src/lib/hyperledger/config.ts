export interface AriesConfig {
  walletConfig: {
    id: string;
    key: string;
  };
  endpoints: {
    inbound: string;
    outbound: string;
  };
  label: string;
}

export const ariesConfig: AriesConfig = {
  walletConfig: {
    id: process.env.HYPERLEDGER_WALLET_ID || '',
    key: process.env.HYPERLEDGER_WALLET_KEY || ''
  },
  endpoints: {
    inbound: process.env.HYPERLEDGER_INBOUND_ENDPOINT || '',
    outbound: process.env.HYPERLEDGER_OUTBOUND_ENDPOINT || ''
  },
  label: 'Cipherseed DID Agent'
};
