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
            this.socket.on('speak:instructions', this.onSpeakInstructions)
        }      
    }

    submitAnswer(text) {
        this.socket.emit('receivedAnswer', { answer: text })
        window.speechSynthesis.cancel();            
        var msg = new SpeechSynthesisUtterance(text);
        window.speechSynthesis.speak(msg);
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

    onSpeakInstructions = (object) => {
        const { installationState } = this.state
        if (installationState != INSTALLATION_STATES.STARTING) return
        window.speechSynthesis.cancel();
        var msg = new SpeechSynthesisUtterance(`
            Welcome!  Participant 801 and Participant 802. Thank you for signing up with The Mirror Room. Here, we aim to create the romantic experience that is best tailored to your needs. Don’t worry, the entire process is anonymous, as we regard our client’s safety and privacy as our top priority. 

            Let me show you how this works: 
            
            Participant 801: You will be asking a few questions to Participant 802. On the next screen, simply select your desired question using the mouse by your right hand. 
            
            Participant 802: You will be answering to the questions showing on your screen by typing with the keyboard provided to you. We do encourage you to try to give honest answers to ensure the best results. 
            
            Keep in mind: There is no need for you to talk or make any sound. 
            
            Simply click on your desired question or type in your answers in the chat window, and our system will take care of the rest for you.
            
            Thank you for choosing The Mirror Room, and enjoy!
        `);
        // msg.pitch = 1.5;
        // msg.voice = window.speechSynthesis.getVoices()[17]

        window.speechSynthesis.speak(msg);
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
                        A question will appear here.<br/>
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
                    Welcome, Participant 802! Thank you for signing up with The Mirror Room. Here, we aim to create the romantic experience that is best tailored to your needs. Don’t worry, the entire process is anonymous, as we regard our client’s safety and privacy as our top priority. 
                    <br/><br/>
                    You will be answering to the questions appearing on your screen by typing with the keyboard provided to you. We do encourage you to try to give honest answers to ensure the best results. There is no need for you to talk or make any sound. 
                    <br/><br/>
                    Thank you for choosing The Mirror Room, and enjoy. 
                    </div>
                </div>

                <div className={outroClassnames}>
                    <div className="answers-outro-text">
                        Thank you for visiting the The Mirror Room.
                    </div>
                </div>
            </div>
        )
    }
}