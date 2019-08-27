import React, {Component} from 'react';
import Maps from '../map';
import MapList from '../map-list';

import './App.scss';
import maps from "./map";
import LoadScript from "../load-script";
import Sidebar from "../sidebar";


export default class App extends Component {

    state = {
        data: this.getArr(),
        bound: 1,
        center: [60.048048, 30.386486],
        objId: '',
        place:''
    };

    getArr() {
        let data = [];
        maps.filter(item => {
            item.view = 0;
            item.id = parseFloat(item.id);
            item.name = item.name.replace("Санкт-Петербург,", "")
            item.time = item.time !== "undefined" ? item.time : "";
            item.day = item.day !== "undefined" ? item.day : "";
            item.points = [item.points[1], item.points[0]];
            item.selected = false;
            data.push(item)
        });

        return data
    }

    render() {

        const onItemToggle = (propsData, name, points, objId, propName) => {
            const idx = propsData.findIndex((item) => item.name === name);
            const oldItem = propsData[idx];
            // const value = !oldItem[propName];
            propsData.map(item => {
                item.selected = false;
            });

            const item = {
                ...propsData[idx],
                [propName]: "selected"
            };

            const data = [
                ...propsData.slice(0, idx),
                item,
                ...propsData.slice(idx + 1)
            ];
            this.setState((state) => {
                return {data: data, center: points, objId: objId, bound:0}
            })
        };
        const onTaraView = (propsData) => {
            this.setState((state) => {
                return {data: propsData, objId: "", bound:1}
            })
        };

        const onPlaceChangeApp = (place) => {
            let data =  this.state.data.filter(item => {
                if(item.place === place){
                    return item
                }
                if(place === ""){
                    return item
                }
            });


            this.setState((state)=>{
                return {place:place, bound:"true", objId:"" }
            });
        };

        // const onMapClick = (objId) => {
        //     console.log(objId);
        //     const center = searchCenter(objId);
        //     this.setState((state) => {
        //         if(center === this.state.center){
        //             return { objId:objId }
        //         }else{
        //             return { objId:objId, center:center }
        //         }
        //
        //     })
        // }

        return (
            <div>
                <Maps data={this.state} onItemToggle={onItemToggle}/>
                <MapList data={this.state} onItemToggle={onItemToggle} onTaraView={onTaraView}
                         onPlaceChangeApp={onPlaceChangeApp}/>
                <Sidebar data={this.state}/>
            </div>
        );
    }


}



