import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {View, Animated} from 'react-native';

export default class BlinkView extends Component {

  /**
   * Props validation
   * @type {Object} Ex: {
   *   element  : {any}     Blinking element type, can be 'View', 'Text' or any kind of <Element />, Default is 'View'
   *   children : {any}     Element displayed in within the <BlinkView>{...}</BlinkView>, it can be a {string} or any kind of <Element />, Default is null
   *   delay    : {number}  Delay between each blinks in miliseconds, Default is 1500 millisec
   *   blinking : {boolean} Defines if the element is currently blinkink, Default is true
   * }
   */
  static propTypes: Object = {
    element: PropTypes.any,
    children: PropTypes.any,
    delay: PropTypes.number,
    blinking: PropTypes.bool,
  };

  /**
   * Default props
   * @return {object} Default props for this element.
   */
  static defaultProps: Object = {
    element: View,
    children: null,
    delay: 1500,
    blinking: true,
  };

  /**
   * Init states
   * @return {object} states
   */
  constructor(props: Object, state: Object): Object {
    try {
      super(props);

      this.state = {
        delay: (props && props.delay) || 1500,
        blinkAnim: new Animated.Value(0),
      };
    } catch (err) {
      console.warn(err);
    }
  }

  startAnim = () => {
    this.state.blinkAnim.stopAnimation(() => {
      this.setState({blinkAnim: new Animated.Value(0)}, () => {
        Animated.loop(
          Animated.sequence([
            Animated.timing(this.state.blinkAnim, {
              toValue: 0,
              duration: this.state.delay,
              delay: this.state.delay / 3,
              useNativeDriver: true,
            }),
            Animated.timing(this.state.blinkAnim, {
              toValue: 1,
              duration: this.state.delay,
              useNativeDriver: true,
            }),
          ]),
        ).start();
      });
    });
  };

  componentDidMount = () => {
    if (this.props.blinking === true) {
      this.startAnim();
    }
  };

  componentDidUpdate = (
    prevProps: Readonly<P>,
    prevState: Readonly<S>,
    snapshot: SS,
  ) => {
    if (prevProps.blinking != this.props.blinking) {
      this.props.blinking
        ? this.startAnim()
        : this.state.blinkAnim.stopAnimation(() => {
            this.setState({blinkAnim: new Animated.Value(1)});
          });
    }
    if(prevProps.delay != this.props.delay){
        this.setState({delay: this.props.delay}, ()=>{
          this.props.blinking
              ? this.startAnim()
              : this.state.blinkAnim.stopAnimation(() => {
                this.setState({blinkAnim: new Animated.Value(1)});
              });
        })
    }
  };

  componentWillUnmount = () => {
    this.state.blinkAnim.stopAnimation();
  };

  render() {
    try {
      const isBlinking: bolean = (this.props && this.props.blinking) || true;
      const Element: any =
        isBlinking === true
          ? Animated.createAnimatedComponent(
              (this.props && this.props.element) || View,
            )
          : (this.props && this.props.element) || View;

      return (
        <Element
          {...this.props}
          style={[
            this.props.style,
            {opacity: isBlinking === true ? this.state.blinkAnim : 1},
          ]}>
          {(this.props && this.props.children) || null}
        </Element>
      );
    } catch (err) {
      console.warn(err);
    }
    return (this.props && this.props.children) || <View />;
  }
}
