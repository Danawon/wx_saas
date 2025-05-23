<template>
  <canvas type="2d" v-if="isUseNewCanvas" class="ec-canvas" :canvas-id="canvasId" @init="init" @touchstart="touchStart"
    @touchmove="touchMove" @touchend="touchEnd">
  </canvas>
  <canvas v-else class="ec-canvas" :canvas-id="canvasId" @init="init" @touchstart="touchStart" @touchmove="touchMove"
    @touchend="touchEnd">
  </canvas>
</template>

<script>
  import WxCanvas from "./wx-canvas";
  import * as echarts from "./echarts.min.js";
  let ctx;
  function wrapTouch(event) {
    for (let i = 0; i < event.touches.length; ++i) {
      const touch = event.touches[i];
      touch.offsetX = touch.x;
      touch.offsetY = touch.y;
    }
    return event;
  }
  export default {
    props: {
      canvasId: {
        type: String,
        default: () => {
          return "ec-canvas";
        }
      },
      ec: {
        type: Object
      },
      forceUseOldCanvas: {
        type: Boolean,
        value: false
      }
    },
    data() {
      return {
        $curChart: {},
        toHandleList: [],
        isUseNewCanvas: true
      };
    },
    watch: {
      "ec.option": {
        deep: true,
        handler(val, oldVal) {
          this.setOption(val);
        }
      }
    },
    onReady: function() {
      if (!this.ec) {
        console.warn(
          '组件需绑定 ec 变量，例：<ec-canvas id="mychart-dom-bar" ' +
          'canvas-id="mychart-bar" ec="{{ ec }}"></ec-canvas>'
        );
        return;
      }
      if (!this.ec.lazyLoad) {
        this.init();
      }
    },
    methods: {
      compareVersion(v1, v2) {
        v1 = v1.split(".");
        v2 = v2.split(".");
        const len = Math.max(v1.length, v2.length);

        while (v1.length < len) {
          v1.push("0");
        }
        while (v2.length < len) {
          v2.push("0");
        }

        for (let i = 0; i < len; i++) {
          const num1 = parseInt(v1[i]);
          const num2 = parseInt(v2[i]);

          if (num1 > num2) {
            return 1;
          } else if (num1 < num2) {
            return -1;
          }
        }
        return 0;
      },
      init(callback) {
        const version = wx.getAppBaseInfo().SDKVersion;

        let canUseNewCanvas = this.compareVersion(version, "2.9.0") >= 0;
        if (this.forceUseOldCanvas) {
          if (canUseNewCanvas) console.warn("开发者强制使用旧canvas,建议关闭");
          canUseNewCanvas = false;
        }
        this.isUseNewCanvas = canUseNewCanvas && !this.forceUseOldCanvas;
        if (this.isUseNewCanvas) {
          console.log('微信基础库版本大于2.9.0，开始使用<canvas type="2d"/>');
          // 2.9.0 可以使用 <canvas type="2d"></canvas>
          this.initByNewWay(callback);
        } else {
          const isValid = this.compareVersion(version, "1.9.91") >= 0;
          if (!isValid) {
            console.error(
              "微信基础库版本过低，需大于等于 1.9.91。" +
              "参见：https://github.com/ecomfe/echarts-for-weixin" +
              "#%E5%BE%AE%E4%BF%A1%E7%89%88%E6%9C%AC%E8%A6%81%E6%B1%82"
            );
            return;
          } else {
            console.warn(
              "建议将微信基础库调整大于等于2.9.0版本。升级后绘图将有更好性能"
            );
            this.initByOldWay(callback);
          }
        }
      },
      initByOldWay(callback) {
        // 1.9.91 <= version < 2.9.0：原来的方式初始化
        ctx = wx.createCanvasContext(this.canvasId, this);
        const canvas = new WxCanvas(ctx, this.canvasId, false);
        const that = this
        echarts.setCanvasCreator(() => {
          return canvas;
        });
        // const canvasDpr = wx.getSystemInfoSync().pixelRatio // 微信旧的canvas不能传入dpr
        const canvasDpr = 1;
        var query = wx.createSelectorQuery().in(this);
        query
          .select(".ec-canvas")
          .boundingClientRect(res => {
            if (typeof callback === "function") {
              that.$curChart = callback(canvas, res.width, res.height, canvasDpr);
            } else if (that.ec) {
              that.initChart(canvas, res.width, res.height, canvasDpr)
            } else {
              that.triggerEvent("init", {
                canvas: canvas,
                width: res.width,
                height: res.height,
                devicePixelRatio: canvasDpr // 增加了dpr，可方便外面echarts.init
              });
            }
          })
          .exec();
      },
      initByNewWay(callback) {
        const that = this
        // version >= 2.9.0：使用新的方式初始化
        const query = wx.createSelectorQuery().in(this);
        query
          .select(".ec-canvas")
          .fields({
            node: true,
            size: true
          })
          .exec(res => {
            const canvasNode = res[0].node;

            const canvasDpr = wx.getWindowInfo().pixelRatio;
            const canvasWidth = res[0].width;
            const canvasHeight = res[0].height;

            const ctx = canvasNode.getContext("2d");

            const canvas = new WxCanvas(ctx, that.canvasId, true, canvasNode);
            echarts.setCanvasCreator(() => {
              return canvas;
            });

            if (typeof callback === "function") {
              that.$curChart = callback(
                canvas,
                canvasWidth,
                canvasHeight,
                canvasDpr
              );
            } else if (that.ec) {
              that.initChart(canvas, canvasWidth, canvasHeight, canvasDpr)
            } else {
              that.triggerEvent("init", {
                canvas: canvas,
                width: canvasWidth,
                height: canvasHeight,
                devicePixelRatio: canvasDpr
              });
            }
          });
      },
      setOption(val) {
        if (!this.$curChart || !this.$curChart.setOption) {
          this.toHandleList.push(val);
        } else {
          this.$curChart.setOption(val);
        }
      },
      canvasToTempFilePath(opt) {
        if (this.isUseNewCanvas) {
          // 新版
          const query = wx.createSelectorQuery().in(this);
          query
            .select(".ec-canvas")
            .fields({
              node: true,
              size: true
            })
            .exec(res => {
              const canvasNode = res[0].node;
              opt.canvas = canvasNode;
              wx.canvasToTempFilePath(opt);
            });
        } else {
          // 旧的
          if (!opt.canvasId) {
            opt.canvasId = this.canvasId;
          }
          ctx.draw(true, () => {
            wx.canvasToTempFilePath(opt, this);
          });
        }
      },

      touchStart(e) {
        if (this.ec.stopTouchEvent) {
          e.preventDefault();
          e.stopPropagation();
          return;
        }
        this.$emit("touchstart", e);
        if (this.$curChart && e.touches.length > 0) {
          var touch = e.touches[0];
          var handler = this.$curChart.getZr().handler;
          if (handler) {
            handler.dispatch("mousedown", {
              zrX: touch.x,
              zrY: touch.y
            });
            handler.dispatch("mousemove", {
              zrX: touch.x,
              zrY: touch.y
            });
            handler.processGesture(wrapTouch(e), "start");
          }
        }
      },

      touchMove(e) {
        if (this.ec.stopTouchEvent) {
          e.preventDefault();
          e.stopPropagation();
          return;
        }
        this.$emit("touchmove", e);
        if (this.$curChart && e.touches.length > 0) {
          var touch = e.touches[0];
          var handler = this.$curChart.getZr().handler;
          if (handler) {
            handler.dispatch("mousemove", {
              zrX: touch.x,
              zrY: touch.y
            });
            handler.processGesture(wrapTouch(e), "change");
          }
        }
      },

      touchEnd(e) {
        if (this.ec.stopTouchEvent) {
          e.preventDefault();
          e.stopPropagation();
          return;
        }
        this.$emit("touchend", e);
        if (this.$curChart) {
          const touch = e.changedTouches ? e.changedTouches[0] : {};
          var handler = this.$curChart.getZr().handler;
          if (handler) {
            handler.dispatch("mouseup", {
              zrX: touch.x,
              zrY: touch.y
            });
            handler.dispatch("click", {
              zrX: touch.x,
              zrY: touch.y
            });
            handler.processGesture(wrapTouch(e), "end");
          }
        }
      },

      initChart(canvas, width, height, canvasDpr) {
        this.$curChart = echarts.init(canvas, null, {
          width: width,
          height: height,
          devicePixelRatio: canvasDpr
        });
        canvas.setChart(this.$curChart);
        this.$curChart.setOption(this.ec.option);
      }
    }
  };
</script>

<style lang="scss">
  .ec-canvas {
    width: 100%;
    height: 100%;
    display: block;
  }
</style>
