<template>
    <view class="dictation-index-container">
      <title-bar title="听写"/>
      <view class="dictation-index-inner">
        <view class="dictation-index-top">
          <view class="dictation-index-row"></view>
          <view class="dictation-index-col"></view>
        </view>
        <view class="dictation-index-bottom">
          <text class="dictation-index-word">查看列表</text>
        </view>
      </view>
    </view>
</template>

<script>
  export default {
  }
</script>

<style scoped>
  .dictation-index-container{
    width: 100vw;
    height: 100vh;
    display: flex;
    flex-direction: column;
    background: #fff;
  }
  .dictation-index-inner{
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  .dictation-index-top{
    width: 80px;
    height: 80px;
    border-radius: 50%;
    border: 5px solid #ccc;
    margin-bottom: 40px;
    position: absolute;
  }
  .dictation-index-row{
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto auto;
    width: 30px;
    height: 5px;
    background: #ccc;
    border-radius: 8px;
  }
  .dictation-index-col{
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto auto;
    width: 5px;
    height: 30px;
    background: #ccc;
    border-radius: 8px;
  }
  .dictation-index-bottom{
    line-height: 60px;
    text-align: center;
  }
  .dictation-index-word{
    padding-bottom: 10px;
    border-bottom: 1px solid #d8d8d8;
    font-size: 24px;
  }
</style>
