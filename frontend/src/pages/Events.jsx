import React, { Component } from 'react'
import './Events.css'
import Modal from '../components/Modal/Modal'
import Backdrop from '../components/Backdrop/Backdrop'


export default class Events extends Component {

  state = {
    creating: false
  }

  startCreateEventHandler = () => {
    this.setState({creating: true})
  }

  modalConfirmHandler = () => {
    this.setState({creating:false})
  }

  modalCancelHandler = () => {
    this.setState({creating: false})
  }
  render() {
    console.log(this.state.creating)
    return (
      <React.Fragment>
        {this.state.creating && <Backdrop />}
        {this.state.creating && 
          <Modal onCancel={this.modalCancelHandler}
                  onConfirm={this.modalConfirmHandler}
                  title="add event" canCancel canConfirm><p>content</p>
          </Modal>
        }
        <div className="events-control">
          <p>share events</p>
          <button className="btn" onClick={this.startCreateEventHandler}>create event</button>
        </div>
      </React.Fragment>
    )
  }
}
