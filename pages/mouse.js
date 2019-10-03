import React from 'react'
import Link from 'next/link'
import classnames from 'classnames'
import io from 'socket.io-client'
import Style from '../static/styles/main.less'
import Head from '../components/Head'

const FPS = 30;

export default class Index extends React.Component {
    state = {

    }
    socket = null
    lastEmitTimestamp = 0

    socketSetup() {
        if (!this.socket) {
            this.socket = io();
            this.socket.emit('iam', { type: 'MOUSE' })
        }      
    }

    socketTeardown() {
        if (this.socket) {
            this.socket.disconnect()
            this.socket = null
        }
    }

    emitMouseEvent = (type, x, y) => {
        if (!this.socket) return
        this.socket.emit(type, { x, y })
    }

    onMouseMove = (evt) => {
        const xPct = evt.clientX / window.innerWidth
        const yPct = evt.clientY / window.innerHeight

        const now = new Date().getTime()
        if (now - this.lastEmitTimestamp > 1000 / FPS) {
            this.emitMouseEvent('mouseMove', xPct, yPct)
            this.lastEmitTimestamp = now
        }
    }

    onClick = (evt) => {
        console.log('click: ', evt.clientX, evt.clientY)
        const xPct = evt.clientX / window.innerWidth
        const yPct = evt.clientY / window.innerHeight
        this.emitMouseEvent('mouseClick', xPct, yPct)
    }

    componentDidMount() {
        this.socketSetup()
    }

    componentWillUnmount() {
        this.socketTeardown()
    }

    render() {
        return (
            <div className="mouse-capture-container"
                onMouseMove={this.onMouseMove}
                onClick={this.onClick}
            >
            </div>
        )
    }
}