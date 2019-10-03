import React from 'react'
import Link from 'next/link'
import classnames from 'classnames'
import io from 'socket.io-client'
import Style from '../static/styles/main.less'
import Head from '../components/Head'

const QUESTIONS = [
    [
        { text: 'If you could invite anyone in the world to dinner, who would it be?' },
        { text: 'Would you like to be famous? In what way?' },
        { text: 'Before making a telephone call, do you ever rehearse what you are going to say? Why?' },
        { text: 'What would constitute a “perfect” day for you?' },        
    ],
    [
        { text: 'When did you last sing to yourself? To someone else?' },
        { text: 'Do you have a secret hunch about how you will die?' },
        { text: 'For what in your life do you feel most grateful?' },
        { text: 'If you could change anything about the way you were raised, what would it be?' },        
    ],
    [
        { text: 'Is there something that you’ve dreamed of doing for a long time? Why haven’t you done it?' },
        { text: 'What is the greatest accomplishment of your life? ' },
        { text: 'What do you value most in a friendship?' },
        { text: 'If you knew that in one year you would die suddenly, would you change anything about the way you are now living? Why?' },        
    ]
]

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
            <div className="questions-container">
                { QUESTIONS.map(row => {
                    return (
                        <div className="questions-row-container">
                            { row.map(el => {
                                return (
                                    <div className="questions-element-container">
                                        <div className="question-element">{el.text}</div>
                                    </div>
                                )
                            })}
                        </div>
                    )
                })}
            </div>
        )
    }
}