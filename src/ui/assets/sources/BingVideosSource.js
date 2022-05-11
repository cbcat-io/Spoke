import VideoMediaSource from "../VideoMediaSource";

export default class BingVideosSource extends VideoMediaSource {
  constructor(api) {
    super(api);
    this.id = "bing_videos";
    this.name = "Vídeos de Bing";
    this.searchLegalCopy = "Cerca a Bing";
    this.privacyPolicyUrl = "https://privacy.microsoft.com/en-us/privacystatement";
  }
}
