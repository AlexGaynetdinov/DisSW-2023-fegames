import { Component, OnInit } from '@angular/core';
import { AccountService } from '../account.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit{
  // para indicar que pueden no tener valor definido se usa ?
  name? : string
	email? : string 
	pwd1? : string
  pwd2? : string

  constructor(private accountService : AccountService){ }

  ngOnInit() : void {
  }

  register() {
    let info = {
      name : this.name,
      email : this.email,
      pwd1 : this.pwd1,
      pwd2 : this.pwd2
    }
    this.accountService.register(info)
  }

}
