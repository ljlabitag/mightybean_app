type Personnel = {
    id: number,
    name: string,
    email: string,
    password: string,
    role: string
}

type Order = {
    id: number,
    barista_id: number,
    completion_timestamp: Date,
    creation_timestamp: Date,
    order_status: string,
    queue_number: number,
    total_amount: number
}

type OrderItem = {
    id: number,
    order_id: number,
    item_id: number,
    quantity: number
}