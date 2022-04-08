import AssetManifestSource from "../AssetManifestSource";

export default class HubsSoundPackSource extends AssetManifestSource {
  constructor(editor) {
    super(editor, "Paquet de Sons de Hubs", "https://assets-prod.reticulum.io/hubs-sound-pack/asset-manifest.json");
  }
}
