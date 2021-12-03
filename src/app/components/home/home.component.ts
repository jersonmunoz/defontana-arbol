import { Component, OnInit } from '@angular/core';
import { ConnectionService } from 'src/app/services/connection.service';
import { NodeN } from 'src/app/interfaces/nodes';
import {NestedTreeControl} from '@angular/cdk/tree';
import {MatTreeNestedDataSource} from '@angular/material/tree';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  showDiv1:boolean =true;
  httpError:boolean = false;
  public nodes : any;
  public tree : NodeN[] =[];                                                          
  treeControl = new NestedTreeControl<NodeN>(node => node.Children);
  dataSource = new MatTreeNestedDataSource<NodeN>();
  datos = {"data":[{"ID":"4","Name":"uryarchaeota","Parent":2},{"ID":"5","Name":"renarchaeota","Parent":2},{"ID":"6","Name":"orarchaeota","Parent":2},{"ID":"7","Name":"occals","Parent":3},{"ID":"1","Name":"ukaryota","Parent":0},{"ID":"2","Name":"rchaea","Parent":0},{"ID":"3","Name":"acteria","Parent":0},{"ID":"8","Name":"acilus","Parent":3},{"ID":"9","Name":"pirillum","Parent":3},{"ID":"10","Name":"Vibrio","Parent":3},{"ID":"11","Name":"Plants","Parent":1},{"ID":"12","Name":"Animals","Parent":1},{"ID":"13","Name":"Fungi","Parent":1},{"ID":"14","Name":"Protista","Parent":1},{"ID":"15","Name":"Nonvascular","Parent":11},{"ID":"16","Name":"Vascular","Parent":11},{"ID":"17","Name":"Seedless","Parent":16},{"ID":"18","Name":"With seed","Parent":16},{"ID":"19","Name":"Gymnosperm","Parent":18},{"ID":"20","Name":"Anglosperm","Parent":18},{"ID":"21","Name":"Basidiomycetes","Parent":13},{"ID":"22","Name":"Zygomicetes","Parent":13},{"ID":"23","Name":"Ascomycetes","Parent":13},{"ID":"25","Name":"Cnidarians","Parent":12},{"ID":"26","Name":"Bilateral","Parent":12},{"ID":"27","Name":"Arthopods","Parent":26},{"ID":"28","Name":"Vertebrates","Parent":26},{"ID":"29","Name":"Mollusks","Parent":26},{"ID":"30","Name":"Crustaceans","Parent":27},{"ID":"31","Name":"Arachnids","Parent":27},{"ID":"32","Name":"Myriapods","Parent":27},{"ID":"33","Name":"Insects","Parent":27},{"ID":"34","Name":"Cartilaginous Fish","Parent":28},{"ID":"35","Name":"Tetrapods","Parent":28},{"ID":"36","Name":"Bony Fish","Parent":28},{"ID":"37","Name":"Amphibians","Parent":35},{"ID":"38","Name":"Amniotes","Parent":35},{"ID":"39","Name":"Birds and  Reptiles","Parent":38},{"ID":"40","Name":"Mammals","Parent":38},{"ID":"41","Name":"Placentals","Parent":40},{"ID":"42","Name":"Marsupials","Parent":40},{"ID":"43","Name":"Monotremes","Parent":40},{"ID":"44","Name":"Turtles","Parent":39},{"ID":"45","Name":"Lizards","Parent":39},{"ID":"46","Name":"Snakes","Parent":39}]};
  constructor(private connectionService:ConnectionService) { 
  }
  ngOnInit(): void {
    this.getData();
  }

  changeDiv(){        /*Función para intercambiar entre divs a visualizar.*/
      this.showDiv1 = !this.showDiv1;
  }  
  hasChild = (_: number, node: NodeN) => !!node.Children && node.Children.length > 0;   /*Función de angular material Tree*/

  getData(){                                /* Función que obtiene los datos desde el servicio que consulta a la API*/
     this.connectionService.getJSONData().subscribe(response=>{  
          this.nodes = this.datos;                              /*Guarda la respuesta del servicio en nodes*/
          this.nodes = this.sortNodes(this.nodes.data);         /*Se ordenan los nodos*/
          this.tree =this.buildTree(this.nodes);                /*Se crea el árbol n-ario a partir de los nodos entreagodos en orden*/
          this.dataSource.data = this.tree;                     /*Se declara el árbol como fuente de datos para mostrarlos en mat-tree*/
          
     },
     error=>{
      this.httpError=true;
     });
  }
  sortNodes(nodes:any):NodeN[]{       /*Función que permite ordenar los nodos según los ID de los padres*/
    nodes.sort((a:any, b:any) => {
      return a.Parent - b.Parent;
    });
    return nodes;                     /*Retorna los nodos ordenados*/
  }
  buildTree(nodes:any):NodeN[]{       /*Función que genera el árbol usando la inserción de nodos de forma recursiva*/
    let nodes_aux = nodes;
    let root :NodeN= {ID:'0',Name:'Raíz',Parent:'-1',Children:[]};    /*Se añade un nodo raíz para poder generar un árbol*/
    nodes_aux.forEach((element:NodeN) => {
       this.insertRecursive(root,element.Name,element.ID,element.Parent);   /*Se utiliza la inserción recursiva  a partir del nodo raíz*/
    });
    let res : NodeN[] =[];                                              /*Transforma la respuesta del árbol para poder usarla como fuente de datos*/
    res.push(root);                                                     /*Para mat-tree*/
    return res;
  }
  insertRecursive(node:NodeN,nombre:string,id:string,padre:string){ /*Función recursiva que genera la inserción de los nodos del árbol n-ario*/
    let new_node: NodeN = {ID:id,Name:nombre,Parent:padre,Children:[]}; 

    if(node.ID == new_node.Parent){
      node.Children?.push(new_node);                              /*Condición de corte*/
    }
    else{
      for (let index = 0; index < node.Children!.length; index++) {     /*Recorrido en profundidad a través de los hijos del nodo indicado para*/
        this.insertRecursive(node.Children![index],nombre,id,padre);  /*la inserción de los nuevos nodos en los siguientes niveles*/
      }
    }
  }
  getLevel(data:any, node:NodeN ):any {                             /*Obtiene el nivel de los nodos para imprimirlos en pantalla */
    let path = data.find((branch:any) => {                          /*Obtiene el origen de datos dataSource para recorrer los hijos y obtener la*/ 
      return this.treeControl                                       /*profundidad del árbol n-ario dependiendo de la cantidad de nodos padres que posea*/
        .getDescendants(branch)
        .some(n => n.Name === node.Name);
    });
    return path ? this.getLevel(path.Children, node) + 1 : 0 ;      /*retorna el nivel de forma recursiva , en caso de no encontrar padres para el nodo*/
                                                                     /*retornará 0*/
  }
}