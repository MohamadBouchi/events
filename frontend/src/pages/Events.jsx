import React, { Component } from 'react'
import './Events.css'
import Modal from '../components/Modal/Modal'
import Backdrop from '../components/Backdrop/Backdrop'
import AuthContext from '../context/auth-context'

export default class Events extends Component {

  state = {
    creating: false,
    events: []
  }

  static contextType =  AuthContext

  componentDidMount() {
    this.fetchEvents()
  }
  constructor(props){
    super(props)
    this.titleElRef = React.createRef()
    this.priceElRef = React.createRef()
    this.dateElRef = React.createRef()
    this.descriptionElRef = React.createRef()
  }
  startCreateEventHandler = () => {
    this.setState({creating: true})
  }

  modalConfirmHandler = () => {
    this.setState({creating:false})
    const title = this.titleElRef.current.value
    const price = +this.priceElRef.current.value
    const date = this.dateElRef.current.value.toString()
    const description = this.descriptionElRef.current.value
console.log(price)
    if (title.trim().length === 0 || price < 0 || date.trim().length === 0 || description.trim().length === 0)
      return

    const event = {title, price, date, description}

    const requestBody = {
      query: `
        mutation {
          createEvent(eventInput: {title: "${title}", description: "${description}", price: ${price}, date: "${date}"}) {
            _id
            title
            description
            date
            price
            creator {
              _id
              email
            }
          }
        }  
      `
    }

    const token = this.context.token

    fetch('http://localhost:3000/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token 
      }
    })
    .then(res => {
      if (res.status !== 200 && res.status !== 201)
        throw new Error ('failed')

        return res.json()
    })
    .then(resData => {
      this.fetchEvents()
    })
    .catch(err => {
      console.log(err)
    })
  }

  modalCancelHandler = () => {
    this.setState({creating: false})
  }

  fetchEvents () {
    const requestBody = {
      query: `
        query {
          events {
            _id
            title
            description
            date
            price
            creator {
              _id
              email
            }
          }
        }  
      `
    }


    fetch('http://localhost:3000/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(res => {
      if (res.status !== 200 && res.status !== 201)
        throw new Error ('failed')

        return res.json()
    })
    .then(resData => {
      const events = resData.data.events
      this.setState({events: events})
    })
    .catch(err => {
      console.log(err)
    })
  }


  render() {

    const eventList = this.state.events.map( event => {
      return <li className="events__list-item" ke={event._id}>{event.title}</li>
    }) 

    return (
      <React.Fragment>
        {this.state.creating && <Backdrop />}
        {this.state.creating && 
          <Modal onCancel={this.modalCancelHandler}
                  onConfirm={this.modalConfirmHandler}
                  title="add event" canCancel canConfirm>
                  <form>
                    <div className="form-control">
                      <label htmlFor="title">title</label>
                      <input type="text" id="title" ref={this.titleElRef}/>
                    </div>
                    <div className="form-control">
                      <label htmlFor="price">price</label>
                      <input type="number" id="price" ref={this.priceElRef}/>
                    </div>
                    <div className="form-control">
                      <label htmlFor="date">date</label>
                      <input type="datetime-local" id="date" ref={this.dateElRef}/>
                    </div>
                    <div className="form-control">
                      <label htmlFor="description">description</label>
                      <textarea id="description" rows="4" ref={this.descriptionElRef}/>
                    </div>
                  </form>
          </Modal>
        }
        {this.context.token && <div className="events-control">
          <p>share events</p>
          <button className="btn" onClick={this.startCreateEventHandler}>create event</button>
        </div>}

        <ul className="events__list">
          {eventList}
        </ul>
      </React.Fragment>
    )
  }
}
