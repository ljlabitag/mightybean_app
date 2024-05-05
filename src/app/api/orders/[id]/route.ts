import { NextResponse } from "next/server";
let format = require('pg-format')
const { dbQuery } = require('../../../../../postgres')
const apiHelper = require('../../../helpers/api')

/**
 * Retrieve an existing order record
 * 
 * @param request 
 * @returns 
 */
export async function GET(request: Request) {
    let url = request.url
    let orderId = await apiHelper.getIdParam(url)

    // Verify that the order exists
    let orderQuery = `
        SELECT
            "order".id AS "order_id",
            "order".order_status,
            "order".queue_number,
            "order".total_amount,
            "barista".id AS "barista_id",
            "barista".name AS "barista_name",
            "order".creation_timestamp,
            "order".completion_timestamp
        FROM
            public.order AS "order"
        LEFT JOIN 
            public.personnel "barista" ON "barista".id = "order".barista_id
        WHERE
            "order".id = ${orderId}
    `

    let result = await dbQuery(orderQuery)
    
    // If no result found, return error
    if ( result == null || result.length == 0 ) {
        return NextResponse.json(
            { error: 'Invalid request. The order_id provided does not exist.' },
            { status: 404 }
        )
    }

    let orderRecord = result[0]

    // Get order_item records associated with the current order record
    let orderItemsQuery = `
        SELECT 
            "order_item".id AS "order_item_id",
            "item".item_name AS "item_name",
            "item".price AS "item_price",
            "order_item".quantity AS "quantity",
            "item".price * "order_item".quantity AS "item_total"
        FROM
            public.order_item AS "order_item"
        LEFT JOIN
            public.item "item" ON "item".id = "order_item".item_id
        WHERE 
            "order_item".order_id = ${orderId}
        ORDER BY
            "order_item".id ASC
    `

    result = await dbQuery(orderItemsQuery)

    // If result is null, return error
    if ( result == null) {
        return NextResponse.json(
            { error: 'There was a problem retrieving the information.' },
            { status: 500 }
        )
    }

    orderRecord.order_items = result

    return NextResponse.json(orderRecord);
}

/**
 * Update an existing order record
 * 
 * @param request 
 * @returns 
 */
export async function PUT(request: Request) {
    let allowedOrderStatus = [
        "in_queue", "preparing",
        "for_serving", "completed"
    ]

    let url = request.url
    let orderId = await apiHelper.getIdParam(url)

    // Verify that the order exists
    let orderQuery = `
        SELECT
            id
        FROM
            public.order
        WHERE
            id = ${orderId}
    `

    let result = await dbQuery(orderQuery)
    
    // If no result found, return error
    if ( result == null || result.length == 0 ) {
        return NextResponse.json(
            { error: 'Invalid request. The order_id provided does not exist.' },
            { status: 404 }
        )
    }

    // Check if request is empty
    let requestBody = await request.json()

    if (requestBody == null || Object.keys(requestBody).length === 0) {
        return NextResponse.json(
            { error: 'Bad request. The request body is empty.' },
            { status: 400 }
        )
    }

    let order_status
    let queue_number
    let completion_timestamp
    let setQuery = ``

    // If order_status is included in the request, validate
    if ( requestBody.order_status != null) {
        order_status = requestBody.order_status

        // Check if empty string
        if ( order_status == "" ) {
            return NextResponse.json(
                { error: `Bad request. order_status cannot be an empty string. Should be on of the following: ${allowedOrderStatus.join(", ")}` },
                { status: 400 }
            )
        }

        // Check if provided value is allowed
        if ( !allowedOrderStatus.includes(order_status) ) {
            return NextResponse.json(
                { error: `Bad request. '${order_status}' is not a valid value for order_status. Should be on of the following: ${allowedOrderStatus.join(", ")}` },
                { status: 400 }
            )
        }

        setQuery += (setQuery != '') ? ',' : ''
        setQuery += `
            order_status = $$${order_status}$$
        `

        // If order_status is 'in_queue', add queue_number
        if ( order_status == 'in_queue' ) {
            queue_number = `(SELECT nextval('public.order_queue_number_seq'))`

            setQuery += (setQuery != '') ? ',' : ''
            setQuery += `
                queue_number = ${queue_number}
            `
        }
        else if ( order_status == 'completed') {
            completion_timestamp = 'NOW()'

            setQuery += (setQuery != '') ? ',' : ''
            setQuery += `
            completion_timestamp = ${completion_timestamp}
            `
        }
    }

    // If calculate_total flag is set to true,
    // calculate the order total amount.
    if ( requestBody.calculate_total != null && requestBody.calculate_total ) {
        let orderItemsQuery = `
            SELECT
                item.item_name,
                item.price,
                order_item.quantity,
                item.price * order_item.quantity AS item_total
            FROM 
                public.order_item
            LEFT JOIN 
                public.item item ON item.id = order_item.item_id
            WHERE
                order_id = ${orderId}
        `

        result = await dbQuery(orderItemsQuery)

        let orderTotal
        if (result == null || result.length == 0) orderTotal = 0
        else orderTotal = result.map(i=>i.item_total).reduce((a,b)=>a+b);
        
        setQuery += (setQuery != '') ? ',' : ''
        setQuery += `
            total_amount = $$${orderTotal}$$
        `
    }

    let updateQuery = `
        UPDATE public.order
        SET
            ${setQuery}
        WHERE
            id = ${orderId}
    `

    try {
        result = await dbQuery(updateQuery)
    } catch (err) {
        return NextResponse.json(
            { error: `Internal error occurred.` },
            { status: 500 }
        );
    }

    // Send response
    return NextResponse.json({ id: orderId });
}

/**
 * Delete an existing order record
 * 
 * @param request 
 * @returns 
 */
export async function DELETE(request: Request) {
    let url = request.url
    let orderId = await apiHelper.getIdParam(url)

    // Verify that the order exists
    let orderQuery = `
        SELECT
            id
        FROM
            public.order
        WHERE
            id = ${orderId}
    `

    let result = await dbQuery(orderQuery)
    
    // If no result found, return error
    if ( result == null || result.length == 0 ) {
        return NextResponse.json(
            { error: 'Invalid request. The order_id provided does not exist.' },
            { status: 404 }
        )
    }

    // Build query
    let deleteQuery = `
        DELETE FROM
            public.order
        WHERE
            id = ${orderId}
    `

    try {
        result = await dbQuery(deleteQuery)
    } catch (err) {
        return NextResponse.json(
            { error: `Internal error occurred.` },
            { status: 500 }
        );
    }

    return NextResponse.json({ id: orderId });
}