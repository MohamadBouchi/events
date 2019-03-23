import React, { Component } from 'react'
import AuthContext from '../context/auth-context'
import Spinner from '../components/spinner/Spinner'

export default class Bookings extends Component {

  state = {
    isLoading: false,
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


  render() {
    return (
      <React.Fragment>
        {this.state.isLoading ? <Spinner /> : (
          <ul>
            {this.state.bookings.map(booking => <li key={booking._id}>{booking.event.title} - {new Date(booking.createdAt).toLocaleDateString()}</li> )}
          </ul>
        )}
      </React.Fragment>
    )
  }
}
