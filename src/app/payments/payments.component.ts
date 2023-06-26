import { Component, OnInit } from '@angular/core';
import { PaymentsService } from '../payments.service';

declare let Stripe : any

@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.css']
})
export class PaymentsComponent implements OnInit{
  user = sessionStorage.getItem("player")
  transactionId? : string
  stripe = Stripe("pk_test_51Mo0YCL0kXbyHZbW3VGY8Kw4b2HFr51TCc5cxH35Xvb24UiMQ6TG1G5hRTqPQWa93LWfGcJi9wKZfTdVXoG3jh4i00y95L5Za7")

  constructor(private paymentsService : PaymentsService) {  }

  ngOnInit(): void {  }

  requestPayment(quantity : Number) {
    this.paymentsService.prepay(quantity).subscribe({
      next : (response : any) => {
        this.transactionId = response.body
        this.showForm()
      },
      error : (response : any) => {
        alert(response.body)
      }
    })
  }

  showForm() {
    let elements = this.stripe.elements()
    let style = {
      base: {
        color : "#32325d",
        fontFamily : 'Arial, sans-sherif',
        fontSmoothing : "antialiased",
        fontSize : "16px",
        "::placeholder": {
          color : "#32325d"
        }
      },
      invalid: {
        fontFamily : 'Arial, sans-sherif',
        color : "#fa755a",
        ironColor : "#fa755a"
      }
    }

    let card = elements.create("card", {style : style})
    card.mount("#card-element")
    card.on("change", function(event : any) {
      document.querySelector("button")!.disabled = event.empty;
      document.querySelector("#card-error")!.textContent = event.error ? event.error.message : "";
    });

    let self = this
    let form = document.getElementById("payment-form");
    form!.addEventListener("submit", function(event) {
      event.preventDefault();
      self.payWithCard(card);
    })

    form!.style.display = "block"
  }

  payWithCard(card : any) {
    let self = this
    this.stripe.confirmCardPayment(this.transactionId, {
      payment_method: {
        card: card
      }
    }).then(function(response : any) {
      if (response.error) {
        alert(response.error.message);
      } else {
        if (response.paymentIntent.status === 'succeeded') {
          alert("Pago exitoso");
          self.paymentsService.confirm().subscribe({
            next : (response : any) => {
              alert(response)
            },
            error : (response : any) => {
              alert(response)
            }
          })
        }
      }
    });
  }
}
