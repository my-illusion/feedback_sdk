<template>
    <Upload
        ref="upload"
        :show-upload-list="false"
        :format="['jpg','jpeg','png']"
        :max-size="2048"
        :before-upload="handleBeforeUpload"
        multiple
        type="drag"
        style="display: inline-block;width:calc(12.5vw - 20px);">
        <div style="width:100%;height:100px;line-height: 100px;">
            <Icon className="icon-camera" :size="36"></Icon>
        </div>
    </Upload>
</template>

<script>
import Upload from "view-design/src/components/upload"
import Icon from "./Icon.vue"

import { getBase64 } from './utils'
export default {
    components: {
        Upload,
        Icon
    },
    data() {
        return {
            uploadList: []
        }
    },
    methods: {
        handleBeforeUpload(file) {
            console.log(file)
            getBase64(file)
                .then(base64 => {
                    // 返回上传结果
                    this.$emit("onUploadSuccess", base64)
                })
            return false
        }
    }
}
</script>