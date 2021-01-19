import React, { Fragment, useState } from "react";
import Fade from '@material-ui/core/Fade';
import Alert from '@material-ui/lab/Alert';

const styles = {
   alert: {
      left: '0',
      pointerEvents: 'none',
      position: 'fixed',
      top: 0,
      width: '100%',
      zIndex: '1500',
   }
};

const FadeFlash = ({isFlash, severity, message}) => {
	
return (
   <div>
      <Fade in={isFlash} timeout={{ enter: 300, exit: 1000 }}>
      <Alert style={styles.alert} onClose={() => {}} severity={severity}>{message}</Alert>
      </Fade>
   </div>
   );
};

export default FadeFlash;