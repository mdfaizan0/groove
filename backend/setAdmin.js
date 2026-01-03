import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const supabaseAdmin = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
);

async function setAdminRole(userEmail) {
    try {
        // First, find the user by email
        const { data: users, error: findError } = await supabaseAdmin.auth.admin.listUsers();

        if (findError) throw findError;

        const user = users.users.find(u => u.email === userEmail);

        if (!user) {
            console.error(`User with email ${userEmail} not found.`);
            return;
        }

        // Update user metadata
        const { data, error } = await supabaseAdmin.auth.admin.updateUserById(
            user.id,
            { user_metadata: { ...user.user_metadata, role: "admin" } }
        );

        if (error) throw error;

        console.log(`Successfully updated ${userEmail} to admin role, please logout from frontend and login again.`);
        console.log("Updated User Metadata:", data.user.user_metadata);
    } catch (error) {
        console.error("Error setting admin role:", error.message);
    }
}

// Usage: node setAdmin.js your-email@example.com
const email = process.argv[2];
if (!email) {
    console.log("Please provide an email: node setAdmin.js example@email.com");
} else {
    setAdminRole(email);
}
