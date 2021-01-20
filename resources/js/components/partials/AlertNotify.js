import React from "react";
import Fade from '@material-ui/core/Fade';
import Alert from '@material-ui/lab/Alert';

const handleAlertWarningClick = (e) => {
  e.preventDefault();

  document.querySelector('.alert-default').remove();
}

const AlertNotify = ({show, message}) => {
return (
      <div>
         { show ? (
            <div className="alert alert-warning alert-default" role="alert">
              <button type="button" className="close-alert" onClick={handleAlertWarningClick}>×</button>
              {message}
            </div>) : null}
      </div>      
   );
};

export default AlertNotify;