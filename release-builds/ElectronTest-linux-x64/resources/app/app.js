import React from 'react';
import { render } from 'react-dom';
//import 'styles/styles.css'; //Webpack can import CSS files too!
import './node_modules/bootstrap/dist/css/bootstrap.min.css';
import DropzoneComponent from 'react-dropzone-component';
import './node_modules/react-dropzone-component/styles/filepicker.css';
import './node_modules/dropzone/dist/min/dropzone.min.css';
//import Gallery from './gallery/Gallery.js';
//import SelectGallery from './selectGallery/SelectGallery.js';


class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
                  titulo: "Dat Electron",
    };
  }

  render(){

    let componentConfig = { iconFiletypes: ['.jpg', '.png', '.gif'], maxFileSize: 7, showFiletypeIcon: true, postUrl: '/upload' };

    let dropzone = ""
      dropzone=(<div>
                      <DropzoneComponent  className="center-block" config={componentConfig}
                        eventHandlers={{ addedfile: (file) => this.actualiza()}}
                        djsConfig={{autoProcessQueue: true, createImageThumbnails: true}}/>
                        <hr />
                  </div>);


    return (<div className="container">
                <div className="page-header" style={{textAlign: "center"}}>
                  <h1>{this.state.titulo}</h1>
                </div>
                {dropzone}

          </div>);
  }
}

render(<App/>,
  document.getElementById('app')
);
