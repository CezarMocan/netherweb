import React from 'react'
import Link from 'next/link'
import classnames from 'classnames'
import io from 'socket.io-client'
import Style from '../static/styles/main.less'
import Head from '../components/Head'

export default class Index extends React.Component {
    state = {
        questionText: 'choochoo'
    }
    socket = null

    socketSetup() {
        if (!this.socket) {
            this.socket = io();
            this.socket.emit('iam', { type: 'ANSWERS' })
            this.socket.on('action:question', this.onNewQuestion)
        }      
    }

    onNewQuestion = (message) => {
        this.setState({
            questionText: message.question
        })
    }

    socketTeardown() {
        if (this.socket) {
            this.socket.disconnect()
            this.socket = null
        }
    }

    componentDidMount() {
        this.socketSetup()
    }

    componentWillUnmount() {
        this.socketTeardown()
    }

    render() {
        const { questionText } = this.state
        return (
            <div className="answers-container">
                <div className="question-container">
                    { questionText }                    
                </div>

                <div className="answer-container">

                </div>
            </div>
        )
    }
}