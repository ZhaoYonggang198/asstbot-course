<template lang='pug'>
view(style="padding-bottom:20rpx;")
  view(class="weui-cell")
    view(class="weui-cell__hd")
      view(class="weui-label") {{label}}
    view(class="weui-cell__bd")
      block(v-if="inputId=='name'")
        input(:value="displayValue" class="weui-input" :placeholder="placeholder" focus
          @input="valueChange"
          @confirm="valueConfirm"
          @focus="onFocus"
          @blur="onBlur")
      block(v-else)
        input(:value="displayValue" class="weui-input" :placeholder="placeholder"
          @input="valueChange"
          @confirm="valueConfirm"
          @focus="onFocus"
          @blur="onBlur")
  view(class="select-list" :class="selectListShow")
    block(v-for="(item, index) in displaySelectlist" :key="item")
      view(class="weui-cell" @click="select(item)")
        view(class="weui-cell__hd")
          view(class="weui-label")          
        view(class="weui-cell__bd") 
          icon(class="weui-icon-checkbox_circle" type="circle" size="13")
          view {{item}}
</template>

<script>
export default {
  data () {
    return {
      displayValue: ''
    }
  },
  props: {
    label: {type: String, default: ''},
    placeholder: {type: String, default: ''},
    selectlist: {type: Array, default: ''},
    value: {type: String, default: ''},
    inputId: {type: String, default: ''},
    currentfocus: {type: String, default: ''},
    validator: {type: RegExp}
  },
  computed: {
    displaySelectlist () {
      if (!this.selectlist) {
        return []
      }

      return this.selectlist.filter((item) => {
        return (this.displayValue === '') || (item.indexOf(this.displayValue) !== -1 && item !== this.displayValue)
      })
    },
    selectListShow () {
      if (this.currentfocus !== this.inputId) {
        return 'hidden'
      } else {
        return `show element-${this.displaySelectlist.length}`
      }
    }
  },
  methods: {
    valueConfirm (event) {
      this.displayValue = event.mp.detail.value
      this.$emit('change', this.displayValue)
    },

    valueChange (event) {
      this.displayValue = event.mp.detail.value
    },

    onFocus (event) {
      this.$emit('focuson', event)
    },

    onBlur () {
      this.$emit('change', this.displayValue)
    },

    select (item) {
      this.displayValue = item
      this.$emit('change', this.displayValue)
    }

  },
  onLoad () {
    this.displayValue = this.value
  }
}
</script>

<style scoped>

.weui-input {
  font-size: 28rpx;
  border-bottom: solid 1rpx #d6d8d8;
}

.weui-cells:after {
  border: none;
}

.weui-cell {
  padding-bottom: 0rpx;
}

.weui-cell:before {
  display: none;
}

.select-list {
  max-height: 125px;
  overflow: auto;
}

.select-list .weui-cell {
  color: #666;
  font-size: 26rpx;
  padding-top: 0rpx;
  padding-bottom: 0rpx;
}

.select-list .weui-cell__bd {
  display: flex;
  flex-direction: row;
  background:#f6f6f6;
  padding-top: 5rpx;
  padding-bottom: 5rpx;
}

.select-list.hidden, .select-list.show.element-0{
  height: 0;
}

.select-list.show.element-1{
  height: 25px;
}

.select-list.show.element-2{
  height: 50px;
}

.select-list.show.element-3{
  height: 75px;
}

.select-list.show.element-4{
  height: 100px;
}

.select-list.show{
  height: 125px;
}

</style>