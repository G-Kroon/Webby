// engine/publish/DeploymentManager.js
export class DeploymentManager {
  constructor(adapter) {
    this.adapter = adapter;
  }

  async deploy(tenantId, outputBundle) {
    return await this.adapter.uploadBundle(tenantId, outputBundle);
  }
}
