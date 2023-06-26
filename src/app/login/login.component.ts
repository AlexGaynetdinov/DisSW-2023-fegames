import { Component, OnInit } from '@angular/core';
import { AccountService } from '../account.service';
import { GamesService } from '../games.service';
import { Router } from '@angular/router';

declare let Stripe: any

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['../app.component.css', './login.component.css']
})

export class LoginComponent implements OnInit{
  name? : string
  pwd? : string
  message? : string
  loginCorrecto? : boolean
  stripe = Stripe("pk_test_51Mo0YCL0kXbyHZbW3VGY8Kw4b2HFr51TCc5cxH35Xvb24UiMQ6TG1G5hRTqPQWa93LWfGcJi9wKZfTdVXoG3jh4i00y95L5Za7")
  token? : string;

  constructor(private accountService : AccountService, private gamesService : GamesService, public router : Router) { }

  ngOnInit() : void {
    if (sessionStorage.getItem("tokenIsmael") != null) {
      this.loginCorrecto = true
    }
  }

  login() {
    // Comprobamos espacios en blanco para prevenir inyeccion SQL
    if (this.name?.includes(" ") || this.pwd?.includes(" ")) {
      alert("El nombre o contraseña no puede contener espacios en blanco.")
      return
    }

    let info = {
      name : this.name,
      pwd : this.pwd
    }
    this.accountService.login(info).subscribe({
      next : (respuesta) => {
        this.message = "Hola, " + this.name
        this.loginCorrecto = true
        sessionStorage.setItem("player", this.name!)
        sessionStorage.setItem("tokenIsmael", respuesta.tokenIsmael)
      },
      error : (respuesta) => {
        this.message = "Ha habido un error"
        this.loginCorrecto = false
      }
    })
  }

  requestGame() {
    this.gamesService.requestGame()
  }

  pay() {
    let self = this
    let req = new XMLHttpRequest()
    req.open("GET", "http://localhost/payments/prepay?amount=100")
    req.onreadystatechange = function() {
      if(req.readyState == 4) {
        if(req.status == 200) {
          self.token = req.responseText
          self.showform()
        } else {
          alert(req.statusText)
        }
      }
    }
    req.send()
    this.showform()
  }

  showform() {
    let elements = this.stripe.elements()
    let style = {
      base: {
        color: "#32325d", fontFamily: 'Arial, sans-serif',
        fontSmoothing: "antialiased", fontSize: "16px",
        "::placeholder": {
          color: "#32325d"
        }
      },
      invalid: {
        fontFamily: 'Arial, sans-serif', color: "#fa755a",
        iconColor: "#fa755a"
      }
    }
    let card = elements.create("card", { style : style })
    card.mount("#card-element")
    card.on("change", function(event : any) {
      document.querySelector("button")!.disabled = event.empty
      document.querySelector("#card-error")!.textContent =
      event.error ? event.error.message : ""
    });
    let self = this
    let form = document.getElementById("payment-form")
    form!.addEventListener("submit", function(event) {
      event.preventDefault()
      self.payWithCard(card)
    });
    form!.style.display = "block"
  }
  
  payWithCard(card: any) {
    let self = this
    this.stripe.confirmCardPayment(this.token, {
      payment_method: {
        card: card
      }
    }).then(function(response : any) {
      if (response.error) {
        alert(response.error.message)
      } else {
        if (response.paymentIntent.status === 'succeeded') {
          alert("Pago exitoso")
          self.paymentOK()
        }
      }
    });
  }

  paymentOK() {
    let self = this
    let payload = {
      token : this.token
    }
    let req = new XMLHttpRequest()
    req.open("POST", "http://localhost/payments/paymentOK")
    req.setRequestHeader("Content-Type", "application/json")
    req.onreadystatechange = function() {
      if(req.readyState == 4) {
        if(req.status == 200) {
          alert("Tu pago se ha completado")
        } else {
          alert(req.statusText)
        }
      }
    }
    req.send(JSON.stringify(payload))
  }
}