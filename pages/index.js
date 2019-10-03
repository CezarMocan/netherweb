import React from 'react'
import Link from 'next/link'
import classnames from 'classnames'
import io from 'socket.io-client'
import Style from '../static/styles/main.less'
import Head from '../components/Head'

export default class Index extends React.Component {
    state = {

    }
    socket = null

    socketSetup() {
        if (!this.socket) {
            this.socket = io();
            // this.socket.on('centralizedPhaseStartAnimation', this.centralizedPhaseStartAnimation)
        }      
    }

    socketTeardown() {
        if (this.socket) {
            this.socket.disconnect()
            this.socket = null
        }
    }

    render() {
        return (
            <h1> Scuzi, papa di poopi? </h1>
        )
    }
}