Component({
    /**
     * 组件的属性列表
     */
    properties: {
        content: {
            type: Object,
            value: {},
            observer: function(value){
                console.log(value)
            }
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
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
