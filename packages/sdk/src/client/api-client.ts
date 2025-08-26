import axios, { AxiosInstance } from 'axios';
import { Negotiation, Party, Issue } from '../types';

export class ApiClient {
  private client: AxiosInstance;

  constructor(baseURL: string = 'http://localhost:3001/api/v1') {
    this.client = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  // Negotiations
  async getNegotiations(): Promise<Negotiation[]> {
    const response = await this.client.get('/negotiations');
    return response.data;
  }

  async getNegotiation(id: string): Promise<Negotiation> {
    const response = await this.client.get(`/negotiations/${id}`);
    return response.data;
  }

  async createNegotiation(data: Partial<Negotiation>): Promise<Negotiation> {
    const response = await this.client.post('/negotiations', data);
    return response.data;
  }

  // Parties
  async getParties(): Promise<Party[]> {
    const response = await this.client.get('/parties');
    return response.data;
  }

  async createParty(data: Partial<Party>): Promise<Party> {
    const response = await this.client.post('/parties', data);
    return response.data;
  }

  // Issues
  async getIssues(): Promise<Issue[]> {
    const response = await this.client.get('/issues');
    return response.data;
  }

  async createIssue(data: Partial<Issue>): Promise<Issue> {
    const response = await this.client.post('/issues', data);
    return response.data;
  }
}
