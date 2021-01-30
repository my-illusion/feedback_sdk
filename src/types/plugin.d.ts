declare module "vue/dist/vue.esm.js";
declare module "view-design/src/components/*";
declare module "*.jpg";
declare module "*.vue";

type ShootCallback = (base64: string) => void;

interface PluginOptions {
  right?: number;
  bottom?: number;
  backgroundColor?: string;
  width?: number;
}

interface FeedPlugin {
  new (options: PluginOptions): void;
}
