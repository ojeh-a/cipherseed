import { Agent } from '@hyperledger/aries-framework-core';
import { ConnectionService } from '@hyperledger/aries-framework-core';
import { CredentialService } from '@hyperledger/aries-framework-core';
import { config } from './config';

export interface CredentialData {
  schemaId: string;
  issuerDid: string;
  subjectDid: string;
  attributes: Record<string, string>;
}

export class HyperledgerDID {
  private agent: Agent;
  private connectionService: ConnectionService;
  private credentialService: CredentialService;

  constructor(agent: Agent) {
    this.agent = agent;
    this.connectionService = new ConnectionService(this.agent);
    this.credentialService = new CredentialService(this.agent);
  }

  async createDID(): Promise<string> {
    const did = await this.agent.wallet.createDid();
    return did.did;
  }

  async createConnection(otherDid: string): Promise<void> {
    const connection = await this.connectionService.createConnection({
      theirDid: otherDid,
      label: 'Cipherseed Connection'
    });
    await this.connectionService.acceptConnection(connection);
  }

  async issueCredential(credential: CredentialData): Promise<void> {
    const credentialRecord = await this.credentialService.createCredential({
      schemaId: credential.schemaId,
      issuerDid: credential.issuerDid,
      subjectDid: credential.subjectDid,
      attributes: credential.attributes
    });
    
    await this.credentialService.issueCredential(credentialRecord);
  }

  async verifyCredential(credentialId: string): Promise<boolean> {
    const credentialRecord = await this.credentialService.getCredentialById(credentialId);
    return await this.credentialService.verifyCredential(credentialRecord);
  }

  async storeCredentialLocally(credential: any): Promise<void> {
    // Store in local storage with encryption
    const encryptedCredential = await this.encryptCredential(credential);
    localStorage.setItem(`credential_${credential.id}`, encryptedCredential);
  }

  private async encryptCredential(credential: any): Promise<string> {
    // Simple encryption for local storage - in production use proper encryption
    const encrypted = btoa(JSON.stringify(credential));
    return encrypted;
  }

  async getCredential(credentialId: string): Promise<any> {
    const encrypted = localStorage.getItem(`credential_${credentialId}`);
    if (!encrypted) return null;
    return JSON.parse(atob(encrypted));
  }
}
