import { NextResponse } from "next/server";
let format = require('pg-format')
const { dbQuery } = require('../../../../postgres')

/**
 * Retrieve all item records
 * 
 * @param request 
 * @returns 
 */
export async function GET() {

    // Verify that the item exists
    let itemQuery = `
        SELECT
            "item".id AS "item_id",
            "item".item_name,
            "item".item_category,
            "item".price
        FROM
            public.item AS "item"
        ORDER BY
            "item".id ASC
    `

    let result = await dbQuery(itemQuery)
    
    // If result is null, return error
    if ( result == null) {
        return NextResponse.json(
            { error: 'There was a problem retrieving the information.' },
            { status: 500 }
        )
    }

    return NextResponse.json(result);
}
