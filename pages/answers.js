import React from 'react'
import Link from 'next/link'
import classnames from 'classnames'
import io from 'socket.io-client'
import Style from '../static/styles/main.less'
import Head from '../components/Head'
import { INSTALLATION_STATES } from '../constants'

export default class Index extends React.Component {
    state = {
        questionText: '',
        answerText: '',
        installationState: INSTALLATION_STATES.STARTING
    }
    socket = null

    socketSetup() {
        if (!this.socket) {
            this.socket = io();
            this.socket.emit('iam', { type: 'ANSWERS' })
            this.socket.on('action:question', this.onNewQuestion)
            this.socket.on('state:update', this.onStateUpdate)
        }      
    }

    submitAnswer(text) {
        this.socket.emit('receivedAnswer', { answer: text })
    }

    onNewQuestion = (message) => {
        this.setState({
            questionText: message.question
        }, () => {
            window.speechSynthesis.cancel();            
            var msg = new SpeechSynthesisUtterance(message.question);
            msg.pitch = 1.5;
            msg.voice = window.speechSynthesis.getVoices()[17]
            console.log('voices: ', window.speechSynthesis.getVoices())
            window.speechSynthesis.speak(msg);
        })
    }

    onStateUpdate = (stateObject) => {
        const { state } = stateObject
        this.setState({ 
            installationState: state,
            questionText: '',
            answerText: ''
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
        const { questionText, answerText, installationState } = this.state

        const introClassnames = classnames({
            "full-screen-modal": true,
            "visible": installationState == INSTALLATION_STATES.STARTING
        })

        const outroClassnames = classnames({
            "full-screen-modal": true,
            "visible": installationState == INSTALLATION_STATES.FINISHED
        })

        return (
            <div 
                className="answers-container"
            >
                <div className="question-container">
                    <div className="instructions-container">
                        Type your answer in this window, and press enter whenever you are ready to send it.
                    </div>
                    <div>
                        { questionText }
                    </div>
                </div>

                <div className="answer-container">
                    { answerText }
                </div>

                <div className={introClassnames}>
                    <div className="answers-intro-text">
                        Hi, and welcome to The Nether 2.0.
                    </div>
                </div>

                <div className={outroClassnames}>
                    <div className="answers-outro-text">
                        Thank you for visiting the The Nether 2.0.
                    </div>
                </div>
            </div>
        )
    }
}