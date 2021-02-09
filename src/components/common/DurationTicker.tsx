import React, { useEffect, useState } from 'react';
import { formatDuration } from '../../utils/time';

interface Props {
  startTimestamp: number;
}

export default function DurationTicker(props: Props) {
  const [currentTimestamp, setCurrentTimestamp] = useState(Date.now());

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setCurrentTimestamp(Date.now());
    }, 1000);
    return () => clearTimeout(timeoutId);
  });

  return <span>{formatDuration((currentTimestamp - props.startTimestamp) / 1000)}</span>;
}
