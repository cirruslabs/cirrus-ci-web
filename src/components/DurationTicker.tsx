import React from 'react';
import { formatDuration } from '../utils/time';

interface Props {
  timestamp: number;
}

class DurationTicker extends React.Component<Props> {
  render() {
    let durationInSeconds = (Date.now() - this.props.timestamp) / 1000;
    setTimeout(() => this.forceUpdate(), 1000);
    return <span>{formatDuration(durationInSeconds)}</span>;
  }
}

export default DurationTicker;
