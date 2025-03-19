// import { client } from '@/configs/NilePostgresConfig';

// export async function POST(request: Request) {
//     try {
//         // For creating a new user
//         const {
//             name, email, gender, date_of_birth, age, religion, caste, profile_image_url,
//             city, country, describe, mother_tongue, height, occupation, qualification,
//             local_address, income, smoking_status, drinking_status, smoking_preference,
//             drinking_preference, preferred_religion, preferred_caste, preferred_mother_tongue,
//             preferred_location, preferred_min_height, preferred_max_height,
//             occupation_preference, income_preference, images
//         } = await request.json();

//         // Format date
//         const formattedDate = new Date(date_of_birth).toISOString().split('T')[0];

//         await client.connect();

//         // Insert all fields (make sure your DB columns match these)
//         const query = `
//             INSERT INTO USERS (
//               name, email, gender, date_of_birth, age, religion, caste, profile_image_url,
//               city, country, describe, mother_tongue, height, occupation, qualification,
//               local_address, income, smoking_status, drinking_status, smoking_preference,
//               drinking_preference, preferred_religion, preferred_caste, preferred_mother_tongue,
//               preferred_location, preferred_min_height, preferred_max_height,
//               occupation_preference, income_preference, images
//             )
//             VALUES ($1, $2, $3, $4, $5, $6, $7, $8,
//                     $9, $10, $11, $12, $13, $14, $15,
//                     $16, $17, $18, $19, $20,
//                     $21, $22, $23, $24,
//                     $25, $26, $27,
//                     $28, $29, $30
//             )
//             RETURNING *;
//         `;

//         const values = [
//             name, email, gender, formattedDate, age, religion, caste, profile_image_url,
//             city, country, describe, mother_tongue, height, occupation, qualification,
//             local_address, income, smoking_status, drinking_status, smoking_preference,
//             drinking_preference, preferred_religion, preferred_caste, preferred_mother_tongue,
//             preferred_location, preferred_min_height, preferred_max_height,
//             occupation_preference, income_preference, images
//         ];

//         const result = await client.query(query, values);
//         await client.end();

//         return Response.json({ success: true, data: result.rows[0] });
//     } catch (error) {
//         console.error("Error inserting user:", error);
//         return Response.json(
//             { success: false, error: (error as Error).message },
//             { status: 500 }
//         );
//     }
// }

// export async function GET(request: Request) {
//     // Example GET by email
//     const email = new URL(request.url).searchParams.get('email');
//     if (!email) {
//         return Response.json(
//             { success: false, error: "Email parameter is required" },
//             { status: 400 }
//         );
//     }

//     try {
//         await client.connect();
//         const result = await client.query(
//             `SELECT * FROM USERS WHERE email=$1;`,
//             [email]
//         );
//         await client.end();

//         if (result.rows.length === 0) {
//             return Response.json(
//                 { success: false, error: "User not found" },
//                 { status: 404 }
//             );
//         }

//         return Response.json({ success: true, data: result.rows[0] });
//     } catch (error) {
//         console.error("Error fetching user:", error);
//         return Response.json(
//             { success: false, error: (error as Error).message },
//             { status: 500 }
//         );
//     }
// }

// export async function PUT(request: Request) {
//     try {
//         // For updating an existing user
//         const {
//             id, name, email, gender, date_of_birth, age, religion, caste, profile_image_url,
//             city, country, describe, mother_tongue, height, occupation, qualification,
//             local_address, income, smoking_status, drinking_status, smoking_preference,
//             drinking_preference, preferred_religion, preferred_caste, preferred_mother_tongue,
//             preferred_location, preferred_min_height, preferred_max_height,
//             occupation_preference, income_preference, images
//         } = await request.json();

//         if (!id) {
//             return Response.json(
//                 { success: false, error: "User id is required for update" },
//                 { status: 400 }
//             );
//         }

//         // Format date
//         const formattedDate = new Date(date_of_birth).toISOString().split('T')[0];

//         await client.connect();

//         // Update all columns
//         const query = `
//             UPDATE USERS
//             SET
//               name=$1, email=$2, gender=$3, date_of_birth=$4, age=$5, religion=$6, caste=$7,
//               profile_image_url=$8, city=$9, country=$10, describe=$11, mother_tongue=$12,
//               height=$13, occupation=$14, qualification=$15, local_address=$16, income=$17,
//               smoking_status=$18, drinking_status=$19, smoking_preference=$20, drinking_preference=$21,
//               preferred_religion=$22, preferred_caste=$23, preferred_mother_tongue=$24,
//               preferred_location=$25, preferred_min_height=$26, preferred_max_height=$27,
//               occupation_preference=$28, income_preference=$29, images=$30
//             WHERE id=$31
//             RETURNING *;
//         `;

//         const values = [
//             name, email, gender, formattedDate, age, religion, caste,
//             profile_image_url, city, country, describe, mother_tongue,
//             height, occupation, qualification, local_address, income,
//             smoking_status, drinking_status, smoking_preference, drinking_preference,
//             preferred_religion, preferred_caste, preferred_mother_tongue,
//             preferred_location, preferred_min_height, preferred_max_height,
//             occupation_preference, income_preference, images,
//             id
//         ];

//         const result = await client.query(query, values);
//         await client.end();

//         if (result.rows.length === 0) {
//             return Response.json(
//                 { success: false, error: "User not found" },
//                 { status: 404 }
//             );
//         }

//         return Response.json({ success: true, data: result.rows[0] });
//     } catch (error) {
//         console.error("Error updating user:", error);
//         return Response.json(
//             { success: false, error: (error as Error).message },
//             { status: 500 }
//         );
//     }
// }

import { client } from '@/configs/NilePostgresConfig';

export async function POST(request: Request) {
    try {
        // For creating a new user
        const {
            name, email, gender, date_of_birth, age, religion, caste, profile_image_url,
            city, country, describe, mother_tongue, height, occupation, qualification,
            local_address, income, smoking_status, drinking_status, smoking_preference,
            drinking_preference, preferred_religion, preferred_caste, preferred_mother_tongue,
            preferred_location, preferred_min_height, preferred_max_height,
            occupation_preference, income_preference, images
        } = await request.json();

        // Format date
        const formattedDate = new Date(date_of_birth).toISOString().split('T')[0];

        await client.connect();

        // Insert all fields (make sure your DB columns match these)
        const query = `
            INSERT INTO USERS (
              name, email, gender, date_of_birth, age, religion, caste, profile_image_url,
              city, country, describe, mother_tongue, height, occupation, qualification,
              local_address, income, smoking_status, drinking_status, smoking_preference,
              drinking_preference, preferred_religion, preferred_caste, preferred_mother_tongue,
              preferred_location, preferred_min_height, preferred_max_height,
              occupation_preference, income_preference, images
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8,
                    $9, $10, $11, $12, $13, $14, $15,
                    $16, $17, $18, $19, $20,
                    $21, $22, $23, $24,
                    $25, $26, $27,
                    $28, $29, $30
            )
            RETURNING *;
        `;

        const values = [
            name, email, gender, formattedDate, age, religion, caste, profile_image_url,
            city, country, describe, mother_tongue, height, occupation, qualification,
            local_address, income, smoking_status, drinking_status, smoking_preference,
            drinking_preference, preferred_religion, preferred_caste, preferred_mother_tongue,
            preferred_location, preferred_min_height, preferred_max_height,
            occupation_preference, income_preference, images
        ];

        const result = await client.query(query, values);
        await client.end();

        return Response.json({ success: true, data: result.rows[0] });
    } catch (error) {
        console.error("Error inserting user:", error);
        return Response.json(
            { success: false, error: (error as Error).message },
            { status: 500 }
        );
    }
}

export async function GET(request: Request) {
    const url = new URL(request.url);
    const email = url.searchParams.get('email');
    
    try {
        await client.connect();
        
        // If email is provided, get a specific user
        if (email) {
            const result = await client.query(
                `SELECT * FROM USERS WHERE email=$1;`,
                [email]
            );
            
            await client.end();
            
            if (result.rows.length === 0) {
                return Response.json(
                    { success: false, error: "User not found" },
                    { status: 404 }
                );
            }
            
            return Response.json({ success: true, data: result.rows[0] });
        } 
        // Otherwise, get all users
        else {
            const result = await client.query(
                `SELECT * FROM USERS;`
            );
            
            await client.end();
            
            return Response.json({ 
                success: true, 
                data: result.rows 
            });
        }
    } catch (error) {
        console.error("Error fetching user(s):", error);
        return Response.json(
            { success: false, error: (error as Error).message },
            { status: 500 }
        );
    }
}

export async function PUT(request: Request) {
    try {
        // For updating an existing user
        const {
            id, name, email, gender, date_of_birth, age, religion, caste, profile_image_url,
            city, country, describe, mother_tongue, height, occupation, qualification,
            local_address, income, smoking_status, drinking_status, smoking_preference,
            drinking_preference, preferred_religion, preferred_caste, preferred_mother_tongue,
            preferred_location, preferred_min_height, preferred_max_height,
            occupation_preference, income_preference, images
        } = await request.json();

        if (!id) {
            return Response.json(
                { success: false, error: "User id is required for update" },
                { status: 400 }
            );
        }

        // Format date
        const formattedDate = new Date(date_of_birth).toISOString().split('T')[0];

        await client.connect();

        // Update all columns
        const query = `
            UPDATE USERS
            SET
              name=$1, email=$2, gender=$3, date_of_birth=$4, age=$5, religion=$6, caste=$7,
              profile_image_url=$8, city=$9, country=$10, describe=$11, mother_tongue=$12,
              height=$13, occupation=$14, qualification=$15, local_address=$16, income=$17,
              smoking_status=$18, drinking_status=$19, smoking_preference=$20, drinking_preference=$21,
              preferred_religion=$22, preferred_caste=$23, preferred_mother_tongue=$24,
              preferred_location=$25, preferred_min_height=$26, preferred_max_height=$27,
              occupation_preference=$28, income_preference=$29, images=$30
            WHERE id=$31
            RETURNING *;
        `;

        const values = [
            name, email, gender, formattedDate, age, religion, caste,
            profile_image_url, city, country, describe, mother_tongue,
            height, occupation, qualification, local_address, income,
            smoking_status, drinking_status, smoking_preference, drinking_preference,
            preferred_religion, preferred_caste, preferred_mother_tongue,
            preferred_location, preferred_min_height, preferred_max_height,
            occupation_preference, income_preference, images,
            id
        ];

        const result = await client.query(query, values);
        await client.end();

        if (result.rows.length === 0) {
            return Response.json(
                { success: false, error: "User not found" },
                { status: 404 }
            );
        }

        return Response.json({ success: true, data: result.rows[0] });
    } catch (error) {
        console.error("Error updating user:", error);
        return Response.json(
            { success: false, error: (error as Error).message },
            { status: 500 }
        );
    }
}

