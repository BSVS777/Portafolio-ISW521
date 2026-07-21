export class ConnectionGateway {
  getStatus() {
    throw new Error('ConnectionGateway.getStatus must be implemented by an adapter.');
  }
}