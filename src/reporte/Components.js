import React from 'react';
import {ScatterChart, Scatter, LineChart, Line, BarChart,Bar, XAxis, YAxis, ZAxis, CartesianGrid, Tooltip, Legend} from 'recharts';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';

//const ipp ="http://10.115.43.98:" ;
//const ipp ="http://10.116.92.88:" ;
const ipp ="http://localhost:";

const colores= ["#1354d8","#e85f5f","#c27bf2","#f3b428","#96f961",
                "#80b0f7","#f961ad","#13ef90","#8a61f9","#f9ab61",
                "#a4c4e8","#e8a4a4","#a4e8db","#e2bcdc","#d9dd68"];
const gamaAzul= ["#1184ff","#8cbdf2","#0d62bc","#386799","#4b6c8e",
                  "#c2ddf9","#8da9c6","#6fa1d6","#4d88c6","#2f77c4",
                  "#00438c","#042c56","#597089","#2f78c6","#59a7f9"];
const widthDef = 1400;
const heightDef = 500;

const Components = {
  displayName: 'drawLine1',
  Texto:(a,b) => React.createElement(
                                    String(a.configuracion.tipo || "p"),
                                    null,
                                    b[a.contenido.trim()] || a.contenido
                                  ),
   Lineas:(a,vars) =>{
   let conf = a.configuracion;
   let color = (conf.color || []).concat(colores);
   let x= conf.x || "";
   let dat= a.contenido;

   if(dat[0] == "$") dat= vars[dat] || [];

   let series = conf.series || [];
   if(series.length === 0 && dat.length !=0){
       Object.keys(dat[0]).forEach( k=>{
           if(x!=k) series.push(k);
       });
   }
   let lineas = series.map((serie,i)=> <Line key={i} type="monotone" dataKey={serie} stroke={color[i]} />);
   return (
           <LineChart width={conf.ancho || widthDef * a.columna/12 } height={conf.alto || heightDef * a.columna/15 } data={dat} margin={{top: 10, right: 5, left: 15, bottom: 15}}>
             <XAxis dataKey={conf.x}/>
              <YAxis/>
              <CartesianGrid strokeDasharray="2 2"/>
              <Tooltip/>
              <Legend/>
              {lineas}
            </LineChart>
   );
 },
  Barras:(a,vars) =>{
    let conf = a.configuracion;
    let color = (conf.color || []).concat(colores);
    let x= conf.x || "";
    let dat= a.contenido;
    if(dat[0] == "$") dat= vars[dat] || [];

    let series = conf.series || [];
    if(series.length === 0 && dat.length !=0){
        Object.keys(dat[0]).forEach( k=>{
            if(x!=k) series.push(k);
        });
    }

    let barras = series.map((serie,i)=> <Bar key={i} type="monotone" dataKey={serie} fill={color[i]} />);
    return (
      <BarChart width={conf.ancho || widthDef * a.columna/12 } height={conf.alto || heightDef * a.columna/15 } data={dat} margin={{top: 5, right: 15, left: 15, bottom: 5}}>
            <XAxis dataKey={conf.x}/>
            <YAxis/>
            <CartesianGrid strokeDasharray="2 2"/>
            <Tooltip/>
            <Legend/>
           {barras}
      </BarChart>
    );
  },
  Scatter:a =>{
    let conf = a.configuracion;
    let color = (conf.color || []).concat(colores);

    let grupos = {};
    a.contenido.forEach(rw =>{
        grupos[rw[conf.grupos]] = grupos[rw[conf.grupos]] || [] ;
        grupos[rw[conf.grupos]].push(rw);
    });

    let scatter = [];
    Object.keys(grupos).forEach( (k,i) => {
        scatter.push(<Scatter key={i} name={k} data={grupos[k]} fill={color[i]} />);
    });

    return (
      <ScatterChart width={conf.ancho || widthDef * a.columna/12 } height={conf.alto || heightDef * a.columna/8 } >
          <XAxis dataKey={conf.x} name={conf.x} unit={conf.unidadX || ' '}/>
          <YAxis dataKey={conf.y} name={conf.y} unit={conf.unidadY || ' '}/>
          {(conf.z) && <ZAxis dataKey={conf.z} name={conf.z} range={conf.zRange || [5,200]}  unit={conf.unidadZ || ' '} />}
          <CartesianGrid />
          <Tooltip cursor={{strokeDasharray: '3 3'}}/>
          <Legend/>
          {scatter}
      </ScatterChart>
    );
  },
  Seleccion: (state,b,varAct) =>{
    return (
      <form>
        <div className="form-group">
          <select className="form-control" data-style="btn-info" onChange={(event)=>{varAct(event,state.configuracion)}} value={state.value}>//{state.value}>
              {state.contenido.split(",").map((o,i)=><option key={i}>{o}</option>)}
          </select>
        </div>
      </form>
    );
  },
  Imagen: state =>{
    let src = state.contenido;
    if(src.substring(0,1)!="h"){
      //src= ipp+"8000/pictures?picture=" + src;
      src= src;
    }
    return (
        <div >
            <img className="img-responsive" src={src} alt="Chania"/>
        </div>
    );
  },
  //Tabla: state =>{
  //  let dat= state.contenido;
  //  if(dat[0] == "$") dat= vars[dat] || [];
  //  console.log("dentro del componente tabla "+dat);
  //  let column = Object.keys(dat[0]).map( (k,i) => <TableHeaderColumn key={i} dataField={k} isKey={(i==0)}>{k}</TableHeaderColumn>);
  //  console.log(column);

  //  return (
  //    <div>
  //      <BootstrapTable data={dat} striped hover>
  //          {column}
  //      </BootstrapTable>
  //    </div>
  //  );
  //}

  Tabla: state =>{
    let dat= state.contenido;
    if(!(dat instanceof Object)){
        return(<p>error en data Tabla</p>);
    }else {
      if(dat[0] == "$") dat= vars[dat] || [];
      let column = Object.keys(dat[0]).map( (k,i) => <TableHeaderColumn key={i} dataField={k} isKey={(i==0)}>{k}</TableHeaderColumn>);

      return (
        <div>
        <BootstrapTable data={dat} height='auto' striped hover>
        {column}
        </BootstrapTable>
        </div>
      );
    }
  },

  Boton: a =>{
    let conf = a.configuracion;
    let dat= a.contenido;
      if(dat[0] == "$") dat= vars[dat] || [];
      let title = dat || "Presiona Aqui";

      return (
        <div>
          <button className = "btn btn-primary" style={{width: "100%"}} onClick={()=>{alert(conf);}}>
            {title}
          </button>
        </div>
      );

  }
};

export default Components;
export {ipp};
