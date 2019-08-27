import React, {Component} from "react";
import './sidebar.scss'

export default class Sidebar extends Component {
    componentDidUpdate() {
        this.render()
    }


    renderSidebar = (data) => {
        const objId = data.objId;
        const arr = data.data;
        let res = arr.filter((item) => {
            if (item["id"] === objId) {
                return item
            }
        })
        return res
    }
    closeSidebar = (e) => {
        e.target.closest(".balloon").classList.toggle("hidden")
    }

    render() {
        const data = this.renderSidebar(this.props.data);
        console.log(data);
        let urlPlace;
        if(data.length>0){
            urlPlace = `https://yandex.ru/maps/?whatshere[point]=${data[0].points[1]},${data[0].points[0]}&whatshere[zoom]=17`;
            console.log(urlPlace);
        }

        const BallonTime = () => {
            if (data[0].day) {
                return (
                    <div className="balloon-time">
                        <p className={"icon-tara"}>Раздача тары</p>
                        <p><span>День месяца: </span>{data[0].day}</p>
                        <p><span>Время: </span>{data[0].time}</p>
                    </div>
                )
            }else{
                return (
                    <div className="balloon-time">
                      <p className={"balloon-time--text"}>В данном кисоке нет раздачи тары, если вы хотите получить бесплатно тару, найдите кисок c раздачей рядом </p>
                    </div>
                )
            }
        }
        const Balloon = () => {
            if (data.length > 0) {
                return (
                    <div className="balloon">
                        <button onClick={this.closeSidebar} className="close">
                            <span className="icon"></span>
                        </button>
                        <h4>{data[0].name}</h4>
                        <div className={"image-wrap"}>
                            <img src="/images/art_house.png" alt=""/>
                        </div>
                        <p className="balloon-info--top">Автоматы для розлива работают 24 часа</p>
                        <BallonTime/>
                        <div className="balloon-info">
                            <p> Раздача один раз в месяц для каждого киоска </p>
                            <p>Для удобства наших покупателей мы будем раздавать 6 литровые бутылки абсолютно бесплатно,
                                при условии покупки воды.</p>

                        </div>
                        <a target={"_blank"} href={urlPlace}>Открыть в Яндекс картах</a>
                    </div>)
            } else {
                return (
                    <div></div>
                )
            }
        }
        return (
            <Balloon/>
        )
    }
}