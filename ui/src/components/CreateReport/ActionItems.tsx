import React from 'react'

interface Props {
    actionList: string[];
    onChangeAction: any;
    onAddAction: any;
    onDeleteAction: any;
}

const ActionItems: React.FC<Props> = (props: Props) => {

    return (
        <div className="action-items">
            <h4 className="title">Action Items</h4>

            <ol className="actions-ul">
                {
                    props.actionList.map((item, index) => (
                        <li key={index}>
                            <input data-action={index} type="text" className="action-input" value={item} onChange={props.onChangeAction} />

                            <button className="delete-action" 
                                data-action={index} 
                                onClick={props.onDeleteAction}> 
                                
                            &#x2715;
                                
                            </button> 

                        </li>
                    ))
                }
            </ol>

            <button onClick={props.onAddAction}>Add action</button>

        </div>
    );
}

export default ActionItems;