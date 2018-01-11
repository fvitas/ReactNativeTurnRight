import React, { Component } from 'react'
import { Dimensions, StyleSheet, View, TouchableWithoutFeedback } from 'react-native'
import Svg, {Circle, Rect } from 'react-native-svg'

const window = Dimensions.get('window');

export default class App extends Component {

    constructor() {
        super()

        this.state = {
            x: window.width / 9,
            y: window.height / 2.5,
            deltaX: 0,
            deltaY: -1,
            turnAngle: -Math.PI / 2,
            rotation: 0
        }

        this.tick = this.tick.bind(this)
        this.onTouchStart = this.onTouchStart.bind(this)
        this.onTouchEnd = this.onTouchEnd.bind(this)
        this.innerCollision = this.innerCollision.bind(this)
        this.outerCollision = this.outerCollision.bind(this)
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
            this.angle = Math.min(this.angle + 0.01, 2)
            rotation = (rotation + this.angle) % 360

            // turnAngle is in radians
            turnAngle = (turnAngle + this.angle * Math.PI / 180) % (2 * Math.PI)

            deltaX = Math.cos(turnAngle)
            deltaY = 0.8 * Math.sin(turnAngle)

            // to make it drift more, i must include inertia and more rotation in equation
            // more complex then this
            // rotation += 1

        } else {
            this.angle = 1.5
        }

        let newX = Number((x + acceleration * deltaX).toFixed(2))
        let newY = Number((y + acceleration * deltaY).toFixed(2))

        this.setState(prevState => ({
            x: newX,
            y: newY,
            deltaX,
            deltaY,
            turnAngle,
            rotation
        }))

        let hit1, hit2, hitOuter1
        let xPoint1 = newX
        let yPoint1 = newY
        let xPoint2 = xPoint1 + 18 * Math.cos(rotation * Math.PI / 180).toFixed(2)
        let yPoint2 = yPoint1 + 18 * Math.sin(rotation * Math.PI / 180).toFixed(2)

        hit1 = this.innerCollision(xPoint1, yPoint1)
        hit2 = this.innerCollision(xPoint2, yPoint2)

        hitOuter1 = this.outerCollision(xPoint1, yPoint1)

        if (hit1 || hit2 || hitOuter1) {
            // hit in inner or outer rounded rect, stop game
        } else {
            requestAnimationFrame(this.tick)
        }
    }

    onTouchStart() {
        this.touched = true
    }

    onTouchEnd() {
        this.touched = false
    }

    innerCollision(x, y) {
        let hitMargin = 2,
            circleCenterX = 150,
            circleCenterY = 150,
            circleR = 55 - hitMargin

        if (y < 150) {

            return Math.pow((x - circleCenterX), 2) + Math.pow((y - circleCenterY), 2) < Math.pow(circleR, 2)

        } else if (y > 150 && y < 350) {
            let leftSide = 95 + hitMargin,
                rightSide = 205 - hitMargin

            return (x > leftSide) && (x < rightSide)

        } else if (y > 350) {
            circleCenterY = 350

            return Math.pow((x - circleCenterX), 2) + Math.pow((y - circleCenterY), 2) < Math.pow(circleR, 2)
        }

        return false
    }

    outerCollision(x, y) {
        let hitMargin = 2,
            circleCenterX = 150,
            circleCenterY = 150,
            circleR = 145 + hitMargin

        if (y < 150) {

            return Math.pow((x - circleCenterX), 2) + Math.pow((y - circleCenterY), 2) > Math.pow(circleR, 2)

        } else if (y > 150 && y < 350) {
            let leftSide = 5 - hitMargin,
                rightSide = 295 + hitMargin

            return x < leftSide || x > rightSide

        } else if (y > 350) {
            circleCenterY = 350

            return Math.pow((x - circleCenterX), 2) + Math.pow((y - circleCenterY), 2) > Math.pow(circleR, 2)
        }

        return false
    }

    render() {
        return (
            <View style={styles.container}>
                <TouchableWithoutFeedback onPressIn={this.onTouchStart} onPressOut={this.onTouchEnd}>
                    <Svg width='300' height='500'>
                        <Rect x='5' y='5' width='290' height='490' rx='145' ry='145' fill='#9FA8DA'/>
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
