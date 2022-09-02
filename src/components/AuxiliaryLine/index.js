import React from "react";

// import ReactDOM from 'react-dom';

import './index.css'


var count = 0
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
            blob: {},
            height: null,
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
    drawLine(blobList) {
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
        var { blobList } = this.state
        // console.log(window.innerWidth);
        this.canvasNode.setAttribute("width", this.canvasNode.parentElement.parentElement.getBoundingClientRect().width-100)
        this.canvasNode.setAttribute("height", 1100)
        this.ctx = this.canvasNode.getContext("2d");
        this.drawLine(blobList)

    }

    // componentDidUpdate() {
    //     var {status} = this.props
    //     console.log(status);
    //     if(status){
    //         this.canvasNode.setAttribute("height", this.canvasNode.parentElement.parentElement.getBoundingClientRect().height)
    //         console.log(this.canvasNode.parentElement.parentElement);
    //         debugger
    //     }
    // }
    /** 
     * @description  新增线条
     * @author hu_ty
     * @since 
     * @param {*} 
     * 
     */
    updrawLine() {
        this.setState({
            flag: true
        })
        if(!count){
            this.setState({
                height:this.canvasNode.parentElement.parentElement.getBoundingClientRect().height
            })
            count++
        }
        // console.log(this.canvasNode,count);
        // debugger
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
            delFlag: true
        })
    }

    /** 
    * @description  鼠标按下事件
    * @author hu_ty
    * @since 
    * @param {*} 
    * 
    */
    handleMouseDown = (ev) => {
        // console.log(ev);
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

            this.ctx.moveTo(startPoint.clientX - this.canvasNode.offsetLeft, startPoint.pageY - this.canvasNode.offsetTop);
            // console.log('start',startPoint,startPoint.clientX - this.canvasNode.offsetLeft, startPoint.pageY - this.canvasNode.offsetTop);
        } else {
            //记录鼠标所在位置的坐标
            let x = ev.clientX - this.canvasNode.getBoundingClientRect().left;
            let y = ev.clientY - this.canvasNode.getBoundingClientRect().top;
            // console.log(x,y,'mouse',this.canvasNode.getBoundingClientRect().top,ev.clientY);
            //记录所在检测区域内坐标
            blobList.length > 0 && blobList.forEach(blob => {
                this.drag(blob, x, y);
            });
        }
    }

    /** 
    * @description  鼠标抬起事件
    * @author hu_ty
    * @since 
    * @param {*} 
    * 
    */
    handleMouseUp(ev) {

        let {
            flag,
            start,
            blobList,
        } = this.state
        if (flag) {
            let end = ev || window.event;

            this.ctx.lineTo(end.clientX - this.canvasNode.offsetLeft, end.pageY - this.canvasNode.offsetTop);
            // console.log('end',end.clientX - this.canvasNode.offsetLeft, end.pageY - this.canvasNode.offsetTop);

            this.ctx.stroke();

            let a = start.clientX - this.canvasNode.offsetLeft
            let b = ev.pageY - this.canvasNode.offsetTop

            var newline = {
                startX: start.clientX - this.canvasNode.offsetLeft,
                startY: start.pageY - this.canvasNode.offsetTop,
                endX: end.clientX - this.canvasNode.offsetLeft,
                endY: end.pageY - this.canvasNode.offsetTop,
                id: parseInt(a.toString() + b.toString())
            }
            blobList.push(newline)
            this.setState({
                flag: false
            })
        }

    }

    /** 
    * @description  判断鼠标是否点击在指定检测区域
    * @author hu_ty
    * @since 
    * @param {*} 
    * 
    */
    containsPoint(rect, x, y) {
        return !(x < rect.x - 25 || x > rect.x + 25 ||
            y < rect.y - 25 || y > rect.y + 25);
    }

    /** 
    * @description  获取检测区域
    * @author hu_ty
    * @since 
    * @param {*} 
    * 
    */
    getBounds(blob) {
        // console.log(blob);
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

    /** 
    * @description  移动辅助线函数
    * @author hu_ty
    * @since 
    * @param {*} 
    * 
    */
    drag(blob, x, y) {
        var {
            blobList,
            dropFlag,
            delFlag
        } = this.state
        // 判断鼠标是否在检测区域
        if (this.containsPoint(this.getBounds(blob), x, y)) {
            // console.log(this.getBounds(blob), '进入区域', blob);
            // 获取点击的对象
            if (this.getBounds(blob).id === blob.id) {


                if (dropFlag) {
                    // console.log(blobList,'blobList');
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
                    this.canvasNode.onmousemove = function (e) {
                        // console.log(e,'drop');
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

    /** 
    * @description  保存辅助线信息数组
    * @author hu_ty
    * @since 
    * @param {*} 
    * 
    */
    saveLine(){
        var { blobList } = this.state

        console.log("辅助线信息数组：",blobList);
    }




    render() {
        var {height} = this.state
        return (<div className="body" >
            <canvas id="myCanvas"
                ref={
                    el => this.canvasNode = el
                }
                onMouseDown={
                    this.handleMouseDown.bind(this)
                }
                onMouseUp={
                    this.handleMouseUp.bind(this)
                }
                height={height}
            >
            </canvas>  <button id="btn-1"
                onClick={
                    () => this.updrawLine()
                } >
                添加辅助线 </button>  <button id="btn-2"
                    onClick={
                        () => this.dropLine()
                    } > 移动辅助线 </button> <button id="btn-3"
                        onClick={
                            () => this.deleteLine()
                        } > 删除辅助线 </button>
                        <button id="btn-4"
                        onClick={
                            () => this.saveLine()
                        } > 获取辅助线信息 </button>


        </div>
        )
    }

}


