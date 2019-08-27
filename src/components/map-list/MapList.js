import React, {Component} from 'react';
import maps from '../app/map'
import SwapiService from "../../service/service";
import "./MapList.scss"
import SearchPanel from "../search-panel";
import ChangePlace from "../change-place";


export default class Map extends Component {
    state = {
        checked: false,
        search: '',
        place: ''
    };

    onSearchChange = (search) => {
        this.setState({search});
    }

    onPlaceChange = (place) => {


        this.setState({place:place});


        const changeInput = (place) => {
            const {
                onPlaceChangeApp = () => {
                }
            } = this.props;
            onPlaceChangeApp(place);
        };
        changeInput(place);

    }

    searchItems(arr, search) {
        if (search.length === 0) {
            return arr;
        }
        return arr.filter(item => {
            return item.name.toLowerCase().indexOf(search.toLowerCase()) > -1;
        })
    }

    renderItems(arr) {
        const {search} = this.state;

        const data = this.searchItems(arr, search);

        return data.map((item, idx) => {
                const {name, day, time, view, selected, points, id, hidden} = item;

                const DataTime = () => {
                    return (
                        <div key={id} className={!view ? 'disabled block_tara' : 'block_tara'}>
                            <span ><span className="icon-day"></span> {day}</span> <span> <span
                            className="icon-time"></span> {time}</span>
                        </div>
                    )
                };
                const DataName = () => {
                    return (
                        <li key={id}  className={hidden ? 'hidden' : ''} >
                            <span
                                onClick={() => this.props.onItemToggle(this.props.data.data, name, points, "", "selected")}
                                className={selected ? "selected" : null}>{name}<span
                                className={!day ? 'disabled icon-tara' : 'icon-tara'}></span></span>

                        </li>
                    )
                };
                if (!day) {
                    return (
                        <div>
                            <DataName/>
                        </div>
                    )
                }
                return (
                    <div className={"map__list-wrap"}>
                        <DataName/>
                        <DataTime/>
                    </div>
                )
            }
        )
    }

    filterData(name) {
        let data = [];
        this.props.data.data.map(item => {
            if (item.place === name || name === "") {
                data.push(item)
            }
        });
        return data

    }

    checkedTara = () => {
        let data = [];
        if (!this.state.checked) {
            this.props.data.data.filter(item => {
                if (item.day) {
                    item.view = 1;
                }else{
                    item.hidden = 1;
                }
                data.push(item);
                data.sort((a, b) => {
                    return a.day - b.day
                });
            });

            this.setState({checked: true})
        } else {
            this.props.data.data.map(item => {
                item.view = 0;
                item.hidden = 0;
                data.push(item);
                data.sort((a, b) => {
                    let nameA = a.name.toUpperCase();
                    let nameB = b.name.toUpperCase();
                    if (nameA < nameB) {
                        return -1;
                    }
                    if (nameA > nameB) {
                        return 1;
                    }
                })
            });
            this.setState({checked: false})
        }
        this.props.onTaraView(data)
    }

    render() {
        const list = this.renderItems(this.filterData(this.state.place));

        return (
            <div className={"wrap-list"}>
                <div className="wrap-list-header">
                    <SearchPanel onSearchChange={this.onSearchChange}/>
                    <div className={"wrap-checked"}>
                        <label htmlFor={'check'}>График раздачы тары</label>
                        <input onChange={this.checkedTara} id={'check'} className={'check-tara'} type="checkbox"/>
                    </div>
                </div>



                <ChangePlace data={this.state} onPlaceChange={this.onPlaceChange}/>
                <div className="map__list">
                    <div className="map__list-item">
                        <ul>
                            {list}
                        </ul>
                    </div>
                </div>
            </div>
        )
    }
}
