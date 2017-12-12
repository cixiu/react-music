import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './index.styl';

class Switches extends Component {
    static defaultProps = {
        switches: [],
        currentIndex: 0,
        selectSwitch: () => {
            console.log('请传入一个选中switch的index的函数')
        }
    }
    
    selectSwitch = (index) => {
        this.props.selectSwitch(index)
    }
    render() {
        const { switches, currentIndex } = this.props;
        return (
            <ul className="switches">
                {switches.map((item, index) => (
                    <li 
                        className={`switch-item ${currentIndex === index ? 'active' : ''}`} 
                        key={item.id}
                        onClick={() => this.selectSwitch(index)}
                    >
                        <span>{item.name}</span>
                    </li>
                ))}
            </ul>
        )               
    }
}

if (process.env.NODE_ENV === 'development') {
    Switches.propTypes = {
        switches: PropTypes.array.isRequired,
        currentIndex: PropTypes.number.isRequired,
        selectSwitch: PropTypes.func.isRequired,
    }
}

export default Switches;