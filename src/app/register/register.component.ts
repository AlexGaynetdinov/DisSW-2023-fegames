import { Component, OnInit } from '@angular/core';
import { AccountService } from '../account.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit{
  name? : string
  email? : string
  pwd1? : string
  pwd2? : string

  constructor(private accountService : AccountService) {  }

  ngOnInit(): void {  }

  register() {
    // Comprobamos espacios en blanco para prevenir inyeccion SQL
    if (this.name?.includes(" ") || this.email?.includes(" ")
    || this.pwd1?.includes(" ") || this.pwd2?.includes(" ")) {
      alert("Los campos no pueden contener espacios en blanco")
      return
    }

    let info = {
      name : this.name,
      email : this.email,
      pwd1 : this.pwd1,
      pwd2 : this.pwd2
    }
    this.accountService.register(info)
  }
}
