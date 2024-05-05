import { NextResponse } from "next/server";
let format = require('pg-format')
const { dbQuery } = require('../../../../postgres')

/**
 * Insert new order_item record. 
 * 
 * @param request 
 * @returns 
 */
export async function POST(request: Request) {
    let requestBody = await request.json()

    // Check if records is provided
    if (requestBody.records == null) {
        return NextResponse.json(
            { error: `Missing parameter. Please ensure that 'records' array is provided.` },
            { status: 400 }
        );    
    }

    let records = requestBody.records

    // Check if records is an array
    if (typeof records != "object") {
        return NextResponse.json(
            { error: `Invalid parameter. Please ensure that 'records' is an array.` },
            { status: 400 }
        );    
    }

    // Check if records array is empty
    if (records.length == 0) {
        return NextResponse.json(
            { error: `Invalid parameter. Please ensure that 'records' array is not empty.` },
            { status: 400 }
        );    
    }

     // Get last order_item ID
     let query = `
        SELECT
            id
        FROM
            public.order_item
        ORDER BY
            id DESC
        LIMIT 1
    `

    let result = await dbQuery(query)
    let lastId = result[0] != null && result[0].id != null ? result[0].id : 0
    let nextId = lastId + 1

    let insertArray = []

    // Loop through records
    for (let record of records) {
        let order_id
        let item_id
        let quantity
        let tempArray = []

        // Check if records is an array
        if (typeof record != "object") {
            return NextResponse.json(
                { error: `Invalid parameter. Please ensure that items in the 'record' array are of type object.` },
                { status: 400 }
            );    
        }

        // Check if object is empty
        if (Object.keys(record).length === 0) {
            return NextResponse.json(
                { error: 'Invalid parameter. Record item object is empty.' },
                { status: 400 }
            )
        }

        // Check if required params are missing
        if (
            record.order_id == null ||
            record.item_id == null ||
            record.quantity == null
        ) {
            return NextResponse.json(
                { error: 'Missing parameter(s). Please ensure that order_id, item_id, and quantity are provided.' },
                { status: 400 }
            )
        }

        // Validate order_id
        if (record.order_id != null) {
            order_id = record.order_id

            let orderQuery = `SELECT id FROM public.order WHERE id = ${order_id}`
            let result = await dbQuery(orderQuery)

            if (result == null || result.length == 0) {
                return NextResponse.json(
                    { error: 'Record not found. The provided order_id does not exist.' },
                    { status: 404 }
                )
            }

            tempArray.push(order_id)
        }

        // Validate item_id
        if (record.item_id != null) {
            item_id = record.item_id

            let itemQuery = `SELECT id FROM public.item WHERE id = ${item_id}`
            let result = await dbQuery(itemQuery)

            if (result == null || result.length == 0) {
                return NextResponse.json(
                    { error: 'Record not found. The provided item_id does not exist.' },
                    { status: 404 }
                )
            }

            tempArray.push(item_id)
        }

        if (record.quantity != null) {
            quantity = record.quantity

            tempArray.push(quantity)
        }

        tempArray.push(nextId)

        insertArray.push(tempArray)

        nextId += 1
    }

    console.log(insertArray)

    let insertQuery = format(`
        INSERT INTO
            public.order_item
                (
                    order_id, item_id, quantity, id
                )
        VALUES
            %L
        RETURNING id`, insertArray
    )

    try {
        result = await dbQuery(insertQuery)
    } catch (err) {
        return NextResponse.json(
            { error: `Internal error occurred.` },
            { status: 500 }
        );
    }

    let insertCount = result != null ? result.length : 0

    return NextResponse.json({ insertCount: insertCount });
}