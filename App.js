import React, { Component } from 'react'
import { Platform, Dimensions, StyleSheet, View, TouchableWithoutFeedback} from 'react-native'
import Svg, { Ellipse, Circle, Rect, G, Line, Text } from 'react-native-svg'

const window = Dimensions.get('window');

export default class App extends Component {

    constructor() {
        super()

        this.state = {
            x: window.width / 8,
            y: window.height / 2,
            deltaX: 0,
            deltaY: -1,
            turnAngle: -Math.PI / 2,
            rotation: 0
        }

        this.tick = this.tick.bind(this)
        this.onTouchStart = this.onTouchStart.bind(this)
        this.onTouchEnd = this.onTouchEnd.bind(this)
    }

    componentDidMount() {
        requestAnimationFrame(this.tick)
    }

    componentWillUnmount() {
        cancelAnimationFrame(this.tick)
    }

    tick() {
        let { x, y, deltaX, deltaY, turnAngle, rotation } = this.state
        let acceleration = 3.5

        if (this.touched) {
            this.angle = Math.min(this.angle + 0.01,  2)
            rotation = (rotation + this.angle) % 360

            turnAngle = (turnAngle + this.angle * Math.PI / 180) % 360

            deltaX = Math.cos(turnAngle)
            deltaY = 0.8 * Math.sin(turnAngle)

            // to make it drift more, i must include inertia and more rotation in equation
            // more complex then this
            // rotation += 1

        } else {
            this.angle = 1.5
        }

        this.setState(prevState => ({
            x: Number((x + acceleration * deltaX).toFixed(2)),
            y: Number((y + acceleration * deltaY).toFixed(2)),
            deltaX,
            deltaY,
            turnAngle,
            rotation
        }))

        requestAnimationFrame(this.tick)
    }

    onTouchStart() {
        this.touched = true
    }

    onTouchEnd() {
        this.touched = false
    }

    render() {
        return (
            <View style={styles.container}>
                <TouchableWithoutFeedback onPressIn={this.onTouchStart} onPressOut={this.onTouchEnd}>
                    <Svg width='300' height='500'>
                        <Rect x='5' y='5' width='290' height='490' rx='150' ry='150' fill='#9FA8DA'/>
                        <Rect x='95' y='95' width='110' height='310' rx='55' ry='55' fill='white'/>
                        <Rect x={this.state.x} y={this.state.y} width='18' height='30' fill='black' rx='5' ry='5' origin={`${this.state.x},${this.state.y}`} rotation={this.state.rotation}/>
                    </Svg>
                </TouchableWithoutFeedback>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#eee'
    }
})
