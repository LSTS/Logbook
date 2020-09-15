import React from 'react'
import '../App/App.css';


interface Props {
    currentDate: string;
    location: string;
    locationChange: any;
}


const CurrentDate: React.FC<Props> = (props: Props) => {


    return (
        <div className="text-date">
            <h3> 
                <input type="text" 
                    className="location-input" 
                    onChange={props.locationChange} 
                    value={props.location} 
                    placeholder="Location"/> 
                :
                <span className="data-input"> {props.currentDate} </span>
            </h3>
        </div>
    );
}




export default CurrentDate;