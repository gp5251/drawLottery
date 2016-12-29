import React, { Component } from 'react';
import ReactDOM from 'react-dom';

class Draw extends Component {
    constructor() {
        super();

        this.state = {
            hilightPos: 0,
            msg: ''
        }

        this.isDrawing = false;
        this.target = -1;
    }

    start() {
        if (this.isDrawing) return this.setState({
            msg: '正在抽奖，请稍后'
        });

        if (this.target < 1) return this.setState({
            msg: '请先选择您要的奖品'
        });

        this.setState({
            msg: '正在抽奖……'
        });

        this.isDrawing = true;

        let to      = 8 * 8 + this.target,
            d       = 5000,
            b       = 1;

        this.draw(to, d, b, this.target)
            .done(()=>{
                this.setState({ hilightPos: this.target });
                this.isDrawing = false;

                this.setState({
                    msg: '恭喜中得' + this.target + '等奖'
                });
            });
    }

    draw(to, d, b, target) {
        let t, s    = +new Date, 
            ref     = window.requestAnimationFrame || window.webkitRequestAnimationFrame || function(fn) {
                setTimeout(fn, 0);
            };
            // ref     = function(fn) {
            //     setTimeout(fn, 50);
            // };

        return $.Deferred((deferred)=>{
                let animate = ()=>{
                    t = +new Date - s;
                    if (t > d) {
                        deferred.resolve(target);
                    } else {
                        let hilightPos = Math.floor(this.tween(t, b, to, d)) % 8 || 8;

                        this.setState({ hilightPos });
                        ref(animate);
                    }
                };
                ref(animate);
            });
    }

    tween(t,b,c,d){
        return c * Math.sqrt(1 - (t=t/d-1)*t) + b;
    }

    setTarget() {
        this.target = +this.refs.target.value;
    }

    render() {
        let {hilightPos, msg} = this.state;

        return (
                <div className="popup">
                    <div className="con"
                        onClick={e => e.stopPropagation()}>
                        <div className="cj">
                            <span className={hilightPos == 1 ? "c1 cur" : "c1"}>1等</span>
                            <span className={hilightPos == 2 ? "c2 cur" : "c2"}>2等</span>
                            <span className={hilightPos == 3 ? "c3 cur" : "c3"}>3等</span>
                            <span className={hilightPos == 8 ? "c4 cur" : "c4"}>8等</span>
                            <span className="start"
                                onClick={this.start.bind(this)}
                                ></span>
                            <span className={hilightPos == 4 ? "c5 cur" : "c5"}>4等</span>
                            <span className={hilightPos == 7 ? "c6 cur" : "c6"}>7等</span>
                            <span className={hilightPos == 6 ? "c7 cur" : "c7"}>6等</span>
                            <span className={hilightPos == 5 ? "c8 cur" : "c8"}>5等</span>
                        </div>
                        <div className="target">
                            <select onChange={this.setTarget.bind(this)} ref="target">
                                {['我要中奖',1,2,3,4,5,6,7,8].map((v, i)=>
                                    i == 0 ? 
                                        <option disabled selected>我要中奖</option> :
                                        <option value={i}>{v}</option>
                                )}
                            </select>
                        </div>
                        <p className="msg">{msg}</p>
                    </div>
                </div>
            );
    }
}

ReactDOM.render(
  <Draw />,
  document.getElementById('app')
    );
