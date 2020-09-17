import React from 'react'

interface Props {
    onChange: any;
    img: string;
}

const Weather: React.FC<Props> = (props: Props) => {

    return (
        <div className='weather'>
            <h4 className="title">Weather</h4>

            <div className="image-wraper">

                <div className="image-btn">
                    <input type="file" id="weatherFile" onChange={props.onChange} />
                    <label className="input-file-label" htmlFor="weatherFile"> Choose File </label>
                       
                </div>
                {props.img ?
                    (<div className="image-preview">
                        <img className="image-weather" alt="weather" src={props.img} />
                    </div>)
                    :
                    (<p className="weatherHint"> &lt;Snapshot from https://www.tide-forecast.com&gt; </p>)
                }
            </div>


        </div>
    );





}

export default Weather;