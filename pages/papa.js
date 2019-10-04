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
            this.socket.emit('iam', { type: 'PAPA' })
            this.socket.on('state:update', this.onStateUpdate)
            // this.socket.on('action:question', this.onNewQuestion)
            // this.socket.on('state:update', this.onStateUpdate)
        }      
    }

    onStateUpdate = (stateObject) => {
        const { state } = stateObject
        this.setState({ 
            installationState: state,
        })
    }

    onChangeState = (newState) => () => {
        const { installationState } = this.state
        if (installationState == newState) return
        if (!this.socket) return
        
        this.setState({ installationState: newState })
        this.socket.emit('updateInstallationState', { state: newState })
    }

    onPlayIntroSound = () => () => {
        this.socket.emit('playInstallationIntroSound')
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
        const { installationState } = this.state

        const startingClassnames = classnames({
            "state-button": true,
            "selected": installationState == INSTALLATION_STATES.STARTING
        })

        const activeClassnames = classnames({
            "state-button": true,
            "selected": installationState == INSTALLATION_STATES.ACTIVE
        })

        const finishedClassnames = classnames({
            "state-button": true,
            "selected": installationState == INSTALLATION_STATES.FINISHED
        })

        return (
            <div className="papa-container">
                <div className={'state-button'} onClick={this.onPlayIntroSound()}>
                    <div className="papa-button">
                        Play intro sound
                    </div>
                </div>

                <div className={startingClassnames} onClick={this.onChangeState(INSTALLATION_STATES.STARTING)}>
                    <div className="papa-button">
                        Starting
                    </div>
                </div>

                <div className={activeClassnames} onClick={this.onChangeState(INSTALLATION_STATES.ACTIVE)}>
                    <div className="papa-button">
                        Main action
                    </div>
                </div>

                <div className={finishedClassnames} onClick={this.onChangeState(INSTALLATION_STATES.FINISHED)}>
                    <div className="papa-button">
                        Finishing
                    </div>                    
                </div>
            </div>
        )
    }
}