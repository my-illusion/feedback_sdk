declare module "vue/dist/vue.esm.js";
declare module "view-design/src/components/*";

type ShootCallback = (base64: string) => void;

interface PluginOptions {
  color?: string;
  render: Function;
}

interface FeedPlugin {
  new (options: PluginOptions): void;
}
