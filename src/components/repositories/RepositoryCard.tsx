import React from 'react';

import Card from '@mui/material/Card';

interface Props {
  className?: string;
}

export default function RepositoryCard(props: Props) {
  return (
    <Card className={props.className} elevation={0} sx={{ border: '1px solid #00000012', width: '100%' }}>
      Repo card
    </Card>
  );
}
