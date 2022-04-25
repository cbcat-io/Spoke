import ImageMediaSource from "../ImageMediaSource";

export default class BingImagesSource extends ImageMediaSource {
  constructor(api) {
    super(api);
    this.id = "bing_images";
    this.name = "Imatges de Bing";
    this.searchLegalCopy = "Cerca a Bing";
    this.privacyPolicyUrl = "https://privacy.microsoft.com/en-us/privacystatement";
  }
}
