
# feedback_sdk
基于 Vue / iview 开发的用于系统提交反馈的小插件
# feature
1、基于vue开发，可以根据实际的业务需求进行二次扩展  
2、反馈支持直接在当前系统区域框选同时支持从本地上传图片

# install

##### 支持npm和yarn安装
```js
    npm install feedback_sdk
    yarn add feedback_sdk
```
##### 支持全局引入
```html
    <script src="./es/feedback_sdk.umd.js"></script>
```
# use

```js
    const FeedbackPlugin = window.FeedbackPlugin
    const plugin = FeedbackPlugin.initPlugin({
        // backgroundColor: "red",
        // width: 25
    })
    plugin.render()


    import { FeedbackPlugin } from "feedback_sdk"
    const plugin = FeedbackPlugin.initPlugin({
        // backgroundColor: "red",
        // width: 25
    })
    plugin.render()
```

# notice

插件使用单例模式，多次渲染、多次调用render方法均不影响正常使用