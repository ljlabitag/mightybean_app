import { NextRequest, NextResponse } from "next/server";
let format = require('pg-format')
const { dbQuery } = require('../../../../postgres')

/**
 * Get all personnel
 * @returns 
 */
export async function GET(request: NextRequest) {
    let searchParams = request.nextUrl.searchParams
    let email = searchParams.get("email")
    let password = searchParams.get("password")
    let whereClause = ``

    // Add search params if any
    // EMAIL
    if (email != null) {
        whereClause += (whereClause != '') ? 'AND' : 'WHERE'
        whereClause += `
            email = $$${email}$$
        `
    }
    // PASSWORD
    if (password != null) {
        whereClause += (whereClause != '') ? 'AND' : 'WHERE'
        whereClause += `
        password = $$${password}$$
        `
    }

    // Build Query
    let query = `
        SELECT
            *
        FROM 
            public.personnel
        ${whereClause}
    `;
    // Run Query
    let result = await dbQuery(query);
    // Return result
    return NextResponse.json(result);
}

/**
 * Insert new personnel record. 
 * 
 * @param request 
 * @returns 
 */
export async function POST(request: Request) {
    let { name, email, password, role }: Partial<Personnel> = await request.json()

    // Verify params
    if (!name || !email || !password || !role ) {
        return NextResponse.json({ error: 'Missing parameters. Ensure that the name, email, password, and role are provided.' }, { status: 400 })
    }

    // Get last personnel ID
    let query = `
        SELECT
            id
        FROM
            public.personnel
        ORDER BY
            id DESC
        LIMIT 1
    `

    let result = await dbQuery(query)
    let lastId = result[0] != null && result[0].id != null ? result[0].id : 0
    let nextId = lastId + 1

    let tempArray = [[
        nextId,
        name,
        email,
        password,
        role
    ]]

    let insertQuery = format(`
        INSERT INTO
            public.personnel
                (
                    id, name, email, password, role
                )
        VALUES
            %L
        RETURNING id`, tempArray
    )

    result = await dbQuery(insertQuery)

    let created = result[0] != null ? result[0] : {}

    return NextResponse.json(created);
}