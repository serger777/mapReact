import React, {Component} from "react";
import './search-panel.scss'

export default class SearchPanel extends Component {
    state = {
        term: ''
    };

    changeInput = (e) => {
      const {onSearchChange = () =>{}} = this.props;
        this.setState({
            term: e.target.value
        });
        onSearchChange(e.target.value);
    }

    render() {
        return (
            <input onChange={this.changeInput}
                   className={'search-map'}
                   type="text"
                   placeholder={'найти по адресу'}
                   value={this.state.term}
            />
        )
    }
}

