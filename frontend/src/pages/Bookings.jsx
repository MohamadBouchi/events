import React, { Component } from 'react'
import AuthContext from '../context/auth-context'
import Spinner from '../components/spinner/Spinner'
import BookingList from '../components/Bookings/BookingList/BookingList'
import BookingsChart from '../components/Bookings/BookingsChart/BookingsChart'
import BookingsControls from '../components/Bookings/BookingsControls/BookingsControls';


export default class Bookings extends Component {

  state = {
    isLoading: false,
    outputType: 'list',
    bookings: []
  }

  static contextType = AuthContext

  componentDidMount() {
    this.fetchBookings()
  }

  fetchBookings = () => {
    this.setState({isLoading: true})
    const requestBody = {
      query: `
        query {
          bookings {
            _id
            createdAt
            event {
              _id
              title
              date
              price
            }
          }
        }  
      `
    }


    fetch('http://localhost:3000/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.context.token
      }
    })
    .then(res => {
      if (res.status !== 200 && res.status !== 201)
        throw new Error ('failed')

        return res.json()
    })
    .then(resData => {
      const bookings = resData.data.bookings
      this.setState({bookings: bookings, isLoading: false})
    })
    .catch(err => {
      this.setState({isLoading: false})
      console.log(err)
    })
  } 

  deleteBookingHandler = bookingId => {
    this.setState({isLoading: true})
    const requestBody = {
      query: `
        mutation CancelBooking($id: ID!) {
          cancelBooking(bookingId: $id) {
            _id
            title
          }
        }  
      `,
      variables: {
        id: bookingId
      }
    }


    fetch('http://localhost:3000/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.context.token
      }
    })
    .then(res => {
      if (res.status !== 200 && res.status !== 201)
        throw new Error ('failed')

        return res.json()
    })
    .then(resData => {
      
      this.setState(prevState => {
        const updatedBookings = prevState.bookings.filter(booking => {
          return booking._id !== bookingId
        })
        return { bookings: updatedBookings, isLoading: false }
      })
    })
    .catch(err => {
      this.setState({isLoading: false})
      console.log(err)
    })
  }

  chaneOutputTypeHandler = outputType => {
    if(outputType === 'list'){
      this.setState({outputType: 'list'})
    } else {
      this.setState({outputType: 'chart'})
    }
  }
  render() {
    let content = <Spinner />

    if (!this.state.isLoading)
      content = (
        <React.Fragment>
          <BookingsControls activeOutpuType={this.state.activeOutpuType}
                            onChange={this.chaneOutputTypeHandler}
          />
          <div>
            {this.state.outputType === 'list' ? <BookingList bookings={this.state.bookings} onDelete={this.deleteBookingHandler}/> :
                                          <BookingsChart bookings={this.state.bookings} /> } 
          </div>
        </React.Fragment>
      )
    return (
      <React.Fragment>
        {content}
      </React.Fragment>
    )
  }
}
