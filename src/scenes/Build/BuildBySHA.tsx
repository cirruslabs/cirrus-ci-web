import React from 'react';
import NotFound from '../NotFound';
import { useParams } from 'react-router-dom';

export default function BuildBySHA() {
  let { owner, name, SHA } = useParams();

  if (!owner || !name || !SHA) {
    return <NotFound />;
  }
}
