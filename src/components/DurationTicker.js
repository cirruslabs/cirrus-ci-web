import React from 'react';
import { formatDuration } from '../utils/time';

class DurationTicker extends React.Component {
  render() {
    let durationInSeconds = (Date.now() - this.props.timestamp) / 1000;
    setTimeout(() => this.forceUpdate(), 1000);
    return <span>{formatDuration(durationInSeconds)}</span>;
  }
}

export default DurationTicker;
