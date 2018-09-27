Component({
    /**
     * 组件的属性列表
     */
    properties: {
        content: {
            type: Object,
            value: {}
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
        timeTableData: []
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
        let str = this.properties.content.body;
        let text = '', arr = [], htmlArray = [];
        for (let i in str) {
            if ('<>'.indexOf(str.charAt(i)) >= 0) {
                if ([...arr].pop() == '<' && text.indexOf('/') < 0) {
                    htmlArray.push({
                        name: text,
                        attrs: {
                            class: '',
                            style: 'h1h2h3h4h5h6'.indexOf(text) >= 0 ? 'font-size: 16px;height: 30px;line-height: 30px;white-space: nowrap' : 'list-style: none;line-height: 30px;font-size: 14px;color: #666;height: 30px;white-space: nowrap'
                        }
                    })
                }
                if ([...arr].pop() == '>') {
                    text ? htmlArray[htmlArray.length - 1].children = [{
                        type: 'text',
                        text: text
                    }] : []
                }
                text ? arr.push(text) : '';
                arr.push(str.charAt(i));
                text = '';
            } else {
                text += str.charAt(i);
            }
        }
        this.setData({
            timeTableData: htmlArray
        })
    }
})
