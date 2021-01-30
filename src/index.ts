import html2canvas from "html2canvas";
// eslint-disable-next-line import/extensions
// import Vue from "vue/dist/vue.esm.js";
import Vue from "vue";
import Input from "view-design/src/components/input";
import Form from "view-design/src/components/form";
import FormItem from "view-design/src/components/form-item";
import Button from "view-design/src/components/button";

import MessageImg from "../static/back.jpg";
import UploadImage from "../components/UploadImage.vue";

import "../static/font/iconfont.css";
import "../static/global.css";

import "view-design/dist/styles/iview.css";

Vue.component("Input", Input);
Vue.component("Form", Form);
Vue.component("FormItem", FormItem);
Vue.component("Button", Button);
Vue.component("UploadImage", UploadImage);

let canvasRect: HTMLCanvasElement;

let isMoving = false;

const penColor = "#ff0000";
const penWidth = 2;

// function downloadIamge(imgUrl: string) {
//   // 图片保存有很多方式，这里使用了一种投机的简单方法。
//   // 生成一个a元素
//   const a = document.createElement("a");
//   // 创建一个单击事件
//   const event = new MouseEvent("click");
//   // 生成文件名称
//   const timestamp = new Date().getTime();
//   const name = `${imgUrl.substring(22, 30) + timestamp}.png`;
//   a.download = name;
//   // 将生成的URL设置为a.href属性
//   a.href = imgUrl;
//   // 触发a的单击事件 开始下载
//   a.dispatchEvent(event);
// }

function printClip(
  canvas: HTMLCanvasElement,
  captureX: number,
  captureY: number,
  captureWidth: number,
  captureHeight: number,
  cb: ShootCallback
) {
  // 创建一个用于截取的canvas
  const clipCanvas = document.createElement("canvas");

  clipCanvas.width = captureWidth;
  clipCanvas.height = captureHeight;

  const ctx = clipCanvas.getContext("2d");
  // 截取
  if (!ctx) return;
  ctx.drawImage(
    canvas,
    captureX,
    captureY,
    captureWidth,
    captureHeight,
    0,
    0,
    captureWidth,
    captureHeight
  );
  const clipImgBase64: string = clipCanvas.toDataURL();

  // eslint-disable-next-line no-unused-expressions
  cb && cb(clipImgBase64);
  const rectContext = canvasRect.getContext("2d");
  if (rectContext) {
    rectContext.clearRect(0, 0, canvasRect.width, canvasRect.height);
  }

  // 隐藏canvas
  canvasRect.style.display = "none";

  // 生成图片
  // const clipImg = new Image();
  // clipImg.src = clipImgBase64;
  // downloadIamge(clipImgBase64);
}

function handleClick(cb: ShootCallback) {
  canvasRect.style.display = "block";
  const ctx = canvasRect.getContext("2d");
  if (ctx) {
    ctx.fillStyle = "#f1f0f0";
    ctx.globalAlpha = 0.3;
    ctx.fillRect(0, 0, canvasRect.width, canvasRect.height);
  } else {
    return;
  }
  const boundRect = canvasRect.getBoundingClientRect();
  const canvasLeft = boundRect.left;
  const canvasTop = boundRect.top;

  let x = 0;
  let y = 0;

  canvasRect.onmousedown = function mousedown(e) {
    x = e.clientX - canvasLeft;
    y = e.clientY - canvasTop;
    isMoving = true;
  };

  canvasRect.onmousemove = function mousemove(e) {
    if (!ctx || !isMoving) return;
    const width = e.clientX - canvasLeft - x;
    const height = e.clientY - canvasTop - y;

    ctx.strokeStyle = penColor;
    ctx.lineWidth = penWidth;
    ctx.clearRect(0, 0, canvasRect.width, canvasRect.height);
    ctx.fillRect(0, 0, canvasRect.width, canvasRect.height);
    ctx.strokeRect(x, y, width, height);
  };

  canvasRect.onmouseup = function mouseup(e) {
    ctx.clearRect(0, 0, canvasRect.width, canvasRect.height);
    canvasRect.onmousemove = null;
    isMoving = false;
    const width = e.clientX - canvasLeft - x - 2 * penWidth;
    const height = e.clientY - canvasTop - y - 2 * penWidth;

    html2canvas(document.body, {
      scale: 1,
      useCORS: true,
    }).then((canvas) => {
      let captureX: number;
      let captureY: number;
      if (width > 0) {
        // 从左往右画
        captureX = x + penWidth;
      } else {
        // 从右往左画
        captureX = x + width + penWidth;
      }
      if (height > 0) {
        // 从上往下画
        captureY = y + penWidth;
      } else {
        // 从下往上画
        captureY = y + height + penWidth;
      }

      printClip(
        canvas,
        captureX,
        captureY,
        Math.abs(width),
        Math.abs(height),
        cb
      );
    });
  };
}

function generateTemplate(options: PluginOptions = {}) {
  const div = document.createElement("div");
  div.style.position = "fixed";
  div.style.right = `${options.right || 40}px`;
  div.style.bottom = `${options.bottom || 40}px`;
  div.setAttribute("id", "feedback_unique");

  document.body.appendChild(div);

  const ModalStyle = {
    position: "absolute",
    width: `${options.width || 25}vw`,
    backgroundColor: options.backgroundColor || "#e0eff5",
    padding: "30px 12px",
    right: "-40px",
    bottom: "-40px",
    maxHeight: "100vh",
    minHeight: "400px",
    overflow: "auto",
    overflowX: "hidden",
  };

  const Modal = {
    name: "modal",
    data() {
      return {
        style: {
          ...ModalStyle,
        },
        formItem: {
          input: "",
        },
        isClipping: false,
        screenShoot: [], // 屏幕截图
      };
    },
    methods: {
      handleSubmit(name: string) {
        console.log(this.$refs[name], this.formItem);
      },

      handleShootCallback(base64: string) {
        this.isClipping = false;
        this.screenShoot.push(base64);
      },
    },
    render(h: any) {
      return h(
        "div",
        {
          staticStyle: this.style,
        },
        [
          h("i", {
            staticStyle: {
              position: "absolute",
              top: "0px",
              fontSize: "20px",
              right: "2px",
              cursor: "pointer",
              transition: "transform 0.5s",
            },
            staticClass: "iconfont yiyangjiulipu icon-close",
            on: {
              click: (e: any) => {
                e.stopPropagation();
                this.$emit("closeModal");
              },
              mouseenter() {
                const self: HTMLElement | null = document.querySelector(
                  "i.yiyangjiulipu"
                );
                if (!self) return;
                self.style.transform = "rotate(360deg)";
              },
              mouseleave() {
                const self: HTMLElement | null = document.querySelector(
                  "i.yiyangjiulipu"
                );
                if (!self) return;
                self.style.transform = "rotate(0deg)";
              },
            },
          }),
          h(
            "Form",
            {
              props: {
                inline: true,
                labelWidth: 100,
                value: this.forItem,
              },
              on: {
                input: (value: any) => {
                  console.log(value);
                  this.forItem = value;
                },
              },
              ref: "formInline",
            },
            [
              h(
                "FormItem",
                {
                  staticStyle: {
                    width: "100%",
                  },
                  props: {
                    label: "输入反馈信息",
                  },
                },
                [
                  h("Input", {
                    domProps: {
                      placeholder: "请输入反馈信息",
                    },
                    staticStyle: {
                      maxHeight: "200px",
                      overflow: "auto",
                    },
                    props: {
                      value: this.formItem.input,
                      type: "textarea",
                    },
                    on: {
                      input: (value: string) => {
                        console.log("input", value);
                        this.formItem.input = value;
                      },
                    },
                  }),
                ]
              ),
            ]
          ),
          // 支持在线截屏功能
          h(
            "Button",
            {
              on: {
                click: () => {
                  if (this.isClipping) return;
                  this.isClipping = true;
                  handleClick(this.handleShootCallback.bind(this));
                },
              },
            },
            ["截屏"]
          ),
          h(
            "Button",
            {
              props: {
                type: "primary",
              },
              on: {
                click: () => {
                  this.handleSubmit("formInline");
                },
              },
            },
            ["提交"]
          ),
          h(
            "div",
            {
              staticStyle: {
                display: "flex",
                justifyContent: "space-between",
                maxHeight: "250px",
                overflow: "auto",
                flexWrap: "wrap",
              },
            },
            [
              ...this.screenShoot.map((item: string, index: number) => {
                return h(
                  "div",
                  {
                    staticClass: "image-container",
                    key: item,
                    staticStyle: {
                      width: "calc(12.5vw - 20px)",
                      position: "relative",
                      margin: "auto 0",
                    },
                  },
                  [
                    h("i", {
                      staticClass: "iconfont icon-close",
                      staticStyle: {
                        position: "absolute",
                        right: "0",
                        top: "-4px",
                        cursor: "pointer",
                      },
                      on: {
                        click: () => {
                          this.screenShoot.splice(index, 1);
                        },
                      },
                    }),
                    h("img", {
                      domProps: {
                        src: item,
                      },
                      staticStyle: {
                        width: "100%",
                        objectFit: "scale-down",
                      },
                      key: index,
                    }),
                  ]
                );
              }),
              // 支持手动上传图片
              h("UploadImage", {
                on: {
                  onUploadSuccess: (base64: string) => {
                    this.screenShoot.push(base64);
                  },
                },
              }),
            ]
          ),
        ]
      );
    },
  };

  new Vue({
    components: {
      modal: Modal,
    },
    data() {
      return {
        style: {
          width: "40px",
          height: "40px",
          position: "fixed",
          right: "40px",
          bottom: "40px",
        },
        modalVisible: false,
      };
    },
    methods: {
      handleModalVisible(visible: boolean) {
        if (visible) {
          this.modalVisible = visible;
        }
      },
    },
    // template: `
    // <div :style="style" @click="handleModalVisible(true)">
    //     <img v-if="!modalVisible" src="../static/back.jpg" style="width: 100%;"/>
    //     <modal v-else/>
    // </div>`,
    render(h: any) {
      return h(
        "div",
        {
          style: this.style,
          on: {
            click: () => this.handleModalVisible(true),
          },
        },
        [
          h(
            "transition",
            {
              props: {
                css: false,
              },
              on: {
                beforeEnter(el: HTMLDivElement) {
                  // eslint-disable-next-line no-param-reassign
                  el.style.bottom = "-440px";
                },
                enter(el: HTMLDivElement) {
                  const duration = 400; // 500ms
                  let start: number;

                  function step(timestamp: number) {
                    if (!start) start = timestamp;
                    const elapsed = timestamp - start;
                    const curPosition = -440 + 400 * (elapsed / duration);
                    // eslint-disable-next-line no-param-reassign
                    el.style.bottom = `${curPosition}px`;

                    if (curPosition < -40) {
                      window.requestAnimationFrame(step);
                    }
                  }

                  window.requestAnimationFrame(step);
                },
                leave(el: HTMLDivElement, done: any) {
                  const duration = 400; // 500ms
                  let start: number;

                  function step(timestamp: number) {
                    if (!start) start = timestamp;
                    const elapsed = timestamp - start;
                    const curPosition = -40 - 400 * (elapsed / duration);
                    // eslint-disable-next-line no-param-reassign
                    el.style.bottom = `${curPosition}px`;

                    if (curPosition > -440) {
                      window.requestAnimationFrame(step);
                    } else {
                      done();
                    }
                  }

                  window.requestAnimationFrame(step);
                },
              },
            },
            [
              h(
                "keep-alive",
                {
                  props: {
                    include: "modal",
                  },
                },
                [
                  !this.modalVisible
                    ? h("img", {
                        staticStyle: {
                          width: "100%",
                        },
                        domProps: {
                          src: MessageImg,
                        },
                      })
                    : h("modal", {
                        on: {
                          closeModal: () => {
                            this.modalVisible = false;
                          },
                        },
                      }),
                ]
              ),
            ]
          ),
        ]
      );
    },
  }).$mount("#feedback_unique");

  // div.addEventListener("mouseover", handleMouseEnter);
  // div.addEventListener("mouseout", handleMouseleave);
  // div.addEventListener("click", handleClick);
  return div;
}

let once: any = null;

const FeedPlugin = (function FeedPlugin(options: PluginOptions) {
  this.isRendered = false;
  this.render = function render() {
    if (!this.isRendered) {
      generateTemplate(options);
      this.isRendered = true;
    }
  };
} as any) as FeedPlugin;

const initPlugin = function initPlugin(options: PluginOptions) {
  if (once) return once;
  once = new FeedPlugin(options);
  // 添加用于画框的canvas
  const canvas = document.createElement("canvas");

  const clientWidth =
    document.documentElement.clientWidth || document.body.clientWidth;
  const clientHeight =
    document.documentElement.clientHeight || document.body.clientHeight;
  canvas.width = clientWidth;
  canvas.height = clientHeight;
  canvas.style.position = "fixed";
  canvas.style.left = "0";
  canvas.style.top = "0";
  canvasRect = canvas;

  canvasRect.style.display = "none";

  document.body.appendChild(canvas);
  return once;
};

// eslint-disable-next-line import/prefer-default-export
export { initPlugin };
