import React from 'react'
import Link from 'next/link'
import classnames from 'classnames'
import io from 'socket.io-client'
import Style from '../static/styles/main.less'
import Head from '../components/Head'

export default class Index extends React.Component {
    state = {
        questionText: 'choochoo',
        answerText: 'bapoopaq'
    }
    socket = null

    socketSetup() {
        if (!this.socket) {
            this.socket = io();
            this.socket.emit('iam', { type: 'ANSWERS' })
            this.socket.on('action:question', this.onNewQuestion)
        }      
    }

    submitAnswer(text) {
        this.socket.emit('receivedAnswer', { answer: text })
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
        document.addEventListener('keydown', this.onKeyDown)
    }

    componentWillUnmount() {
        this.socketTeardown()
        document.removeEventListener('keydown', this.onKeyDown)
    }

    onKeyDown = (event) => {
        if (event.key == 'Enter') {
            const { answerText } = this.state
            this.submitAnswer(answerText)
            this.setState({ answerText: '' })    
        } else if (event.key == 'Meta' || event.key == 'Shift') { // Command, control, shift

        } else if (event.keyCode == 8) { // Backspace
            event.preventDefault()
            const { answerText } = this.state
            this.setState({ answerText: answerText.slice(0, -1) })
        } else {
            this.setState({ answerText: this.state.answerText + event.key })    
        }
    }

    render() {
        const { questionText, answerText } = this.state
        return (
            <div 
                className="answers-container"
            >
                <div className="question-container">
                    { questionText }
                </div>

                <div className="answer-container">
                    { answerText }
                </div>
            </div>
        )
    }
}