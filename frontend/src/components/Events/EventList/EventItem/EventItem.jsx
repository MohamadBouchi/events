import React from 'react'

import './EventItem.css'

const EventItem = props => {

    return(
        <li key={props.eventId} className="event__list-item">
            <div>
                <h1>{props.title}</h1>
                <h2>{props.price} - {new Date(props.date).toLocaleDateString()}</h2>
            </div>
            <div>
                {props.userId === props.creatorId ? (<p>you are the owner</p>) : (<button className="btn">details</button>)}
            </div>
        </li>
    )
}

export default EventItem