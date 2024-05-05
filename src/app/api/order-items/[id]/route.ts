import { NextResponse } from "next/server";
let format = require('pg-format')
const { dbQuery } = require('../../../../../postgres')
const apiHelper = require('../../../helpers/api')

/**
 * Update an existing order_item record
 * 
 * @param request 
 * @returns 
 */
export async function PUT(request: Request) {
    let url = request.url
    let orderItemId = await apiHelper.getIdParam(url)

    // Verify that the order item exists
    let orderQuery = `
        SELECT
            id
        FROM
            public.order_item
        WHERE
            id = ${orderItemId}
    `

    let result = await dbQuery(orderQuery)
    
    // If no result found, return error
    if ( result == null || result.length == 0 ) {
        return NextResponse.json(
            { error: 'Invalid request. The order_item_id provided does not exist.' },
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

    let quantity
    let setQuery = ``

    // If order_status is included in the request, validate
    if ( requestBody.quantity != null) {
        quantity = requestBody.quantity

        setQuery += (setQuery != '') ? ',' : ''
        setQuery += `
            quantity = $$${quantity}$$
        `
    }

    let updateQuery = `
        UPDATE public.order_item
        SET
            ${setQuery}
        WHERE
            id = ${orderItemId}
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
    return NextResponse.json({ id: orderItemId });
}

/**
 * Delete an existing order_item record
 * 
 * @param request 
 * @returns 
 */
export async function DELETE(request: Request) {
    let url = request.url
    let orderItemId = await apiHelper.getIdParam(url)

    // Verify that the order_item exists
    let orderQuery = `
        SELECT
            id
        FROM
            public.order_item
        WHERE
            id = ${orderItemId}
    `

    let result = await dbQuery(orderQuery)
    
    // If no result found, return error
    if ( result == null || result.length == 0 ) {
        return NextResponse.json(
            { error: 'Invalid request. The order_item_id provided does not exist.' },
            { status: 404 }
        )
    }

    // Build query
    let deleteQuery = `
        DELETE FROM
            public.order_item
        WHERE
            id = ${orderItemId}
    `

    try {
        result = await dbQuery(deleteQuery)
    } catch (err) {
        return NextResponse.json(
            { error: `Internal error occurred.` },
            { status: 500 }
        );
    }

    return NextResponse.json({ id: orderItemId });
}