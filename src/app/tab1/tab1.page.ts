import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import { BarcodeScanner, BarcodeScannerOptions } from '@ionic-native/barcode-scanner/ngx';
import { AlertController } from '@ionic/angular';
@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  tarea = "";
  tareas = [];
  tareas_marcadas = [];


  constructor(
    private qrScanner: BarcodeScanner,
    private storage: Storage,
    private alertCtrl: AlertController
  ) { }

  ngOnInit() {
    this.storage.get('tarea').then(res => {
      this.tareas = res;
      console.log(this.tareas);

    });
    this.storage.get('tarea_marcada').then(res => {
      this.tareas_marcadas = res;
      console.log(this.tareas_marcadas);

    })
  }

  scanCode() {
    // console.log("Escaneando");


    // this.qrScanner.scan().then((status) => {
    //   console.log('Scanned', status);
    //   let texto = status.text
    //   // if (texto.startsWith("http")) {
    //   //   this.inApp.create(texto, 'system');
    //   // } else {
    //   // }
    //   console.log('Texto Escaneado', texto);

    // }).catch((e) => {
    //   console.log('Error', e);
    //   // this.utilities.showToast('El Qr es incorrecto');

    // })

    this.storage.get('tarea').then(res => {

      // res.splice(1, 1);
      // this.storage.set('tarea', res);

      let request = {
        checked: false,
        content: this.tarea,
      }

      // console.log(res);
      if (res) {
        res.push(request);
        this.storage.set('tarea', res);
        console.log(res);
        this.tareas = res;
        this.tarea = "";
      } else {
        this.storage.set('tarea', [request]);
        this.tareas = [request];

        console.log(res);
        this.tarea = "";
      }

    })
  }


  marcar(index, value) {
    console.log(index, value);
    let tarea = this.tareas[index];
    tarea.index = index;
    tarea.checked = !value;
    this.storage.get('tarea_marcada').then(res => {
      console.log(res);

      if (res == null) {
        res = [tarea];
      } else {
        console.log(res);
        res.splice(index, 0, tarea);
      }
      this.tareas_marcadas = res;
      this.storage.set('tarea_marcada', res);
      this.storage.get('tarea').then(res => {
        if (res == null) {
          res = [tarea];
        } else {
          console.log(res);
          res.splice(index, 1); // Corrección aquí
        }
        this.tareas = res;
        this.storage.set('tarea', res);
      })
    })
  }

  desmarcar(index, value) {
    console.log(index, value);
    let tarea = this.tareas_marcadas[index];
    tarea.index = index;
    tarea.checked = !value;
    this.storage.get('tarea').then(res => {
      if (res == null) {
        res = [tarea];
      } else {
        console.log(res);
        if (Array.isArray(res)) {
          res.splice(index, 0, tarea);
        } else {
          res = [tarea];
        }
      }
      this.tareas = res;
      this.storage.set('tarea', res);
      this.storage.get('tarea_marcada').then(res => {
        if (res == null) {
          res = [tarea];
        } else {
          console.log(res);
          if (Array.isArray(res)) {
            res.splice(index, 1);
          } else {
            res = [];
          }
        }
        this.tareas_marcadas = res;
        this.storage.set('tarea_marcada', res);
      })
    })
  }
  async delete(index, array) {
    console.log(index);
    const alert = await this.alertCtrl.create({
      header: 'Borrar elemento',
      message: '¿Estás seguro de borrar este elemento?',
      mode: 'ios',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
          }
        }, {
          text: 'Aceptar',
          handler: () => {
            if (array == 1) {
              this.storage.get('tarea').then(res => {
                res.splice(index, 1);

                this.tareas = res;
                this.storage.set('tarea', res);
              })
            } else {
              this.storage.get('tarea_marcada').then(res => {
                res.splice(index, 1);
                this.tareas_marcadas = res;
                this.storage.set('tarea_marcada', res);
              })
            }
          }
        }
      ]
    });

    await alert.present();
  }

}
