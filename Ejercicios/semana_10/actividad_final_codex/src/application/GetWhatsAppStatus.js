export class GetWhatsAppStatus {
  constructor({ connectionGateway }) {
    this.connectionGateway = connectionGateway;
  }

  execute() {
    return this.connectionGateway.getStatus();
  }
}