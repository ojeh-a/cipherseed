export interface CredentialSchema {
  id: string;
  name: string;
  description: string;
  attributes: Array<{
    name: string;
    type: string;
    required: boolean;
  }>;
}

export class SchemaManager {
  private static schemas: Record<string, CredentialSchema> = {
    'wallet-ownership': {
      id: 'wallet-ownership',
      name: 'Wallet Ownership',
      description: 'Verifies ownership of a Cardano wallet',
      attributes: [
        { name: 'address', type: 'string', required: true },
        { name: 'signature', type: 'string', required: true }
      ]
    },
    'kyc': {
      id: 'kyc',
      name: 'Know Your Customer',
      description: 'KYC verification credentials',
      attributes: [
        { name: 'fullName', type: 'string', required: true },
        { name: 'dateOfBirth', type: 'string', required: true },
        { name: 'nationality', type: 'string', required: true },
        { name: 'verificationDate', type: 'string', required: true }
      ]
    }
  };

  static getSchema(id: string): CredentialSchema | undefined {
    return this.schemas[id];
  }

  static getAllSchemas(): CredentialSchema[] {
    return Object.values(this.schemas);
  }

  static validateCredential(schemaId: string, attributes: Record<string, string>): boolean {
    const schema = this.getSchema(schemaId);
    if (!schema) return false;

    return schema.attributes.every(attr => {
      if (attr.required && !(attr.name in attributes)) {
        return false;
      }
      return true;
    });
  }
}
