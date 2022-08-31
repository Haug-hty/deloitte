import React from "react";

// import ReactDOM from 'react-dom';

import './index.css'



export default class AuxLine extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            flag: false,
            dropFlag: false,
            delFlag: false,
            start: null,
            end: null,
            blobList: [],
            blob: {}
        }
        this.ctx = null
        this.canvasNode = null
    }

    /** 
     * @description  绘制辅助线
     * @author hu_ty
     * @since 
     * @param {*} 
     * 
     */
    drawLine(blobList = this.state.blobList) {
        blobList.length > 0 && blobList.forEach(blob => {
            this.drawBlob(blob)
        });
    }

    /** 
     * @description  绘图方法
     * @author hu_ty
     * @since 
     * @param {*} 
     * 
     */
    drawBlob(blob) {
        if (blob) {
            this.ctx.beginPath();
            this.ctx.moveTo(blob.startX, blob.startY);
            this.ctx.lineTo(blob.endX, blob.endY);
            this.ctx.stroke();
            this.ctx.closePath();
        }

    }

    componentDidMount() {
        // this为当前组件的实例
        // console.log(this.canvasNode);
        this.canvasNode.setAttribute("width", window.innerWidth)
        this.canvasNode.setAttribute("height", window.innerHeight)
        this.ctx = this.canvasNode.getContext("2d");


    }
    /** 
     * @description  新增线条
     * @author hu_ty
     * @since 
     * @param {*} 
     * 
     */
    updrawLine() {
        console.log(this.canvasNode, this.state);
        this.setState({
            flag: true
        })
    }



    /** 
     * @description  移动辅助线
     * @author hu_ty
     * @since 
     * @param {*} 
     * 
     */
    dropLine() {
        this.setState({
            dropFlag: true
        })
        // this.setState('flag',true)
    }

    /** 
     * @description  删除辅助线
     * @author hu_ty
     * @since 
     * @param {*} 
     * 
     */
    deleteLine() {
        this.setState({
            delFlag:true
        })
    }


    handleMouseDown = (ev) => {
        let {
            flag,
            blobList
        } = this.state
        if (flag) {
            this.setState({
                start: ev || window.event
            })
            let startPoint = ev || window.event
            this.ctx.beginPath();

            this.ctx.moveTo(startPoint.clientX - this.canvasNode.offsetLeft, startPoint.clientY - this.canvasNode.offsetTop);

        } else {
            //记录鼠标所在位置的坐标
            let x = ev.clientX - this.canvasNode.getBoundingClientRect().left;
            let y = ev.clientY - this.canvasNode.getBoundingClientRect().top;
            //记录所在检测区域内坐标
            blobList.length > 0 && blobList.forEach(blob => {
                this.drag(blob, x, y);
            });
        }
    }

    handleMouseUp(ev) {

        let {
            flag,
            start,
            blobList,
        } = this.state
        if (flag) {
            let end = ev || window.event;

            this.ctx.lineTo(end.clientX - this.canvasNode.offsetLeft, end.clientY - this.canvasNode.offsetTop);

            this.ctx.stroke();

            let a = start.clientX - this.canvasNode.offsetLeft
            let b = ev.clientY - this.canvasNode.offsetTop

            var newline = {
                startX: start.clientX - this.canvasNode.offsetLeft,
                startY: start.clientY - this.canvasNode.offsetTop,
                endX: end.clientX - this.canvasNode.offsetLeft,
                endY: end.clientY - this.canvasNode.offsetTop,
                id: parseInt(a.toString() + b.toString())
            }
            blobList.push(newline)
            this.setState({
                flag: false
            })
        }

    }

    //判断鼠标是否点击在指定检测区域
    containsPoint(rect, x, y) {
        return !(x < rect.x - 25 || x > rect.x + 25 ||
            y < rect.y - 25 || y > rect.y + 25);
    }

    //获取检测区域
    getBounds(blob) {
        blob.width = blob.endX - blob.startX
        blob.height = blob.endY - blob.startY

        return {
            x: blob.startX,
            y: blob.startY,
            width: Math.abs(blob.endX - blob.startX),
            height: Math.abs(blob.endY - blob.startY),
            id: blob.id,
        };
    }

    //拖拽函数 
    drag(blob, x, y) {
        var {
            blobList,
            dropFlag,
            delFlag
        } = this.state
        // 判断鼠标是否在检测区域
        if (this.containsPoint(this.getBounds(blob), x, y)) {
            console.log(this.getBounds(blob), '进入区域', blob);
            // 获取点击的对象
            if (this.getBounds(blob).id === blob.id) {


                if (dropFlag) {
                    this.setState({
                        blob: blob
                    })
                    const i = blobList.findIndex(i => {
                        return i.id === blob.id
                    })
                    if (i !== -1) {
                        blobList.splice(i, 1)
                    }
                    let that = this
                    this.canvasNode.onmousemove = function(e){
                        var x = e.clientX - that.canvasNode.getBoundingClientRect().left;
                        var y = e.clientY - that.canvasNode.getBoundingClientRect().top;
                        //清除画布内容

                        that.ctx.clearRect(0, 0, that.canvasNode.getBoundingClientRect().width, that.canvasNode.getBoundingClientRect().height);
                        //重绘
                        that.drawLine(blobList)
                        that.drawBlob(blob);
                        // //更新块所在的位置
                        blob.startX = x;
                        blob.startY = y;
                        blob.endX = blob.startX + blob.width
                        blob.endY = blob.startY + blob.height
                    }
                    //注册鼠标松开事件 
                    this.canvasNode.onmouseup = function (e) {
                        blobList.push(blob)
                        that.setState({
                            dropFlag: false
                        })
                        that.canvasNode.onmousemove = null;
                        that.canvasNode.onmouseup = null;
                      };
                }
                if (delFlag) {
                  const i = blobList.findIndex(i => {
                    return i.id === blob.id
                  })
                  if (i !== -1) {
                    blobList.splice(i, 1)
                  }
                  //清除画布内容
                  this.ctx.clearRect(0, 0, this.canvasNode.getBoundingClientRect().width, this.canvasNode.getBoundingClientRect().height);

                  //重绘
                  this.drawLine(blobList)

                  this.setState({
                        delFlag: false
                    })
                }


            }

        };
    }




    render() {
        return ( <div className = "body" >
            <canvas id = "myCanvas"
            ref = {
                el => this.canvasNode = el
            }
            onMouseDown = {
                this.handleMouseDown.bind(this)
            }
            onMouseUp = {
                this.handleMouseUp.bind(this)
            }
            >
            </canvas>  <button id = "btn-1"
            onClick = {
                () => this.updrawLine()
            } >
            添加辅助线 </button>  <button id = "btn-2"
            onClick = {
                () => this.dropLine()
            } > 移动辅助线 </button> <button id = "btn-3"
            onClick = {
                ()=>this.deleteLine()
            } > 删除辅助线 </button>


            </div>
        )
    }

}