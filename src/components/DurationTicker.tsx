import React from 'react';
import { formatDuration } from '../utils/time';

interface Props {
  startTimestamp: number;
}

interface State {
  currentTimestamp: number;
}

class DurationTicker extends React.Component<Props, State> {
  secondsTicker: NodeJS.Timeout;

  constructor(props: Props) {
    super(props);
    this.state = {
      currentTimestamp: Date.now(),
    };
  }

  componentDidMount() {
    clearInterval(this.secondsTicker);
    // we just need 1-second precision and only want to rerender once per second
    this.secondsTicker = setInterval(() => {
      this.setState({
        currentTimestamp: Date.now(),
      });
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.secondsTicker);
  }

  render() {
    return <span>{formatDuration((this.state.currentTimestamp - this.props.startTimestamp) / 1000)}</span>;
  }
}

export default DurationTicker;
