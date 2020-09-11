import React from 'react'
import '../App/App.css';


interface Props {
    
    currentDate: string;
}



const CurrentDate: React.FC<Props> = (props: Props) => {


    return (
        <div className="text-date">
            <h3> FEUP: {props.currentDate}</h3>
        </div>
    );
}




export default CurrentDate;