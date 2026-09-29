// backend/scripts/setAdminRole.js
//
// One-off provisioning script: grants the "admin" role to a user by email.
// Usage: node backend/scripts/setAdminRole.js <email>

import supabase from '../src/config/supabase.js'

async function main() {
  const email = process.argv[2]

  if (!email) {
    console.error('Usage: node backend/scripts/setAdminRole.js <email>')
    process.exit(1)
  }

  const { data, error } = await supabase.auth.admin.listUsers({ perPage: 1000 })

  if (error) {
    console.error('Failed to list users:', error.message)
    process.exit(1)
  }

  const user = data.users.find((u) => u.email?.toLowerCase() === email.toLowerCase())

  if (!user) {
    console.error(`No user found with email: ${email}`)
    process.exit(1)
  }

  const { error: updateError } = await supabase.auth.admin.updateUserById(user.id, {
    app_metadata: { ...user.app_metadata, role: 'admin' },
  })

  if (updateError) {
    console.error('Failed to update user:', updateError.message)
    process.exit(1)
  }

  console.log(`${email} is now an admin.`)
}

main()
