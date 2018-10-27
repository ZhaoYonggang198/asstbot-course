Component({
    /**
     * 组件的属性列表
     */
    properties: {
        content: {
            type: Object,
            value: {},
            observer: function (val) {
                let htmlStr = val.body.replace(/<\s*/g, '<').replace(/\s*>/g, '>').replace(/<\/\s*/g, '</').replace(/style\=\s*/g, 'style=')
                this.setData({
                    htmlStr: htmlStr
                })
            }
        },
        style: {
            type: Object,
            value: {}
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        timeTableData: [],
        htmlStr: ""

    },

    /**
     * 组件的方法列表
     */
    methods: {

    },

    /**
     * 组件实例进入页面节点树时执行
     */
    attached: function () {

    }
})
