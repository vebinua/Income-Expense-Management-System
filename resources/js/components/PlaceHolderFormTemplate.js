/*barebone template for rapid development (please remove on prod)*/
import axios from 'axios';
import React, { useEffect, useState, Fragment } from 'react';
import { Redirect } from 'react-router-dom';
import ReactDOM from 'react-dom';

import * as Ladda from 'ladda';
import Alert from '@material-ui/lab/Alert';
import Fade from '@material-ui/core/Fade';

// import the ladda theme directly from the ladda package.
import 'ladda/dist/ladda-themeless.min.css';
import { HandleLogout } from './helpers/HandleLogout';

export const axiosInstance = axios.create({
  baseURL: window.config.baseUrl
});

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

const AddWallet = () => {

   let ladda = null; 

   let [wallet, setWallet] = useState({
      wallet_name: '',
      initial_balance: '',
      currency_id: ''
   });

   let handleSubmit = (e) => {
      e.preventDefault();

      ladda.start();
   }   

   let handleChange = (e) => {
      let name = e.target.name;
      let value = e.target.value;

      wallet[name] = value;
      setWallet(wallet);   
   }

   React.useEffect(() => {
      ladda = Ladda.create(document.querySelector('.ladda-button'));
   }, []);

   return(
      <div>
         <h2>Add wallet</h2>

         <div className="form-container">
           <div className="row">
               <div className="col-4">

                  <form onSubmit={handleSubmit}>
                
                    <div className="form-group">
                      <label htmlFor="wallet_name">Wallet name</label>
                      <input type="text" className="form-control" id="wallet_name" name="wallet_name" 
                      placeholder="" onChange={handleChange} />
                    </div>

                    <div className="form-row">
                      <div className="form-group col-md-6">
                        <label htmlFor="initial_balance">Initial balance</label>
                        <input type="email" className="form-control" id="initial_balance" name="initial_balance" 
                        placeholder="" onChange={handleChange} />
                      </div>
                      <div className="form-group col-md-6">
                        <label htmlFor="currency_id">Currency</label>
                        <select id="currency_id" name="currency_id" className="form-control" onChange={handleChange} defaultValue="b">
                          <option value="a">Select currency...</option>
                          <option value="b">...</option>
                        </select>
                      </div>
                    </div>

                    <input type="hidden" name="user_id" value={''}/>
                    <div>
                      <button type="submit" className="btn btn-info btn-submit ladda-button" data-style="expand-left">Save</button>
                    </div>
                  </form>

               </div>
           </div>
         </div>
      </div>
   );
}

export default AddWallet;

