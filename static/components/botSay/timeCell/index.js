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
        timeTableData: ''
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
                            style: this.properties.style[text] || 'h1h2h3h4h5h6'.indexOf(text) >= 0 ? 'font-weight:500' : 'list-style:none'
                        }
                    })
                }
                if ([...arr].pop() == '>') {
                    text ? htmlArray[htmlArray.length - 1].children = {
                        type: 'text',
                        text: text
                    } : ''
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
