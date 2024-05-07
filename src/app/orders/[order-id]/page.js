
import OrderForm from "../../../components/cart/order_form";
import CartForm from "../../../components/cart/cart_form";


export default function Orders() {

    return(
        <div className="flex flex-row min-h-[580px] pl-8 pr-0 py-2">
            <OrderForm/>
            <div className='flex basis-2/5'>
                <CartForm />
            </div>
        </div>
    )
}