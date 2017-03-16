import React from 'react';
import { render } from 'react-dom';
//import './styles/styles.css'; //Webpack can import CSS files too!
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import Reporte from './reporte/Reporte';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
                  portBase: 5000
    };
  }
  componentWillMount(){
    this.setState({portBase : window.location.pathname.substring(1)});
  }
  render() {
        let print = (<Reporte/>);
    return print;
  }
}

render(<App />,
      document.getElementById('app')
);
