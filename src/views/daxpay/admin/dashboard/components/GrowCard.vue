<template>
  <div class="orderInfo">
    <a-row :gutter="24">
      <!-- 左边订单 -->
      <a-col class="gutter-row" :span="15">
        <div class="left_box">
          <div class="left_item">
            <div class="common_title">支付订单</div>
            <div class="content_box">
              <div class="content_item">
                <div class="left">
                  <div class="title">订单数量</div>
                  <div class="number">
                    <CountTo :startVal="0" :endVal="payData.tradeCount || 0" class="text-24px" />
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
                    <a-statistic :value="payData.avgAmount || 0" :precision="2" class="text-20px" />
                  </div>
                </div>
                <div class="right"><img src="@/assets/payicon/index_order-3.png" alt="" /></div>
              </div>
              <div class="content_item">
                <div class="left">
                  <div class="title">最大单笔金额</div>
                  <div class="number">
                    <a-statistic :value="payData.maxAmount || 0" :precision="2" class="text-20px" />
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
                    <CountTo :startVal="0" :endVal="refundData.tradeCount || 0" class="text-24px" />
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
                <div class="right"><img src="@/assets/payicon/index_order-3.png" alt="" /> </div>
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
      <!-- 右边 -->
      <a-col class="gutter-row" :span="9">
        <div class="right_box">
          <!-- 广告 -->
          <div class="adverseBox">
            <div class="common_title">通知公告</div>
            <div class="adverse_content">
              <div class="adverse_item" v-for="item in 15" :key="item">
                <div class="left">公告功能现在尚未开发完成，请耐心等待！</div>
                <div class="date">2025-06-01</div>
              </div>
            </div>
          </div>
          <!-- 商户信息 -->
          <div class="busInform">
            <div class="common_title">商户信息</div>
            <div class="bus_content">
              <div class="bus_item">
                <div class="title">商户</div>
                <div class="number">
                  <CountTo :startVal="0" :endVal="mchData.normalCount || 0" />
                </div>
              </div>
              <div class="bus_item">
                <div class="title">应用</div>
                <div class="number">
                  <CountTo :startVal="0" :endVal="mchData.partnerCount || 0" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </a-col>
    </a-row>
  </div>
</template>
<script lang="ts" setup>
  import { CountTo } from '@/components/CountTo'
  import { reactive, ref, watch } from 'vue'
  // import { toDateString } from 'xe-utils'
  import {
    merchantCountReport,
    MerchantReportResult,
    payTradeReport,
    rfdTradeReport,
    TradeReportResult,
  } from '../IndexRepot.api'

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
  const mchData = ref<MerchantReportResult>({})

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
    // 商户信息
    merchantCountReport(query).then(({ data }) => {
      mchData.value = data
    })
  }
</script>
<style lang="scss" scoped>
  .orderInfo {
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
    .left_box {
      height: 480px;
      display: flex;
      flex-direction: column;
      gap: 20px;
      .left_item {
        box-sizing: border-box;
        height: 50%;
        padding: 20px 0px;
        border-radius: 10px;
        background: #ffffff;
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
    .right_box {
      height: 480px;
      display: flex;
      flex-direction: column;
      gap: 20px;
      .adverseBox {
        height: 50%;
        padding: 27px 0px 10px;
        background-color: #ffffff;
        box-sizing: border-box;
        border-radius: 10px;
        display: flex;
        flex-direction: column;
        gap: 13px;
        .adverse_content {
          padding: 0px 20px;
          height: 158px;
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
      .busInform {
        height: 50%;
        box-sizing: border-box;
        padding: 27px 0px 26px;
        background-color: #ffffff;
        border-radius: 10px;
        display: flex;
        flex-direction: column;
        gap: 13px;
        .bus_content {
          width: 100%;
          box-sizing: border-box;
          padding: 0px 21px;
          display: flex;
          justify-content: space-between;
          gap: 21px;
          flex-wrap: wrap;
          .bus_item {
            box-sizing: border-box;
            width: 46%;
            padding: 11px 13px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            background-color: #f9fbff;
            border-radius: 10px;
            .title {
              font-size: 18px;
              color: #000000;
            }
            .number {
              font-size: 30px;
              color: #303133;
            }
          }
        }
      }
    }
  }

  // 响应式设计
  @media (max-width: 1200px) {
    .orderInfo {
      .common_title {
        font-size: 16px;
        padding-left: 14px;
        &::before {
          width: 3px;
          height: 15px;
          border-radius: 0px 8px 8px 0px;
        }
      }
      .left_box {
        height: 420px;
        gap: 18px;
        .left_item {
          padding: 18px 0px;
          border-radius: 8px;
          gap: 18px;
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
              .right {
                img {
                  width: 45px;
                  height: 45px;
                }
              }
            }
          }
        }
      }
      .right_box {
        height: 420px;
        gap: 18px;
        .adverseBox {
          padding: 24px 0px 8px;
          border-radius: 8px;
          gap: 11px;
          .adverse_content {
            padding: 0px 18px;
            height: 140px;
            .adverse_item {
              margin-bottom: 5px;
              font-size: 12px;
              gap: 18px;
              .date {
                width: 65px;
              }
            }
          }
        }
        .busInform {
          padding: 24px 0px 22px;
          border-radius: 8px;
          gap: 11px;
          .bus_content {
            padding: 0px 18px;
            gap: 18px;
            .bus_item {
              padding: 9px 11px;
              border-radius: 8px;
              .title {
                font-size: 16px;
              }
              .number {
                font-size: 26px;
              }
            }
          }
        }
      }
    }
  }

  @media (max-width: 768px) {
    .orderInfo {
      .common_title {
        font-size: 14px;
        padding-left: 12px;
        &::before {
          width: 2px;
          height: 12px;
          border-radius: 0px 6px 6px 0px;
        }
      }
      .left_box {
        height: auto;
        gap: 15px;
        .left_item {
          padding: 15px 0px;
          border-radius: 6px;
          gap: 15px;
          .content_box {
            padding: 0px 12px;
            gap: 12px;
            flex-direction: column;
            .content_item {
              border-radius: 6px;
              padding: 8px 10px;
              .left {
                gap: 10px;
                .title {
                  font-size: 16px;
                }
                .number {
                  font-size: 24px;
                }
              }
              .right {
                img {
                  width: 35px;
                  height: 35px;
                }
              }
            }
          }
        }
      }
      .right_box {
        height: auto;
        gap: 15px;
        .adverseBox {
          padding: 20px 0px 6px;
          border-radius: 6px;
          gap: 9px;
          .adverse_content {
            padding: 0px 15px;
            height: 120px;
            .adverse_item {
              margin-bottom: 4px;
              font-size: 11px;
              gap: 15px;
              .date {
                width: 55px;
              }
            }
          }
        }
        .busInform {
          padding: 20px 0px 18px;
          border-radius: 6px;
          gap: 9px;
          .bus_content {
            padding: 0px 15px;
            gap: 15px;
            .bus_item {
              width: 100%;
              padding: 8px 10px;
              border-radius: 6px;
              .title {
                font-size: 14px;
              }
              .number {
                font-size: 22px;
              }
            }
          }
        }
      }
    }
  }

  .text-20px {
    font-size: 20px;

    @media (max-width: 1200px) {
      font-size: 18px;
    }

    @media (max-width: 768px) {
      font-size: 16px;
    }
  }
</style>
