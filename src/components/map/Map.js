import React, {Component} from 'react';

import MapData from '../map';
import './Map.scss';
import LoadScript from "../load-script";

export default class Maps extends Component {
    state = {
        checked: false,
        search: '',
    };

    componentDidMount() {
        LoadScript('https://api-maps.yandex.ru/2.1/?apikey=2342bd60-a212-486a-a5b6-8e84c2f50256&lang=ru_RU').then(() => {
            const {ymaps} = window;
            ymaps.ready().then(() => {
                this.init();
            })
        })
    }

    componentDidUpdate() {
        if (this.props.data.bound) {
            this.filterMap();
        }
        if (!this.props.data.bound) {
            this.setCenterChange()
        }
    }

    setCenterChange() {
        let {center} = this.props.data;
        const searchCenter = (center) => {
            const arr = this.props.data.data;
            let objId = arr.filter((item) => {
                if (item["points"][0] === center[0]) {
                    return item
                }
            });
            return objId[0]["id"]
        };
        this.pointsHover(searchCenter(center));

        this.map.setCenter(this.props.data.center, 15, {
            duration: 300
        });
    }

    init() {
        const {ymaps} = window;
        const mapContainer = document.querySelector("#map");
        mapContainer.innerText = '';
        const zoomControl = new ymaps.control.ZoomControl({
            options: {
                size: 'small',
                position: {
                    top: 20,
                    right: 20
                }
            }
        });
        this.map = new ymaps.Map(mapContainer, {
            center: this.props.data.center,
            controls: [zoomControl],
            zoom: 11,
            // zoomMargin: 100,

        },{
             suppressMapOpenBlock: true
        });
        this.map.behaviors.disable('scrollZoom');

        this.pointsAdd(this.props.data.data);

        const searchitem = (objId) => {
            const arr = this.props.data.data;
            let res = arr.filter((item) => {
                if (item.id === objId) {
                    return item
                }
            });
            return res
        }

        this.myCollection.objects.events.add('click', e => {
            let objId = e.get('objectId');
            const res = searchitem(objId);
            this.props.onItemToggle(this.props.data.data, res[0].name, res[0].points, objId, "selected");
            this.pointsHover(objId);
        });

    }

    filterMap() {
        let place = this.props.data.place || "";
        this.myCollection.setFilter(shopObject => {
            if (place === "") {
                return shopObject.type === 'Feature';
            } else {
                return shopObject.place === place;
            }

        });
        this.setMapBounds()
    }

    pointsAdd(data) {
        const {ymaps} = window;
        this.myCollection = new ymaps.ObjectManager({
            clusterize: true,
            clusterHasBalloon: false,
            // clusterDisableClickZoom: true,
            clusterGridSize: 5,
            geoObjectOpenBalloonOnClick: true
        });
        // Меняем иконку кластеров
        this.myCollection.clusters.options.set({
            clusterIcons: [
                {
                    href: '/images/oval.svg',
                    size: [40, 40],
                    offset: [-20, -20]
                }
            ]
        });
        this.myCollection.objects.options.set({
            hasBalloon: false,
            // hasHint: false,
            iconLayout: 'default#image',
            iconImageHref: '/images/placeholder-hover.svg',
            iconImageSize: [40, 40],
            iconImageOffset: [-20, -20]
        });
        let objCollection = [];

        data.forEach((item, index) => {
            objCollection.push({
                type: 'Feature',
                place: item.place,
                id: index,
                geometry: {
                    coordinates: [
                        item.points[0],
                        item.points[1]
                    ],
                    type: "Point"
                },
                properties: {
                    hintContent: item.name
                },
            });
        });
        this.myCollection.add(objCollection);
        this.map.geoObjects.add(this.myCollection);
        this.setMapBounds()
    }

    setMapBounds() {

        let zoomMargin = [0, 0, 0, 350];
        if (window.matchMedia("screen and (max-width:768px)")) {
            zoomMargin = 10;
        }
        this.map.setBounds(
            this.myCollection.getBounds(),
            {
                checkZoomRange: true, preciseZoom: true, zoomMargin: zoomMargin
            }
        );
    }

    pointsHover(objId) {
        this.props.data.data.forEach(item => {
            if (item.id === objId) {
                this.myCollection.objects.setObjectOptions(
                    objId,
                    {
                        iconImageHref: '/images/placeholder.svg'
                    }
                );
            } else {
                this.myCollection.objects.setObjectOptions(
                    item.id,
                    {
                        iconImageHref: '/images/placeholder-hover.svg'
                    }
                );
            }
        })
    }

    render() {
        return (
            <div id='map'>
                <span className="loader">Загружаем карту</span>
            </div>

        )
    }
}