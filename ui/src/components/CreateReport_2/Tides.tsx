import React from 'react'

interface Props {
    onChange: any;
    img: string;
}

const Tides: React.FC<Props> = (props: Props) => {

    return (
        <div className='weather'>
            <h4 className="title">Tides</h4>

            <div className="image-wraper">

                <div className="image-btn">
                    <input type="file" id="tidesFile" onChange={props.onChange} />
                    <label className="input-file-label" htmlFor="tidesFile"> Choose File </label>
                </div>
                {props.img ?
                    (<div className="image-preview">
                        <img alt="tide" src={props.img} />
                    </div>)
                    :
                    (<p className="tidesHint"> &lt;Snapshot from https://www.tide-forecast.com&gt;  </p>)
                    
                }
            </div>


        </div>
    );





}

export default Tides;