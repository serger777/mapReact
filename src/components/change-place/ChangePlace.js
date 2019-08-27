import React, {Component} from "react";
import "./ChangePlace.scss"


export default class ChangePlace extends Component {
    state = {
        place: ''
    }

    render() {
        const changeInput = (e) => {
            const {
                onPlaceChange = () => {
                }
            } = this.props;
            let place = e.target.value;
            this.setState({
                place: place
            });

            onPlaceChange(place);
        };
        const PlaceItems = () => {
            const data = {
                place: [
                    "",
                    "Калининский район",
                    "Приморский район",
                    "Невский/Красногвардейский",
                    "Мурино и др."
                ]
            };
            const RenderItems = () => {
                return  data.place.map((item, idx) => {
                    return (
                         <div className="item" >
                             <input onChange={changeInput} type="radio" id={idx} name='place' value={item}/>
                             <label  className={this.props.data.place == item ? "active" : "" }  htmlFor={idx}> {item ==="" ? "Все": item}</label>
                         </div>
                    )
                })
            };
            return (
                <div className={"place-list"}>
                    <RenderItems/>
                </div>
            )
        };

        return (
            <div className="wrap-list-btn">
                <PlaceItems/>
            </div>

        )
    }

}