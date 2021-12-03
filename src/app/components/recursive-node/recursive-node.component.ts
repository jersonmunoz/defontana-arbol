import { Component, OnInit,Input } from '@angular/core';
import { NodeN } from 'src/app/interfaces/nodes';

@Component({
  selector: 'app-recursive-node',
  templateUrl: './recursive-node.component.html',
  styleUrls: ['./recursive-node.component.css']
})
export class RecursiveNodeComponent implements OnInit {
  @Input() node: NodeN = {ID:"",Parent:"",Name:"",Children:[]};
  constructor() { }

  ngOnInit(): void {
  }

}
