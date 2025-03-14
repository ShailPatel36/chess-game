import { Grid } from '@mui/material';

export default function MiddelFlexBox({ children }) {
  return (
    <Grid container justifyContent="center" alignItems="center">
      {children}
    </Grid>
  );
}
