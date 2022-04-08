import EditorNodeMixin from "./EditorNodeMixin";
import SimpleWater from "../objects/SimpleWater";
import waterNormalsUrl from "three/examples/textures/waternormals.jpg";
import loadTexture from "../utils/loadTexture";
import { Texture } from "three";

let waterNormalMap = null;

export default class SimpleWaterNode extends EditorNodeMixin(SimpleWater) {
  static componentName = "simple-water";

  static nodeName = "Aigua Simple";

  static async deserialize(editor, json) {
    const node = await super.deserialize(editor, json);

    const {
      opacity,
      color,
      tideHeight,
      tideScale,
      tideSpeed,
      waveHeight,
      waveScale,
      waveSpeed,
      ripplesSpeed,
      ripplesScale
    } = json.components.find(c => c.name === SimpleWaterNode.componentName).props;

    node.opacity = opacity;
    node.color.set(color);
    node.tideHeight = tideHeight;
    node.tideScale.copy(tideScale);
    node.tideSpeed.copy(tideSpeed);
    node.waveHeight = waveHeight;
    node.waveScale.copy(waveScale);
    node.waveSpeed.copy(waveSpeed);
    node.ripplesSpeed = ripplesSpeed;
    node.ripplesScale = ripplesScale;

    return node;
  }

  static async load() {
    waterNormalMap = await loadTexture(waterNormalsUrl);
  }

  constructor(editor) {
    if (!waterNormalMap) {
      console.warn("SimpleWaterNode: El mapa normal de l'aigua no s'ha carregat abans de crear un nou node d'aigua");
    }

    super(editor, waterNormalMap || new Texture());

    if (editor.scene) {
      this.material.envMap = editor.scene.environmentMap;
      this.material.needsUpdate = true;
    }
  }

  onUpdate(_dt, time) {
    this.update(time);
  }

  serialize() {
    return super.serialize({
      "simple-water": {
        opacity: this.opacity,
        color: this.color,
        tideHeight: this.tideHeight,
        tideScale: this.tideScale,
        tideSpeed: this.tideSpeed,
        waveHeight: this.waveHeight,
        waveScale: this.waveScale,
        waveSpeed: this.waveSpeed,
        ripplesSpeed: this.ripplesSpeed,
        ripplesScale: this.ripplesScale
      }
    });
  }

  prepareForExport() {
    super.prepareForExport();
    this.addGLTFComponent("simple-water", {
      opacity: this.opacity,
      color: this.color,
      tideHeight: this.tideHeight,
      tideScale: this.tideScale,
      tideSpeed: this.tideSpeed,
      waveHeight: this.waveHeight,
      waveScale: this.waveScale,
      waveSpeed: this.waveSpeed,
      ripplesSpeed: this.ripplesSpeed,
      ripplesScale: this.ripplesScale
    });
    this.replaceObject();
  }

  getRuntimeResourcesForStats() {
    return { meshes: [this], materials: [this.material], textures: [waterNormalMap] };
  }
}
