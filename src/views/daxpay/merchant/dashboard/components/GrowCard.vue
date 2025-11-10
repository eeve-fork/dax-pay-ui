<template>
  <div class="mer_orderInfo">
    <a-row :gutter="[24, 24]">
      <a-col class="gutter-row" :span="24">
        <a-row :gutter="24">
          <a-col class="gutter-row" :span="15">
            <div class="orderLeft">
              <div class="left_item">
                <div class="common_title">支付订单</div>
                <div class="content_box">
                  <div class="content_item">
                    <div class="left">
                      <div class="title">订单数量</div>
                      <div class="number">
                        <CountTo
                          :startVal="0"
                          :endVal="payData.tradeCount || 0"
                          class="text-24px"
                        />
                      </div>
                    </div>
                    <div class="right"><img src="@/assets/payicon/index_order-1.png" alt="" /></div>
                  </div>
                  <div class="content_item">
                    <div class="left">
                      <div class="title">订单金额</div>
                      <div class="number">
                        <a-statistic
                          :value="payData.tradeAmount || 0"
                          :precision="2"
                          class="text-20px"
                        />
                      </div>
                    </div>
                    <div class="right"><img src="@/assets/payicon/index_order-2.png" alt="" /></div>
                  </div>
                  <div class="content_item">
                    <div class="left">
                      <div class="title">平均单笔金额</div>
                      <div class="number">
                        <a-statistic
                          :value="payData.avgAmount || 0"
                          :precision="2"
                          class="text-20px"
                        />
                      </div>
                    </div>
                    <div class="right"><img src="@/assets/payicon/index_order-3.png" alt="" /></div>
                  </div>
                  <div class="content_item">
                    <div class="left">
                      <div class="title">最大单笔金额</div>
                      <div class="number">
                        <a-statistic
                          :value="payData.maxAmount || 0"
                          :precision="2"
                          class="text-20px"
                        />
                      </div>
                    </div>
                    <div class="right"><img src="@/assets/payicon/index_order-4.png" alt="" /></div>
                  </div>
                </div>
              </div>
              <div class="left_item">
                <div class="common_title">退款订单</div>
                <div class="content_box">
                  <div class="content_item">
                    <div class="left">
                      <div class="title">订单数量</div>
                      <div class="number">
                        <CountTo
                          :startVal="0"
                          :endVal="refundData.tradeCount || 0"
                          class="text-24px"
                        />
                      </div>
                    </div>
                    <div class="right">
                      <img src="@/assets/payicon/index_order-1.png" alt="" />
                    </div>
                  </div>
                  <div class="content_item">
                    <div class="left">
                      <div class="title">订单金额</div>
                      <div class="number">
                        <a-statistic
                          :value="refundData.tradeAmount || 0"
                          :precision="2"
                          class="text-20px"
                        />
                      </div>
                    </div>
                    <div class="right">
                      <img src="@/assets/payicon/index_order-2.png" alt="" />
                    </div>
                  </div>
                  <div class="content_item">
                    <div class="left">
                      <div class="title">平均单笔金额</div>
                      <div class="number">
                        <a-statistic
                          :value="refundData.avgAmount || 0"
                          :precision="2"
                          class="text-20px"
                        />
                      </div>
                    </div>
                    <div class="right"
                      ><img src="@/assets/payicon/index_order-3.png" alt="" />
                    </div>
                  </div>
                  <div class="content_item">
                    <div class="left">
                      <div class="title">最大单笔金额</div>
                      <div class="number">
                        <a-statistic
                          :value="refundData.maxAmount || 0"
                          :precision="2"
                          class="text-20px"
                        />
                      </div>
                    </div>
                    <div class="right">
                      <img src="@/assets/payicon/index_order-4.png" alt="" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </a-col>
          <a-col class="gutter-row" :span="9">
            <div class="orderRight">
              <div class="common_title">通知公告</div>
              <div class="adverse_content">
                <div class="adverse_item" v-for="item in 15" :key="item">
                  <div class="left">公告功能现在尚未开发完成，请耐心等待！</div>
                  <div class="date">2025-06-01</div>
                </div>
              </div>
            </div>
          </a-col>
        </a-row>
      </a-col>
    </a-row>
  </div>
</template>
<script lang="ts" setup>
  import { CountTo } from '@/components/CountTo'
  import { reactive, ref, watch } from 'vue'
  import { MerchantStatusEnum } from '@/enums/daxpay/daxpayEnum'
  import { payTradeReport, rfdTradeReport, TradeReportResult, getShopInfo } from '../IndexRepot.api'

  const props = defineProps({
    dateObj: {
      type: Object,
      default: () => {},
    },
  })

  const query = reactive({
    startDate: '',
    endDate: '',
  })

  const payData = ref<TradeReportResult>({})
  const refundData = ref<TradeReportResult>({})
  const infoData = ref<any>({})

  //监听查询标识 重新查询
  watch(
    () => props.dateObj.sign,
    () => {
      initData() //调用数据
    },
    {
      deep: true,
      immediate: true,
    },
  )

  /**
   * 初始化数据
   */
  function initData() {
    query.startDate = props.dateObj.startDate
    query.endDate = props.dateObj.endDate
    // 支付订单
    payTradeReport(query).then(({ data }) => {
      payData.value = data
    })
    // 退款订单
    rfdTradeReport(query).then(({ data }) => {
      refundData.value = data
    })
    getShopInfo().then(({ data }) => {
      infoData.value = data
    })
  }
</script>
<style lang="scss" scoped>
  .mer_orderInfo {
    //公共标题
    .common_title {
      box-sizing: border-box;
      font-size: 18px;
      width: 100%;
      padding-left: 16px;
      position: relative;
      display: flex;
      align-items: center;
      color: #2e3853;
      font-size: 18px;
      font-weight: 600;
      &::before {
        position: absolute;
        left: 0;
        content: '';
        width: 4px;
        height: 17px;
        background-color: #4073e1;
        border-radius: 0px 10px 10px 0px;
      }
    }
    .orderTop {
      display: flex;
      padding: 25px 20px;
      box-sizing: border-box;
      height: 140px;
      width: 100%;
      background-color: #fff;
      border-radius: 10px;
      .logoBox {
        img {
          height: 67px;
        }
      }
      .boxTitle {
        margin-left: 23px;
        .title {
          font-size: 24px;
          color: #2567d1;
          font-weight: 600;
        }
        .info {
          display: flex;
          flex-wrap: wrap;
          width: 500px;
          .info_item {
            width: 45%;
            margin-top: 10px;
            font-size: 16px;
            color: #000000;
            span {
              font-weight: 600;
            }
          }
        }
      }
    }
    .orderLeft {
      height: 372px;
      border-radius: 10px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      .left_item {
        box-sizing: border-box;
        height: 48%;
        padding: 20px 0px;
        border-radius: 10px;
        background-color: #fff;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        gap: 20px;
        .content_box {
          box-sizing: border-box;
          padding: 0px 16px;
          display: flex;
          gap: 16px;
          .content_item {
            box-sizing: border-box;
            background-color: #f9fbff;
            border-radius: 10px;
            flex: 1;
            display: flex;
            align-items: flex-end;
            justify-content: space-between;
            padding: 12px 14px;
            .left {
              display: flex;
              flex-direction: column;
              gap: 14px;
              .title {
                font-size: 21px;
                color: #000000;
              }
              .number {
                font-size: 35px;
                color: #303133;
              }
            }
            .right {
              img {
                width: 53px;
                height: 53px;
              }
            }
          }
        }
      }
    }
    .orderRight {
      height: 372px;
      padding: 27px 0px 10px;
      background-color: #ffffff;
      box-sizing: border-box;
      border-radius: 10px;
      display: flex;
      flex-direction: column;
      gap: 13px;
      .adverse_content {
        padding: 0px 20px 0px;
        height: calc(100% - 47px);
        box-sizing: border-box;
        overflow: scroll;
        .adverse_item {
          display: flex;
          margin-bottom: 6px;
          box-sizing: border-box;
          justify-content: space-between;
          font-size: 14px;
          gap: 20px;
          .left {
            color: #606266;
            flex: 1;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            &:hover {
              color: red;
              cursor: pointer;
            }
          }
          .date {
            width: 75px;
            color: #909399;
          }
        }
      }
    }
    
    // 响应式设计
    @media (max-width: 1200px) {
      .common_title {
        font-size: 16px;
        padding-left: 14px;
        &::before {
          width: 3px;
          height: 15px;
          border-radius: 0px 8px 8px 0px;
        }
      }
      .orderTop {
        padding: 20px 16px;
        height: 120px;
        border-radius: 8px;
        .logoBox img {
          height: 56px;
        }
        .boxTitle {
          margin-left: 18px;
          .title {
            font-size: 20px;
          }
          .info {
            width: 420px;
            .info_item {
              margin-top: 8px;
              font-size: 14px;
            }
          }
        }
      }
      .orderLeft {
        height: 320px;
        border-radius: 8px;
        .left_item {
          padding: 16px 0px;
          border-radius: 8px;
          gap: 16px;
          .content_box {
            padding: 0px 14px;
            gap: 14px;
            .content_item {
              border-radius: 8px;
              padding: 10px 12px;
              .left {
                gap: 12px;
                .title {
                  font-size: 18px;
                }
                .number {
                  font-size: 30px;
                }
              }
              .right img {
                width: 45px;
                height: 45px;
              }
            }
          }
        }
      }
      .orderRight {
        height: 320px;
        padding: 22px 0px 8px;
        border-radius: 8px;
        gap: 11px;
        .adverse_content {
          padding: 0px 16px 0px;
          height: calc(100% - 40px);
          .adverse_item {
            margin-bottom: 5px;
            font-size: 12px;
            gap: 16px;
            .date {
              width: 65px;
            }
          }
        }
      }
    }
    
    @media (max-width: 768px) {
      .common_title {
        font-size: 14px;
        padding-left: 12px;
        &::before {
          width: 2px;
          height: 12px;
          border-radius: 0px 6px 6px 0px;
        }
      }
      .orderTop {
        padding: 16px 12px;
        height: 100px;
        border-radius: 6px;
        flex-direction: column;
        align-items: center;
        text-align: center;
        .logoBox img {
          height: 40px;
        }
        .boxTitle {
          margin-left: 0;
          margin-top: 8px;
          .title {
            font-size: 16px;
          }
          .info {
            width: 100%;
            justify-content: center;
            .info_item {
              width: 48%;
              margin-top: 6px;
              font-size: 12px;
            }
          }
        }
      }
      .orderLeft {
        height: 280px;
        border-radius: 6px;
        .left_item {
          padding: 12px 0px;
          border-radius: 6px;
          gap: 12px;
          .content_box {
            padding: 0px 10px;
            gap: 10px;
            .content_item {
              border-radius: 6px;
              padding: 8px 10px;
              .left {
                gap: 8px;
                .title {
                  font-size: 14px;
                }
                .number {
                  font-size: 24px;
                }
              }
              .right img {
                width: 35px;
                height: 35px;
              }
            }
          }
        }
      }
      .orderRight {
        height: 280px;
        padding: 16px 0px 6px;
        border-radius: 6px;
        gap: 8px;
        .adverse_content {
          padding: 0px 12px 0px;
          height: calc(100% - 32px);
          .adverse_item {
            margin-bottom: 4px;
            font-size: 10px;
            gap: 12px;
            .date {
              width: 55px;
            }
          }
        }
      }
    }
  }
</style>
