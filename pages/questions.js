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
        { text: '5' },
        { text: '6' },
        { text: '7' },
        { text: '8' },        
    ],
    [
        { text: '9' },
        { text: '10' },
        { text: '11' },
        { text: '12' },        
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
                                        {el.text}
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