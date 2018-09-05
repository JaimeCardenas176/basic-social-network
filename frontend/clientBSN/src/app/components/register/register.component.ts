import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
	public title:string;

	constructor(){
	this.title = 'Regístrate';
	}

	ngOnInit(){
		console.log('componente de register cargado');
	}

}
