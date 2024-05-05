import { NextResponse } from "next/server";
let format = require('pg-format')
const { dbQuery } = require('../../../../postgres')

/**
 * Retrieve all order records
 * 
 * @param request 
 * @returns 
 */
export async function GET() {

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
        ORDER BY
            "order".queue_number ASC
    `

    let result = await dbQuery(orderQuery)
    
    // If result is null, return error
    if ( result == null) {
        return NextResponse.json(
            { error: 'There was a problem retrieving the information.' },
            { status: 500 }
        )
    }

    return NextResponse.json(result);
}

/**
 * Insert new order record. 
 * 
 * @param request 
 * @returns 
 */
export async function POST(request: Request) {
    let { barista_id }: Partial<Order> = await request.json()

    // Verify params
    if ( !barista_id ) {
        return NextResponse.json(
            { error: 'Missing parameter. Ensure that the barista_id is provided.' },
            { status: 400 }
        )
    }

    // Check if barista id exists
    let baristaQuery = `
        SELECT
            id
        FROM
            public.personnel
        WHERE
            id = ${barista_id}
    `

    let result = await dbQuery(baristaQuery)
    
    // If no result found, return error
    if ( result == null || result.length == 0 ) {
        return NextResponse.json(
            { error: 'Invalid request. The barista_id provided does not exist.' },
            { status: 404 }
        )
    }

    // Get last order ID
    let idQuery = `
        SELECT
            id
        FROM
            public.order
        ORDER BY
            id DESC
        LIMIT 1
    `
    // Get next ID
    result = await dbQuery(idQuery)
    let lastId = result[0] != null && result[0].id != null ? result[0].id : 0
    let nextId = lastId + 1

    // Create temp array for insertion
    let tempArray = [[
        nextId,
        barista_id,
        'created'
    ]]

    // Build insertion query
    let insertQuery = format(`
        INSERT INTO
            public.order
                (
                    id, barista_id, order_status
                )
        VALUES
            %L
        RETURNING id`, tempArray
    )

    // Execute query
    result = await dbQuery(insertQuery)

    // Get result
    let created = result[0] != null ? result[0] : {}

    // Send response
    return NextResponse.json(created);
}