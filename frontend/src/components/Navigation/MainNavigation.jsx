import React from 'react'
import { NavLink } from 'react-router-dom'
import './MainNavigation.css'
import AuthContext from '../../context/auth-context'

const mainNavigation = props => (
    <AuthContext.Consumer>
        {context => {
            console.log(context)
            return(
                <header className="main-navigation">
                    <div className="main-navigatio__logo">
                        <h1>EasyEvent</h1>
                    </div>
                    <nav className="main-navigation__items">
                        <ul>
                            {!context.token &&
                                <li>
                                    <NavLink to="/auth">Authenticate</NavLink>
                                </li>
                            }
                            <li>
                                <NavLink to="/events">Events</NavLink>
                            </li>
                            {context.token &&
                                <li>
                                    <NavLink to="/bookings">Bookings</NavLink>
                                </li>
                            }
                        </ul>
                    </nav>
                </header>
            )
        }}
    </AuthContext.Consumer>
)


export default mainNavigation