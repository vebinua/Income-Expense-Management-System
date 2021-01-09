import axios from 'axios';
import React, { useEffect,useState } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import * as Ladda from 'ladda';
import Alert from '@material-ui/lab/Alert';
import Fade from '@material-ui/core/Fade';

// import the ladda theme directly from the ladda package.
import 'ladda/dist/ladda-themeless.min.css';

export const axiosInstance = axios.create({
  baseURL: window.config.baseUrl,
  //timeout: 1000
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


class EditCategory extends React.Component {

   constructor (props) {
      super(props);

      console.log('constructor!');

        super(props);
        this.state = {
          categories: [],
          category: '',
          account_type: 'asset',
          user_id: 1,
          loading: false,
          flash: false,
          severity: 'success',
          flashMessage: '',
          isLoading: true
        }
        
      
      // bind
      this.handleLoad = this.handleLoad.bind(this);
      this.handleChange = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
      this.onOptionChange = this.onOptionChange.bind(this);
      this.runAfterRender = this.runAfterRender.bind(this);

      window.addEventListener('load', this.handleLoad);

      //this.ladda = Ladda.create(document.querySelector('.btn-submit'));
    }

    clearFields() {
      this.setState({ category: ''});
      this.setState({ account_type: 'asset'});
    }

    onOptionChange(e) {
      this.setState({
        account_type: e.target.value
      });

      console.log('onOptionChange', e.target.value);
    }

    handleChange(e) {
        this.setState({
           [e.target.name]: e.target.value
        });
        console.log('onChange', e.target.name);
    }

    
    handleSubmit(e) {
      e.preventDefault();
      let _btn = this.ladda;
      let _this = this;

      const data = {
        'category': this.state.category,
        'account_type': this.state.account_type,
        'user_id': this.state.user_id
      };

      this.ladda.start();

      axiosInstance.put('/api/categories/' + this.props.match.params.id, data)
      .then((res) => {

        _this.setState({ flash: true});
        
        if (res.data.status == 'fail') {
          _this.setState({ severity: 'error'});
        } else {
          _this.setState({ severity: 'success'});
        }

        _this.setState({ flashMessage: res.data.message});

        setTimeout(() => {
          _this.setState({ flash: false});
        }, 3500);

        _btn.stop();

      }).catch((error) => {
        console.log(error)
      });

      /*axiosInstance.post('/api/categories/', {data},{
        data: null,
        headers: { 
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        }
      
      })
      .then(function (response) {
        _this.setState({ flash: true});
        _this.setState({ severity: 'success'});
        _this.setState({ flashMessage: 'Category has been successfully added.'});

        setTimeout(() => {
          _this.setState({ flash: false});
        }, 3500);

        _btn.stop();
        _this.clearFields();
      })
      .catch(function (error) {
        _btn.stop();
          console.log(error);
          _this.clearFields();
      });*/
    }

    handleLoad(e) {
      
      //this.ladda = Ladda.create(document.querySelector('.btn-submit'));
    }

    componentDidMount() {
      
      this.ladda = Ladda.create(document.querySelector('.btn-submit'));
      
      axiosInstance.get('/api/categories/' + this.props.match.params.id)
      .then(res => {
        this.setState({
          category: res.data.category,
          account_type: res.data.account_type,
          user_id: res.data.user_id,
          isLoading: false
        });
        console.log(res);
        console.log(res.data.category);
      })
      .catch((error) => {
        console.log(error);
      });
    }

    runAfterRender() {
      console.log('rendered!');
    }

    /*initLadda() {
      this.ladda.btn = Ladda.create(document.querySelector('.btn-info'));
    }*/


  render() {
    //const [flash, setFlash] = useState(null);
    //const { isLoading } = this.state;

    return (
       <div>

        {
            <Fade in={this.state.flash} timeout={{ enter: 300, exit: 1000 }}>
            <Alert style={styles.alert} onClose={() => {}} severity={this.state.severity}>{this.state.flashMessage}</Alert>
            </Fade>
        }

       
        
            <h2>Edit Category</h2>
            
            <div className="form-container">
              <div className="row">
                <div className="col-4">

                        <form onSubmit={this.handleSubmit} className={this.state.isLoading ? "hide-form" : ""}>
                      
                          <div className="form-group">
                            <label htmlFor="Category">Category</label>
                            <input type="text" className="form-control" id="category" name="category" placeholder="Category" value={this.state.category} 
                            onChange={this.handleChange}  />
                          </div>

                          <div className="form-group">
                            <label>Account Type</label>
                            <div className="custom-control custom-radio">
                                <input type="radio" id="asset" name="account_type" value="asset" className="custom-control-input" 
                                checked={this.state.account_type === 'asset'} 
                                onChange={this.onOptionChange} />
                                <label className="custom-control-label" htmlFor="asset">Asset</label>
                            </div>
                            <div className="custom-control custom-radio">
                                <input type="radio" id="liability" name="account_type" value="liability" className="custom-control-input" 
                                checked={this.state.account_type === 'liability'} 
                                onChange={this.onOptionChange} />
                                <label className="custom-control-label" htmlFor="liability">Liability</label>
                            </div>
                          </div>

                    <input type="hidden" name="user_id" value={this.state.user_id}/>
                    <div onLoad={this.runAfterRender}>
                      <button type="submit" className="btn btn-info btn-submit ladda-button" data-style="expand-left">Update Category</button>
                    </div>
                  </form>
                </div>
              </div>
            </div>

            </div>


    )
  }
}
export default EditCategory;
