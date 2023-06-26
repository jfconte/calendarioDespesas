import { Archive } from "./archive";
import { CategoryBill } from "./categories-bill";

export class Bill {
    id?:string;
    expenseName?:string;
    comments?:string;
    dateBill?:Date;
    category?:CategoryBill;
    isPaid?:Boolean;
    status?:string;
    idArchive?:string;
    idProofPaymentArchive?:string;

}
