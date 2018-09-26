import { Component, OnInit } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { User } from '../../models/user';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})

export class RegisterComponent implements OnInit {
	public title:string;
	public user: User;

	constructor(){
		this.title = 'Regístrate',
		this.user = new User(
			"",
			"",
			"",
			"",
			"",
			"",
			"ROLE_USER",
			""
		);
	}

	ngOnInit(){
		console.log('componente de register cargado');
	}
	ngOnSubmit(){
		console.log(this.user);
	}


}
