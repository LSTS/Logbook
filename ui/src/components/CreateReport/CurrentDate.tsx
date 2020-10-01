import React from 'react'
import '../App/App.css';

import locationOptions from '../data/location.json';

interface Props {
    currentDate: string;
    location: string;
    locationChange: any;
}

const CurrentDate: React.FC<Props> = (props: Props) => {

    return (
        <div className="text-date">
            <h3>
                <datalist id="locals">
                    {
                        locationOptions.map((local, index) => (
                            <option key={index}>{local.name}</option>
                        ))
                    }
                </datalist>

                <input type="text"
                    className="location-input"
                    onChange={props.locationChange}
                    value={props.location}
                    placeholder="Location" 
                    list="locals"/>
                :
                <span className="data-input"> {props.currentDate} </span>

            </h3>
        </div>
    );
}




export default CurrentDate;