import React from 'react';
import Components from './Components';


var bdd1 = "rep_test";//BDD ORIGEN leer desde un archivo externo



class Reporte extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
                  menu: {},//vistas a desplegar en el menu (opciones)
                  vistaQuery: [],//vista
                  variables: {barra:'granTest'},//??? GUARDA _ Y $
                  varBDD: {},//guarda el resultado de las queries dentro de las queries
                  basesX: {}//guarda  los $pot completos
  }
  this.varAsign=this.varAsign.bind(this);
}


 componentWillMount(){
   let that = this;
   let menu = queryDB("SELECT name FROM sqlite_master WHERE type='table'",bdd1);
   let aux = [];
   Object.keys(menu).forEach(k=>aux.push(menu[k][0]));
   that.setState({menu : aux});
 }

 onSelectDB (opcion) {
   let thisSave1 = this;
   let basesX = {};
   let varBDD = {};
   let vars = {};
   let query = {}
   query = queryDB("SELECT * FROM "+opcion, bdd1);

        query.forEach((a,i)=>{//CICLO UNO
            let bdd2=bdd1
            if(a.configuracion){
              if (a.configuracion[0]==""){
                  try {
                    a.configuracion=JSON.parse(a.configuracion.replace(/null/g,' '));
                  }catch(e) {
                    a.configuracion={};
                    alert(e); //error in the above string (in this case, yes)!
                  }
                }else if(a.configuracion[0]=="_"){
                  vars[a.configuracion] = (a.componente!="Seleccion")?
                                          a.contenido: a.contenido.split(",")[0];
                                        }else if(a.configuracion[0]=="$"){
                                          basesX[a.configuracion]=a.contenido;
                                          if(a.contenido[0] != "#"){
                                            basesX[a.configuracion]="none";
                                            vars[a.configuracion]=a.contenido;
                                          }else{
                                            basesX[a.configuracion]=a.contenido;
                                          }
                                        }
                                        a.componente = a.componente.trim();
            }
      });//fin primer ciclo (relleno de vars y baseX)


     query.forEach((a,i)=>{//CICLO 2 QUERIES ## y #@
        let bdd2=bdd1
        if(a.contenido.substring(0,2)=='##')//SI ENCUENTRA ## EN CONTENIDO
        {
          varBDD[a.contenido] = a.contenido;

          if(varBDD[a.contenido].indexOf(":") > -1)//encuentra : en el string
          {
            varBDD[a.contenido]=varBDD[a.contenido].split(":");
            bdd2 = varBDD[a.contenido][0].substring(2).trim();
            varBDD[a.contenido] = varBDD[a.contenido][1].trim();
          }
          varBDD[a.contenido]=varBDD[a.contenido].substring(varBDD[a.contenido].toLowerCase().indexOf('select'));

          if(Object.keys(vars).length !== 0){
               Object.keys(vars).forEach(va=>{
                 if(varBDD[a.contenido].includes(va)){
                   varBDD[a.contenido] = varBDD[a.contenido].replace(va,vars[va]).trim();
                 }
               })
          }
          varBDD[a.contenido] = queryDB(varBDD[a.contenido],bdd2);
        }//FIN SI ENCUENTRA ##



        if(a.contenido.substring(0,2)=='#@')//SI ENCUENTRA #@ EN CONTENIDO
        {
           varBDD[a.contenido] = a.contenido;
           if(varBDD[a.contenido].indexOf(":") > -1)//encuentra : en el string
           {
             varBDD[a.contenido]=varBDD[a.contenido].split(":")
             bdd2 = varBDD[a.contenido][0].substring(2).trim();
             varBDD[a.contenido] = varBDD[a.contenido][1].trim();

           }
           varBDD[a.contenido]=varBDD[a.contenido].substring(varBDD[a.contenido].toLowerCase().indexOf('select'));

           if(Object.keys(vars).length !== 0){
                Object.keys(vars).forEach(va=>{
                  if(varBDD[a.contenido].includes(va)){
                    varBDD[a.contenido] = varBDD[a.contenido].replace(va,vars[va]).trim();
                  }
                })
           }

           varBDD[a.contenido] = queryDB(varBDD[a.contenido],bdd2);
        }//FIN SI ENCUENTRA #@

        if(a.contenido[0]=='$')//SI ENCUENTRA $
        {
          varBDD[a.contenido] = basesX[a.contenido];//contenido es igual

          if(varBDD[a.contenido].indexOf(":") > -1)//encuentra : en el string
          {
            varBDD[a.contenido]=varBDD[a.contenido].split(":");
            bdd2 = varBDD[a.contenido][0].substring(2).trim();
            varBDD[a.contenido] = varBDD[a.contenido][1].trim();
          }
          varBDD[a.contenido]=varBDD[a.contenido].substring(varBDD[a.contenido].toLowerCase().indexOf('select'));
          if(Object.keys(vars).length !== 0){
               Object.keys(vars).forEach(va=>{
                 if(varBDD[a.contenido].includes(va)){
                   vars[a.contenido] = varBDD[a.contenido].replace(va,vars[va]).trim();
                 }
               })
          }
          vars[a.contenido] = queryDB(vars[a.contenido],bdd2);
        }//FIN SI ENCUENTRA $

      });
            thisSave1.setState({vistaQuery: query, basesX: basesX, variables: vars, varBDD: varBDD})
 }

 varAsign (evento, variable) {//evento y _barra ...
   let vars = this.state.variables;
   let thisSave1 = this;
   let varBDD = this.state.varBDD;
   let query = this.state.vistaQuery;
   let basesX = this.state.basesX;

   vars[variable]=evento.target.value;
   query.forEach(a=>{
     let bdd2=bdd1
     Object.keys(varBDD).forEach(key=>{
        if(a.contenido == key){

          if(a.contenido.substring(0,2)=='##')//SI ENCUENTRA DOBLE GATO EN CONTENIDO
          {
            varBDD[a.contenido] = a.contenido;

            if(varBDD[a.contenido].indexOf(":") > -1)//encuentra : en el string
            {
              varBDD[a.contenido]=varBDD[a.contenido].split(":");
              bdd2 = varBDD[a.contenido][0].substring(2).trim();
              varBDD[a.contenido] = varBDD[a.contenido][1].trim();
            }
            varBDD[a.contenido]=varBDD[a.contenido].substring(varBDD[a.contenido].toLowerCase().indexOf('select'));

            if(Object.keys(vars).length !== 0){
                 Object.keys(vars).forEach(va=>{
                   if(varBDD[a.contenido].includes(va)){
                     varBDD[a.contenido] = varBDD[a.contenido].replace(va,vars[va]).trim();
                   }
                 })
            }
            varBDD[a.contenido] = queryDB(varBDD[a.contenido],bdd2);
          }//FIN SI ENCUENTRA ##



          if(a.contenido.substring(0,2)=='#@')//SI ENCUENTRA #@ EN CONTENIDO
          {
             varBDD[a.contenido] = a.contenido;
             if(varBDD[a.contenido].indexOf(":") > -1)//encuentra : en el string
             {
               varBDD[a.contenido]=varBDD[a.contenido].split(":")
               bdd2 = varBDD[a.contenido][0].substring(2).trim();
               varBDD[a.contenido] = varBDD[a.contenido][1].trim();

             }
             varBDD[a.contenido]=varBDD[a.contenido].substring(varBDD[a.contenido].toLowerCase().indexOf('select'));

             if(Object.keys(vars).length !== 0){
                  Object.keys(vars).forEach(va=>{
                    if(varBDD[a.contenido].includes(va)){
                      varBDD[a.contenido] = varBDD[a.contenido].replace(va,vars[va]).trim();
                    }
                  })
             }

             varBDD[a.contenido] = queryDB(varBDD[a.contenido],bdd2);
          }//FIN SI ENCUENTRA #@
        }
     })

     if(a.contenido[0]=='$')//SI ENCUENTRA $
     {
       varBDD[a.contenido] = basesX[a.contenido];//contenido es igual

       if(varBDD[a.contenido].indexOf(":") > -1)//encuentra : en el string
       {
         varBDD[a.contenido]=varBDD[a.contenido].split(":");
         bdd2 = varBDD[a.contenido][0].substring(2).trim();
         varBDD[a.contenido] = varBDD[a.contenido][1].trim();
       }
       varBDD[a.contenido]=varBDD[a.contenido].substring(varBDD[a.contenido].toLowerCase().indexOf('select'));
       if(Object.keys(vars).length !== 0){
            Object.keys(vars).forEach(va=>{
              if(varBDD[a.contenido].includes(va)){
                vars[a.contenido] = varBDD[a.contenido].replace(va,vars[va]).trim();
              }
            })
       }
       vars[a.contenido] = queryDB(vars[a.contenido],bdd2);
     }//FIN SI ENCUENTRA



   })

   thisSave1.setState({vistaQuery: query, variables: vars, varBDD: varBDD})

 }

render() {
  //menu
  let opciones = this.state.menu
  let menuHorizontal = "nothing to show";
  let options = [];

  if(opciones !== ""){
    let randomOptions = Object.keys(opciones).forEach((key,i)=>options.push(<li key={i} onClick={() => { this.onSelectDB(opciones[key])}}><a href="#">{opciones[key]}</a></li>));
    menuHorizontal = (<nav className="navbar navbar-default">
                              <ul className="nav navbar-nav">{options}</ul>
                      </nav>);
  }
  //fin-menu

  //body
  let vista=[];
  let vistatemp=[];
  let fila=1;
  let varBDD=this.state.varBDD;
  let vistaArray = this.state.vistaQuery;

  vistaArray.forEach((a,i)=>{
      if(fila!=a.fila && Number.isInteger(a.fila) ){
        vista.push(<div key={i} className={'row id'+fila}>{vistatemp}</div>);
        vistatemp=[];
        fila = a.fila;
      }
      if (Components[a.componente] && a.contenido) {
          if(varBDD[a.contenido] && a.contenido[0] !== '$'){
            a.contenido=varBDD[a.contenido]
          }
          vistatemp.push(<div key={i} className={"col-xs-"+(a.columna || 1)}>
                            {Components[a.componente](a,this.state.variables,this.varAsign)}
                        </div>);
        }
  });
  vista.push(<div className={'row id'+fila} key={this.state.vistaQuery.length}>{vistatemp} </div>);
    //fin-body

return (
      <div>
      {menuHorizontal}
      {vista}
      </div>
    );
  }
}

export default Reporte;
