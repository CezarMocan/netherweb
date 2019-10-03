import React from 'react'
import Link from 'next/link'
import classnames from 'classnames'
import io from 'socket.io-client'
import Style from '../static/styles/main.less'
import Head from '../components/Head'

const QUESTIONS = [
    [
        { id: 1, text: 'If you could invite anyone in the world to dinner, who would it be?' },
        { id: 2, text: 'Would you like to be famous? In what way?' },
        { id: 3, text: 'Before making a telephone call, do you ever rehearse what you are going to say? Why?' },
        { id: 4, text: 'What would constitute a “perfect” day for you?' },        
    ],
    [
        { id: 5, text: 'When did you last sing to yourself? To someone else?' },
        { id: 6, text: 'Do you have a secret hunch about how you will die?' },
        { id: 7, text: 'For what in your life do you feel most grateful?' },
        { id: 8, text: 'If you could change anything about the way you were raised, what would it be?' },        
    ],
    [
        { id: 9, text: 'Is there something that you’ve dreamed of doing for a long time? Why haven’t you done it?' },
        { id: 10, text: 'What is the greatest accomplishment of your life? ' },
        { id: 11, text: 'What do you value most in a friendship?' },
        { id: 12, text: 'If you knew that in one year you would die suddenly, would you change anything about the way you are now living? Why?' },        
    ]
]

export default class Index extends React.Component {
    state = {
        highlightedId: null,
        clickedId: null
    }
    socket = null
    questionRefs = {}

    socketSetup() {
        if (!this.socket) {
            this.socket = io();
            this.socket.emit('iam', { type: 'QUESTIONS' })
            this.socket.on('action:mouseMove', this.onActionMouseMove)
        }      
    }

    pointInRect(p, r) {
        if (p.x >= r.left && p.y >= r.top && p.x <= r.right && p.y <= r.bottom) return true
        return false
    }

    onActionMouseMove = (message) => {
        const lPX = message.x * window.innerWidth
        const tPX = message.y * window.innerHeight

        if (this._fakeMouse) {
            this._fakeMouse.style.left = `${lPX}px`
            this._fakeMouse.style.top = `${tPX}px`
        }

        let highlightedId = null

        Object.keys(this.questionRefs).forEach(qID => {
            let qR = this.questionRefs[qID]
            const inRect = this.pointInRect({ x: lPX, y: tPX }, qR.getBoundingClientRect())
            if (inRect) highlightedId = qID
        })

        if (highlightedId != this.state.highlightedId) {
            this.setState({ highlightedId })
        }
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
        const { highlightedId, clickedId } = this.state
        return (
            <div>
                <div 
                    className="fake-mouse"
                    ref={(r) => this._fakeMouse = r}>
                </div>
                <div className="questions-container">                
                    { QUESTIONS.map(row => {
                        return (
                            <div className="questions-row-container">
                                { row.map(el => {
                                    const classes = classnames({
                                        "questions-element-container": true,
                                        "highlighted": el.id == highlightedId,
                                        "clicked": el.id == clickedId
                                    })

                                    return (
                                        <div 
                                            key={el.id} 
                                            className={classes}
                                            ref={(e) => this.questionRefs[el.id] = e}
                                        >
                                            <div className="question-element">{el.text}</div>
                                        </div>
                                    )
                                })}
                            </div>
                        )
                    })}
                </div>
            </div>
        )
    }
}