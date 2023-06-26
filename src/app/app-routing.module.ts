import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CalendarioPagamentosComponent } from './modules/sistemas/calendarizacao-contas/calendario-pagamentos/calendario-pagamentos.component';


const routes: Routes = [
  { path: 'calendario', component: CalendarioPagamentosComponent },
  { path: '*', component: CalendarioPagamentosComponent },
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
