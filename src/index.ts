import html2canvas from "html2canvas";
// eslint-disable-next-line import/extensions
// import Vue from "vue/dist/vue.esm.js";
import Vue from "vue";
import Input from "view-design/src/components/input";
import Form from "view-design/src/components/form";
import FormItem from "view-design/src/components/form-item";
import Button from "view-design/src/components/button";

import "view-design/dist/styles/iview.css";

Vue.component("Input", Input);
Vue.component("Form", Form);
Vue.component("FormItem", FormItem);
Vue.component("Button", Button);

// const instance = null;
// const uniqueKey = "12345678"; // 后续可以改为16位唯一的字符串

// let isMouseEnter = false;

let canvasRect: HTMLCanvasElement;

let isMoving = false;

const penColor = "#ff0000";
const penWidth = 2;

// const placeholder = `
//   <div style="height: 100%">
//     <img src="../static/back.jpg" style="height: 100%"/>
//   </div>
//   `;

// function handleMouseEnter() {
//   if (isMouseEnter) return;
//   isMouseEnter = true;
//   this.innerHTML = `
//     <div>
//       打开
//     </div>
//   `;
// }

// function handleMouseleave() {
//   if (!isMouseEnter) return;
//   isMouseEnter = false;
//   this.innerHTML = placeholder;
// }

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

  // 隐藏canvas
  canvasRect.style.display = "none";

  // 生成图片
  // const clipImg = new Image();
  // clipImg.src = clipImgBase64;
  // downloadIamge(clipImgBase64);
}

function handleClick(cb: ShootCallback) {
  canvasRect.style.display = "block";

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
    const ctx = canvasRect.getContext("2d");
    if (!ctx || !isMoving) return;
    const width = e.clientX - canvasLeft - x;
    const height = e.clientY - canvasTop - y;

    ctx.strokeStyle = penColor;
    ctx.lineWidth = penWidth;
    ctx.clearRect(0, 0, canvasRect.width, canvasRect.height);
    ctx.strokeRect(x, y, width, height);
  };

  canvasRect.onmouseup = function mouseup(e) {
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

function generateTemplate() {
  const div = document.createElement("div");
  div.style.position = "fixed";
  div.style.width = "40px";
  div.style.height = "40px";
  div.style.right = "40px";
  div.style.bottom = "40px";
  div.style.backgroundColor = "aqua";
  div.setAttribute("id", "feedback_unique");

  document.body.appendChild(div);
  // div.innerHTML = placeholder;

  const Modal = {
    data() {
      return {
        style: {
          position: "absolute",
          width: "20vw",
          backgroundColor: "#adefe0",
          right: 0,
          bottom: "-40px",
        },
        formItem: {
          input: "",
        },
        screenShoot: [], // 屏幕截图
      };
    },
    methods: {
      handleSubmit(name: string) {
        console.log(this.$refs[name], this.formItem);
      },

      handleShootCallback(base64: string) {
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
                  props: {
                    label: "输入反馈信息",
                  },
                },
                [
                  h("Input", {
                    domProps: {
                      placeholder: "请输入反馈信息",
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
            "a",
            {
              on: {
                click: () => {
                  console.log("开始截屏");
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
          [
            ...this.screenShoot.map((item: string, index: number) => {
              return h("img", {
                domProps: {
                  src: item,
                },
                key: index,
              });
            }),
          ],
        ]
      );
    },
    // template: `
    //   <div :style="style">
    //     modal
    //   </div>
    // `,
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
          !this.modalVisible
            ? h("img", {
                staticStyle: {
                  width: "100%",
                },
                domProps: {
                  src: "../static/back.jpg",
                },
              })
            : h("modal"),
        ]
      );
    },
  }).$mount("#feedback_unique");

  // div.addEventListener("mouseover", handleMouseEnter);
  // div.addEventListener("mouseout", handleMouseleave);
  // div.addEventListener("click", handleClick);
  return div;
}

(function a() {
  // 从localstorage中判断当前是否存在实例
  // const ins = localStorage.getItem(uniqueKey);

  generateTemplate();

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
})();
